#!/usr/bin/env python3
"""Keep case covers, case summaries and the public attribution page in sync."""
import argparse
from collections import defaultdict
from html import escape
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "assets/data/photo-sources.json"
CASES = ROOT / "assets/scripts/data/case-articles.js"
CREDITS = ROOT / "case-photo-sources.html"
START = "<!-- editorial-photos:start -->"
END = "<!-- editorial-photos:end -->"
COVER = re.compile(
    r'<figure class="press-photo press-cover">.*?</figure>'
    r'|<div class="press-no-photo press-cover">[^<]*</div>',
    re.S,
)


def link(url, label):
    return f'<a href="{escape(url, quote=True)}">{escape(label)}</a>'


def cover(photo, edits):
    caption = " ／ ".join((
        escape(photo["caption"]),
        f'撮影：{escape(photo["creator"])}',
        link(photo["licenseUrl"], photo["license"]),
        link(photo["sourceUrl"], "写真の出典"),
    ))
    return (
        '<figure class="press-photo press-cover">'
        f'<img src="../{escape(photo["path"], quote=True)}" alt="{escape(photo["alt"], quote=True)}" '
        f'width="{photo["width"]}" height="{photo["height"]}" decoding="async" '
        'onerror="this.closest(\'figure\').classList.add(\'photo-error\');this.remove()">'
        '<div class="press-photo-error" aria-hidden="true"></div>'
        f'<figcaption>写真：{caption}<br>'
        f'{escape(photo.get("context", ""))}{escape(edits)}</figcaption></figure>'
    )


def credits_html(data, articles):
    index = json.loads((ROOT / "assets/data/council-sessions.json").read_text(encoding="utf-8"))
    themes = {theme["id"]: theme["label"] for theme in index["themes"]}
    council = data["council"]
    use = defaultdict(list)
    for slug, key in data["cases"].items():
        use[key].append(link(f"articles/{slug}.html", articles[slug]["title"]))
    for theme, key in council["byTheme"].items():
        use[key].append(link(f"gikai.html#records?theme={theme}", themes[theme]))
    for record, key in council["byRecord"].items():
        use[key].append(link(f"gikai.html#record/{record}", record))
    rows = []
    for key, photo in data["assets"].items():
        rows.append(
            f'<li id="photo-{escape(key, quote=True)}"><strong>{escape(photo["caption"])}</strong>'
            f'<br>撮影：{escape(photo["creator"])} ／ {link(photo["licenseUrl"], photo["license"])}'
            f' ／ {link(photo["sourceUrl"], "写真の出典")} ／ {link(photo["imageUrl"], "原画像")}'
            f'<br>使用先：{"、".join(use[key]) or escape(photo.get("previousUse", "未使用"))}</li>'
        )
    row_html = "\n".join(rows)
    return (
        f'{START}\n<section aria-labelledby="editorial-photo-title">'
        '<h2 id="editorial-photo-title">市議会と海外事例の写真</h2>'
        f'<p>確認日：{escape(data["verifiedOn"])}。{escape(data["edits"])}</p>\n'
        f'<ul class="editorial-photo-credits">{row_html}</ul></section>\n{END}'
    )


def render(data):
    script = CASES.read_text(encoding="utf-8")
    prefix = "const ABIKO_STORIES="
    assert script.startswith(prefix)
    items, end = json.JSONDecoder().raw_decode(script[len(prefix):])
    articles = {item["slug"]: item for item in items}
    output = {}
    for slug, key in data["cases"].items():
        photo = data["assets"][key]
        item = articles[slug]
        item.update(
            image=photo["path"],
            photoCredit=f'写真：{photo["caption"]} ／ {photo["creator"]} ／ {photo["license"]}',
            photoCreator=photo["creator"],
            photoLicense=photo["license"],
            photoSource=photo["sourceUrl"],
            photoLicenseUrl=photo["licenseUrl"],
            photoExact="context" not in photo,
            photoSubject=photo["caption"],
        )
        page = ROOT / "articles" / f"{slug}.html"
        markup, count = COVER.subn(lambda _: cover(photo, data["edits"]), page.read_text(encoding="utf-8"))
        assert count == 1, slug
        output[page] = markup
    output[CASES] = prefix + json.dumps(items, ensure_ascii=False, separators=(",", ":")) + script[len(prefix) + end:]
    page = CREDITS.read_text(encoding="utf-8")
    section = credits_html(data, articles)
    if START in page:
        before, after = page.split(START, 1)
        output[CREDITS] = before + section + after.split(END, 1)[1]
    else:
        output[CREDITS] = page.replace("</main>", "\n" + section + "</main>", 1)
    return output


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    for photo in data["assets"].values():
        assert (ROOT / photo["path"]).is_file(), photo["path"]
        assert all(photo[key].startswith("https://") for key in ("sourceUrl", "imageUrl", "licenseUrl")), photo
    for path, content in render(data).items():
        if args.check:
            if path.read_text(encoding="utf-8") != content:
                parser.exit(1, f"{path.relative_to(ROOT)} differs. Run python3 scripts/sync_photo_assets.py.\n")
        else:
            path.write_text(content, encoding="utf-8")


if __name__ == "__main__":
    main()
