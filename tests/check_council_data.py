#!/usr/bin/env python3
"""Check council coverage, references, and the voting data used by the renderer."""
from collections import Counter
from datetime import date
import json
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from sync_council_data import load_council

TYPES = {"bill", "petition", "question", "resolution", "report"}
POSITIONS = {"yes", "no", "left", "absent", "chair"}
ID = re.compile(r"[a-z][a-z0-9-]*\Z")


def valid_date(value):
    return date.fromisoformat(value).isoformat() == value


def validate_sources(session, record):
    refs = [
        *record["sources"],
        *(qa["source"] for qa in record.get("exchanges", [])),
        *(remark["source"] for remark in record.get("remarks", [])),
        *(event["source"] for event in record["article"].get("milestones", [])),
    ]
    if record.get("voting"):
        refs.append(record["voting"]["source"])
    assert refs, record["id"]
    for ref in refs:
        source = session["sources"][ref["id"]]
        if "page" in ref:
            assert int(ref["page"]) == ref["page"] > 0, ref
            assert ref.get("endPage", ref["page"]) >= ref["page"], ref
            assert urlsplit(source["url"]).path.lower().endswith(".pdf"), ref
    for qa in record.get("exchanges", []):
        source = session["sources"][qa["source"]["id"]]
        assert valid_date(source["date"]) and source["venue"], qa
        assert source["edition"] in ("provisional", "final"), qa
        assert qa["speaker"] and qa["question"], qa
        if qa.get("answer"):
            assert qa["role"], qa


def votes(session, record):
    ballot = record["voting"]
    assert ballot["default"] in POSITIONS
    assert set(ballot["exceptions"]) <= set(session["members"]), record["id"]
    assert set(ballot["exceptions"].values()) <= POSITIONS
    return Counter(ballot["exceptions"].get(name, ballot["default"]) for name in session["members"])


def main():
    site = load_council()
    sessions = {session["meta"]["id"]: session for session in site["sessions"]}
    assert len(sessions) == len(site["sessions"])
    themes = {theme["id"] for theme in site["themes"]}
    assert len(themes) == len(site["themes"]) and all(ID.fullmatch(theme) for theme in themes)
    by_id = {
        (session_id, record["id"]): record
        for session_id, session in sessions.items()
        for record in session["records"]
    }

    for session_id, session in sessions.items():
        meta = session["meta"]
        assert re.fullmatch(r"\d{4}-\d{2}(?:-[a-z0-9]+)*", session_id)
        assert all(valid_date(meta[field]) for field in ("start", "end", "checkedOn"))
        assert meta["start"] <= meta["end"]
        assert len(set(session["members"])) == len(session["members"])
        for source in session["sources"].values():
            parsed = urlsplit(source["url"])
            assert parsed.scheme == "https" and parsed.netloc and source["label"], source
        counts = Counter(record["type"] for record in session["records"])
        assert counts == Counter(meta["expectedCounts"]) and set(counts) <= TYPES
        assert len({record["id"] for record in session["records"]}) == len(session["records"])
        for record in session["records"]:
            assert ID.fullmatch(record["id"]) and record["id"].startswith(record["type"] + "-")
            for field in ("label", "title", "officialTitle", "lead", "status"):
                assert record[field].strip(), (record["id"], field)
            assert record["themes"] and set(record["themes"]) <= themes, record["id"]
            assert valid_date(record["date"]) and meta["start"] <= record["date"] <= meta["end"]
            if record.get("submittedOn"):
                assert valid_date(record["submittedOn"]) and record["submittedOn"] <= record["date"]
            assert isinstance(record["article"]["points"], list)
            assert isinstance(record["article"]["questions"], list)
            validate_sources(session, record)
            if record.get("voting"):
                assert sum(votes(session, record).values()) == len(session["members"])
            if record["type"] == "question":
                assert record["person"] and record["group"]
            related = record.get("related", [])
            assert len(related) == len(set(related))
            for identifier in related:
                target = tuple(identifier.split("/", 1)) if "/" in identifier else (session_id, identifier)
                assert target in by_id and target != (session_id, record["id"]), identifier
        for event in session["calendar"]:
            assert valid_date(event["date"]) and meta["start"] <= event["date"] <= meta["end"]

    september = sessions["2026-09"]
    records = {record["id"]: record for record in september["records"]}
    fixture = ROOT / "tests/fixtures/council-record-ids-2026-09.json"
    original_ids = json.loads(fixture.read_text(encoding="utf-8"))
    assert len(september["records"]) == len(records) == len(set(original_ids)) == len(original_ids) == 52
    assert set(records) == set(original_ids)
    vote_count = 0
    for record in records.values():
        if record["type"] in ("question", "report"):
            assert "voting" not in record
            if record["type"] == "question":
                assert any(qa.get("answer") for qa in record["exchanges"]), record["id"]
            continue
        vote_count += 1
        expected = {"yes": 22, "no": 0, "left": 0, "absent": 1, "chair": 1}
        if record["id"] == "bill-7":
            expected.update(yes=20, no=1, left=1)
        elif record["id"] in ("bill-17", "bill-18"):
            expected.update(yes=20, no=2)
        elif record["id"] == "petition-11":
            expected.update(yes=0, no=21, left=1)
        observed = votes(september, record)
        assert all(observed.get(key, 0) == value for key, value in expected.items()), record["id"]
    assert vote_count == 32
    assert records["bill-7"]["voting"]["exceptions"]["船橋優"] == "no"
    assert records["bill-7"]["voting"]["exceptions"]["岩井康"] == "left"
    assert records["petition-11"]["voting"]["exceptions"]["早川真"] == "left"
    assert records["bill-13"]["related"] and "bill-13" in records["question-6"]["related"]
    assert len(records["bill-13"]["exchanges"]) == 3

    photos = site["photos"]
    assert set(photos["byTheme"]) == themes
    assert set(photos["byRecord"]) <= {"/".join(key) for key in by_id}
    for photo in photos["assets"].values():
        assert photo["path"].startswith("assets/images/editorial/")
        assert (ROOT / photo["path"]).is_file()
        assert photo["width"] > 0 and photo["height"] > 0
    for meeting in (*site["yearMeetings"], *site["extraMeetings"]):
        assert valid_date(meeting["date"]) and meeting["status"]
        assert urlsplit(meeting["url"]).scheme == "https"
        if "end" in meeting:
            assert valid_date(meeting["end"]) and meeting["end"] >= meeting["date"]
        if "session" in meeting:
            assert sessions[meeting["session"]]["meta"]["start"] == meeting["date"]
    assert site["legacySession"] == "2026-09"
    if site["nextMeeting"]:
        assert valid_date(site["nextMeeting"]["checkedOn"])
        assert valid_date(site["nextMeeting"]["date"])
    print(f"PASS: {len(by_id)} records, {vote_count} checked September roll calls, sources and routes resolve.")


if __name__ == "__main__":
    main()
