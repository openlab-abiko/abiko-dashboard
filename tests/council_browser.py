#!/usr/bin/env python3
"""Verify the council redesign under a GitHub Pages style project subdirectory."""
import argparse
from collections import Counter
from datetime import datetime, timezone
import json
from pathlib import Path
import re
import shutil
import sys
from tempfile import TemporaryDirectory

from playwright.sync_api import expect, sync_playwright

from check_council_data import votes
from visual_regression import DETERMINISTIC_RANDOM, server

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from sync_council_data import load_council


def page_for(browser, origin, width, height):
    page = browser.new_page(viewport={"width": width, "height": height}, reduced_motion="reduce")
    page.set_default_timeout(7000)
    page.route("**/*", lambda route: route.continue_() if route.request.url.startswith(origin) else route.abort())
    return page


def no_overflow(page):
    assert page.evaluate("document.documentElement.scrollWidth === window.innerWidth")


def count(page, number, total):
    expect(page.locator("#council-result-count")).to_have_text(f"{number}件 / 全{total}件")
    expect(page.locator("#council-results > li")).to_have_count(number)


def grid_columns(grid, columns):
    assert grid.evaluate("el => getComputedStyle(el).gridTemplateColumns.split(' ').length") == columns


def aligned_card_links(grid, selector, columns):
    grid.page.mouse.move(0, 0)
    bottoms = grid.locator(selector).evaluate_all(
        "(links, columns) => links.slice(0, columns).map(link => link.getBoundingClientRect().bottom)",
        columns,
    )
    assert len(bottoms) == columns
    assert max(bottoms) - min(bottoms) <= 1, bottoms


def chip_metrics(chips):
    return chips.evaluate_all("""chips => chips.map(chip => {
      const style = getComputedStyle(chip);
      return [style.fontSize, style.fontWeight, style.lineHeight, style.padding,
              style.borderRadius, chip.getBoundingClientRect().height];
    })""")


def exercise_home_cards(browser, origin, viewport):
    width, height = viewport
    page = page_for(browser, origin, width, height)
    # This seed includes the Toshima article in the real homepage selection.
    page.add_init_script(DETERMINISTIC_RANDOM.replace("state = 42;", "state = 8;"))
    # Serve a local portrait fixture at the photo URL for an offline layout check.
    page.route(
        re.compile(r"/Special:FilePath/2024%20Toshima%20Ecomusee%20Town\.jpg"),
        lambda route: route.fulfill(path=ROOT / "assets/images/editorial/emergency-bag.webp", content_type="image/webp"),
    )
    root = origin + "abiko-dashboard/"
    page.goto(root + "index.html")
    cards = page.locator(".v80-editorial-card")
    toshima = cards.filter(has=page.locator('a[href="articles/toshima-cityhall.html"]'))
    expect(toshima).to_have_count(1)
    toshima.locator("img").scroll_into_view_if_needed()
    expect(toshima.locator("img")).to_have_js_property("complete", True)
    assert toshima.locator("img").evaluate("img => img.naturalHeight > img.naturalWidth > 0")
    for frame in cards.locator(".v80-card-media:has(.v66-photo)").all():
        box = frame.bounding_box()
        assert abs(box["width"] / box["height"] - 16 / 9) < 0.02, box
    expect(toshima.locator("img")).to_have_css("object-fit", "cover")
    expect(cards.locator(".v80-category").first).to_have_css("border-radius", "999px")
    expect(cards.locator(".v82-card-tag").first).to_have_css("border-radius", "999px")
    aligned_card_links(page.locator(".v64-brief-grid"), ".v80-card-bottom", {1440: 3, 768: 2, 390: 1}[width])
    no_overflow(page)
    label_size = page.locator(".v78-pickup-heading span").evaluate("el => getComputedStyle(el).fontSize")
    page.goto(root + "gikai.html")
    expect(page.locator("#council-pickup-title")).to_have_css("font-size", label_size)
    page.close()
    print(f"PASS: {width} × {height}, homepage photo crops and aligned card links.")


def exercise_photos(browser, origin):
    page = page_for(browser, origin, 390, 844)
    root = origin + "abiko-dashboard/"
    photos = json.loads((ROOT / "assets/data/photo-sources.json").read_text(encoding="utf-8"))
    for slug, key in photos["cases"].items():
        photo = photos["assets"][key]
        page.goto(root + f"articles/{slug}.html")
        cover = page.locator("figure.press-cover")
        expect(cover.locator("img")).to_have_attribute("src", "../" + photo["path"])
        assert cover.locator("img").evaluate("img => img.complete && img.naturalWidth > 0")
        expect(cover.locator("figcaption")).to_contain_text(photo["caption"])
        expect(cover.locator("figcaption")).to_contain_text(photo["creator"])
        expect(cover.get_by_role("link", name=photo["license"])).to_have_attribute("href", photo["licenseUrl"])
        if "context" in photo:
            expect(cover.locator("figcaption")).to_contain_text(photo["context"])
        no_overflow(page)

    page.goto(root + "gikai.html#records")
    safety_card = page.locator("#council-results li").filter(
        has=page.locator('a[href="#record/2026-09/bill-1"]'),
    )
    expect(safety_card.locator("img")).to_have_attribute("src", "assets/images/editorial/disaster-relief-supplies.webp")
    credit = safety_card.locator(".council-photo-credit a")
    expect(credit).to_have_text("写真はイメージです")
    assert credit.bounding_box()["y"] > safety_card.locator(".v73-bill-lead").bounding_box()["y"]
    anchor = credit.get_attribute("href")
    credit.click()
    expect(page).to_have_url(root + anchor)
    expect(page.locator("#" + anchor.split("#")[1])).to_be_in_viewport()
    expect(page.locator(".editorial-photo-credits > li")).to_have_count(len(photos["assets"]))

    page.route("**/assets/images/editorial/*.webp", lambda route: route.abort())
    page.goto(root + "gikai.html#records")
    card = page.locator("#council-results li").first
    frame = card.locator(".council-photo-frame")
    frame.scroll_into_view_if_needed()
    expect(frame.locator("img")).to_be_hidden()
    expect(frame.locator("span")).to_be_visible()
    box = frame.bounding_box()
    assert abs(box["width"] / box["height"] - 16 / 9) < 0.02, box
    card.locator("h2 a").click()
    expect(page.locator("#council-article-title")).to_be_visible()
    page.close()
    print("PASS: seven local case covers, photo credits and stable missing-image fallback.")


def exercise(browser, origin, baseline_origin, viewport):
    width, height = viewport
    page = page_for(browser, origin, width, height)
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.on("response", lambda response: errors.append(f"{response.status} {response.url}")
            if response.url.startswith(origin) and response.status >= 400 else None)
    base = origin + "abiko-dashboard/gikai.html"
    site = load_council()
    records = [item for session in site["sessions"] for item in session["records"]]
    total = len(records)
    columns = {1440: 3, 768: 2, 390: 1}[width]
    page.goto(base)
    expect(page.locator("#council-title")).to_have_text("市議会を見る")
    expect(page.locator("#globalHeader")).to_contain_text("あびこ、どうなってる？")
    no_overflow(page)

    if baseline_origin:
        old = page_for(browser, baseline_origin, width, height)
        old.goto(baseline_origin + "gikai.html")
        for selector in ("#globalHeader .v37-header-inner", "footer.v45-footer", "#v79Overlay .v79-overlay-inner"):
            expect(old.locator(selector)).to_have_count(1)
            # Compare relative markup. The browser URLs use different server roots.
            assert old.locator(selector).inner_html() == page.locator(selector).inner_html(), selector
        old.close()

    menu = page.locator("#menuToggle")
    menu.focus()
    menu.press("Enter")
    expect(page.locator("#v79Overlay")).to_be_visible()
    page.keyboard.press("Escape")
    expect(page.locator("#v79Overlay")).to_be_hidden()
    expect(menu).to_be_focused()

    pickup = page.locator("#council-pickup-results")
    tabs = page.locator("#council-pickup-tabs")
    more = page.get_by_role("button", name="もっと見る")
    routes = pickup.locator(".council-result-link")
    record_by_route = {
        "#record/" + session["meta"]["id"] + "/" + item["id"]: item
        for session in site["sessions"] for item in session["records"]
    }

    def pickup_links():
        return routes.evaluate_all("links => links.map(link => link.getAttribute('href'))")

    expect(page.locator("#g-home > section")).to_have_count(2)
    expect(page.locator("#pickup h2")).to_have_text("Pick UP")
    expect(page.locator("#council-edition-title")).to_have_text("2026年9月定例会")
    edition = page.locator(".council-edition")
    expect(edition.locator("a")).to_have_count(5)
    expect(edition.locator("time")).to_have_text(["2026年9月2日", "9月29日"])
    expect(edition.locator("img")).to_have_count(0)
    edition.get_by_role("link", name="一般質問").click()
    expect(page).to_have_url(base + "#records?type=question&session=2026-09")
    count(page, 12, total)
    page.locator('[data-council-nav="home"]').click()
    expect(tabs.get_by_role("button", pressed=True)).to_have_text("すべて")
    expect(tabs.get_by_role("button", pressed=True)).to_have_css("border-radius", "999px")
    first_batch = pickup_links()
    assert len(first_batch) == len(set(first_batch)) == 15
    assert len({record_by_route[route]["type"] for route in first_batch}) == 5
    page.reload()
    assert pickup_links() != first_batch, "The order should change on reload"
    grid_columns(pickup, columns)
    aligned_card_links(pickup, ".g-billbottom", columns)
    no_overflow(page)

    initial = pickup_links()
    expect(routes.first).to_have_text(record_by_route[initial[0]]["title"])
    first_image = pickup.locator("img").first
    first_image.scroll_into_view_if_needed()
    expect(first_image).to_have_js_property("complete", True)
    assert first_image.evaluate("img => img.naturalWidth > 0")
    expect(pickup.locator(".council-photo-credit a")).to_have_text(["写真はイメージです"] * 15)
    routes.first.click()
    expect(page).to_have_url(base + initial[0])
    expect(page.locator("#council-article-title")).to_have_text(record_by_route[initial[0]]["title"])
    page.locator('[data-council-nav="home"]').click()
    assert pickup_links() == initial

    before = initial
    for expected_count in (30, 45, total):
        more.scroll_into_view_if_needed()
        before_scroll = page.evaluate("window.scrollY")
        more.click()
        after = pickup_links()
        assert len(after) == len(set(after)) == expected_count
        assert after[:len(before)] == before
        assert page.evaluate("window.scrollY") >= before_scroll - 2
        before = after
    expect(more).to_be_hidden()
    assert set(before) == set(record_by_route)

    for theme in site["themes"]:
        tabs.get_by_role("button", name=theme["label"], exact=True).click()
        expected = [route for route in before if theme["id"] in record_by_route[route]["themes"]]
        assert pickup_links() == expected[:15], theme["id"]
        expect(tabs.get_by_role("button", pressed=True)).to_have_text(theme["label"])
        if len(expected) <= 15:
            expect(more).to_be_hidden()
        else:
            more.click()
            assert pickup_links() == expected[:30], theme["id"]

    tabs.get_by_role("button", name="すべて", exact=True).click()
    assert pickup_links() == initial
    page.get_by_role("link", name="すべての記録を探す", exact=False).click()
    expect(page.locator("#allBills h1")).to_be_focused()
    count(page, total, total)
    no_overflow(page)
    results = page.locator("#council-results")
    grid_columns(results, columns)
    aligned_card_links(results, ".g-billbottom", columns)
    expect(results.locator(".council-official")).to_have_count(0)
    cards = results.locator(".council-result-card")
    first_card_link = cards.first.locator("h2 a")
    expect(first_card_link).to_have_css("text-decoration-line", "none")
    if width == 1440:
        first_card_link.hover()
        expect(first_card_link).to_have_css("text-decoration-line", "none")
        expect(cards.first).to_have_css("transform", "none")
        for session in site["sessions"]:
            for item in session["records"]:
                route = "#record/" + session["meta"]["id"] + "/" + item["id"]
                card = cards.filter(has=page.locator(f'h2 a[href="{route}"]'))
                if item["type"] != "bill" or not item.get("voting"):
                    expect(card.locator(".g-vote-pill")).to_have_count(0)
                    continue
                totals = votes(session, item)
                labels = [f"賛成 {totals['yes']}人", f"反対 {totals['no']}人"]
                if totals["left"]:
                    labels.append(f"退席 {totals['left']}人")
                expect(card.locator(".g-vote-pill")).to_have_text(labels)
                expect(card.locator(".g-vote-pill--no.has-no")).to_have_count(int(totals["no"] > 0))
        page.mouse.move(0, 0)
    expect(page.locator("#council-search select option[value='']")).to_have_text(["すべて"] * 3)
    theme_link = results.locator(".council-tag-list a").first
    theme_href = theme_link.get_attribute("href")
    theme_link.click()
    expect(page).to_have_url(base + theme_href)
    page.locator("#council-reset").click()
    count(page, total, total)
    type_counts = Counter(item["type"] for item in records)
    for type_id, expected in type_counts.items():
        page.locator("#council-type").select_option(type_id)
        count(page, expected, total)
    page.locator("#council-type").select_option("")
    for theme in site["themes"]:
        page.locator("#council-theme").select_option(theme["id"])
        count(page, sum(theme["id"] in item["themes"] for item in records), total)
    page.locator("#council-theme").select_option("")
    for session in site["sessions"]:
        page.locator("#council-session").select_option(session["meta"]["id"])
        count(page, len(session["records"]), total)

    page.locator("#council-session").select_option("2026-09")
    page.locator("#council-type").select_option("bill")
    page.locator("#council-theme").select_option("care")
    search = page.locator("#council-keyword")
    search.fill("介護認定 ８８６")
    search.press("Enter")
    count(page, 1, total)
    expect(page).to_have_url(re.compile(r"#records\?type=bill&theme=care&session=2026-09&q="))
    card_chips = chip_metrics(cards.locator(".council-chip"))
    assert card_chips and all(size == card_chips[0] for size in card_chips), card_chips
    expect(cards.locator(".council-meta time")).to_have_attribute("datetime", "2026-09-29")
    page.locator("#council-results h2 a").click()
    expect(page.locator("#council-article-title")).to_have_text("介護認定の待ち時間をどう縮める？")
    expect(page.locator("#council-article-title")).to_be_focused()
    article_chips = chip_metrics(page.locator(".council-detail-header .council-chip"))
    assert article_chips == card_chips, (article_chips, card_chips)
    expect(page.locator(".council-detail-header .council-official")).to_contain_text("介護保険特別会計補正予算")
    expect(page.locator(".council-detail-header .council-official time")).to_have_attribute("datetime", "2026-09-02")
    article_back = page.locator("#council-article-back")
    expect(article_back).to_have_css("text-decoration-line", "none")
    if width == 1440:
        article_back.hover()
        expect(article_back).to_have_css("text-decoration-line", "none")
    page.keyboard.press("Tab")
    article_back.focus()
    expect(article_back).to_have_css("outline-style", "solid")
    expect(page.locator("#council-article .council-qa")).to_have_count(3)
    labels = page.locator("#council-article .council-qa dt .council-chip")
    expect(labels).to_have_text(["質問・指摘", "市の答弁"] * 3)
    for chip in labels.all():
        expect(chip).to_have_css("font-weight", "400")
        expect(chip).to_have_css("color", "rgb(255, 255, 255)")
        expect(chip).to_have_css("background-color", "rgb(23, 99, 76)")
        expect(chip).to_have_css("border-radius", "999px")
    expect(page.locator(".council-milestones li")).to_have_count(3)
    expect(page.locator("#council-article .council-qa").first).to_contain_text("坂巻宗男")
    expect(page.locator("#council-article .council-qa").first).to_contain_text("介護保険室長")
    expect(page.locator("#council-article .council-qa a").first).to_have_attribute("href", re.compile(r"\.pdf#page=25$"))
    expect(page.locator(".council-vote-yes dd")).to_have_text("22人")
    expect(page.locator(".council-vote-chair dd")).to_have_text("1人")
    vote_source = page.locator(".council-voting .council-citation")
    expect(vote_source).to_have_css("font-size", "12px")
    expect(vote_source.locator("a")).to_have_css("font-size", "12px")
    expect(vote_source.locator("a")).to_have_attribute("href", re.compile(r"saiketsukekkaR8\.9\.pdf#page=2$"))
    page.locator(".council-rollcall summary").click()
    expect(page.locator(".council-rollcall dl")).to_contain_text("日暮俊一")
    no_overflow(page)

    page.get_by_role("link", name="介護保険の使い方と、認定を待つ時間を問う").click()
    expect(page.locator("#council-article-title")).to_contain_text("介護保険の使い方")
    expect(page.locator("#council-article .council-qa").first).to_contain_text("内田美恵子")
    expect(page.locator(".council-article-aside a[href$='/bill-13']")).to_have_count(1)
    page.locator("#council-article-back").click()
    count(page, 1, total)
    expect(search).to_have_value("介護認定 ８８６")
    search.fill("該当しないテスト語")
    expect(page.locator("#council-empty")).to_be_visible()
    count(page, 0, total)
    page.locator("#council-reset").click()
    expect(search).to_be_focused()
    count(page, total, total)
    search.fill(records[0]["officialTitle"])
    search.press("Enter")
    count(page, 1, total)
    page.locator("#council-reset").click()
    page.locator("[name=divided]").check()
    count(page, 3, total)

    page.goto(base + "#bills")
    count(page, 24, total)
    page.goto(base + "#allBills")
    count(page, 24, total)
    page.goto(base + "#record=bill-13")
    expect(page.locator("#council-article .council-qa")).to_have_count(3)
    page.locator(".council-detail-header .council-tag-list").get_by_text("介護・福祉", exact=True).click()
    expect(page).to_have_url(base + "#records?theme=care&session=2026-09")
    expect(page.locator("#council-theme")).to_have_value("care")
    page.goto(origin + "abiko-dashboard/council.html#bill-7")
    expect(page).to_have_url(base + "#bill-7")
    expect(page.locator(".council-vote-no dd")).to_have_text("1人")
    expect(page.locator(".council-vote-left dd")).to_have_text("1人")
    expect(page.locator(".council-vote-absent dd")).to_have_text("1人")
    page.goto(base + "#record/2026-09/petition-11")
    expect(page.locator(".council-vote-no dd")).to_have_text("21人")
    expect(page.locator(".council-voting")).to_contain_text("早川真議員")
    page.goto(base + "#highlights")
    expect(page.locator("#pickup")).to_be_visible()
    page.goto(base + "#themes")
    expect(tabs).to_be_visible()
    page.goto(base + "#stories")
    expect(search).to_have_value("給食")
    assert {"bill-10", "report-kyushoku", "petition-20", "resolution-2"} <= set(
        results.locator(".council-result-link").evaluate_all(
            "links => links.map(link => link.getAttribute('href').split('/').at(-1))",
        )
    )
    page.goto(base + "#debate")
    expect(page.locator("#council-qa .council-qa")).to_have_count(3)
    page.goto(base + "#calendar")
    expect(page.locator("#g-schedule")).to_be_visible()
    page.goto(base + "#learning")
    expect(page.locator("#g-guide")).to_be_visible()
    faq = page.locator(".council-faq")
    expect(faq.locator("details")).to_have_count(10)
    expect(faq.locator("details[open]")).to_have_count(0)
    faq.locator("summary").first.press("Space")
    faq.locator("summary").nth(1).click()
    expect(faq.locator("details[open]")).to_have_count(2)
    expect(faq.locator("details").first.locator(".council-faq-answer")).to_be_visible()
    faq.locator("summary").first.press("Enter")
    expect(faq.locator("details[open] summary")).to_have_text("「予算」と「決算」は何が違う？")
    expect(page.locator(".council-relationship h3")).to_have_text(["市民", "市議会", "市長", "市役所"])
    expect(page.locator(".council-year-diagram li")).to_have_count(4)
    expect(page.locator(".council-record-types article")).to_have_count(6)
    assert page.locator(".council-branches").evaluate("""branch => {
      const horizontal = getComputedStyle(branch, '::after');
      const trunk = getComputedStyle(branch, '::before');
      const parse = parseFloat;
      return parse(trunk.height) >= parse(horizontal.top) &&
        [...branch.children].every(node => {
          const line = getComputedStyle(node, '::before');
          return parse(line.top) + parse(line.height) >= 0 &&
            Math.abs(node.offsetTop + parse(line.top) - parse(horizontal.top)) <= 1;
        });
    }""")
    page.get_by_role("link", name="議案が決まるまで", exact=True).click()
    expect(page).to_have_url(base + "#guide-process")
    expect(page.locator("#guide-process h2")).to_be_focused()
    steps = page.locator(".council-process li")
    expect(steps.locator(".council-diagram-motion")).to_have_text(["01", "02", "03", "04", "05"])
    expect(steps.first.locator(".council-step-number")).to_have_css("border-radius", "999px")
    expect(steps.first.locator(".council-diagram-motion")).to_have_css("animation-name", "none")
    grid_columns(page.locator(".council-process"), 5 if width == 1440 else 1)
    no_overflow(page)

    if width == 1440:
        page.emulate_media(reduced_motion="no-preference")
        page.reload()
        number = page.locator(".council-step-number").first
        expect(number).to_have_css("animation-name", "council-diagram-arrival")
        page.emulate_media(reduced_motion="reduce")
        expect(number).to_have_css("animation-name", "none")
    page.goto(base + "#sources")
    expect(page.locator("#council-primary-sources")).to_contain_text("暫定版")
    page.clock.set_fixed_time(datetime(2026, 12, 30, tzinfo=timezone.utc))
    page.locator('[data-council-nav="schedule"]').click()
    expect(page).to_have_url(base + "#schedule")
    page.reload()
    expect(page.locator("#council-next-schedule")).to_contain_text("招集予定")
    expect(page.locator("#council-next-schedule .g-small time")).to_have_attribute("datetime", site["nextMeeting"]["checkedOn"])
    expect(page.locator("#council-next-schedule")).to_contain_text("13:00")
    expect(page.locator("#council-year-checked time")).to_have_attribute("datetime", site["yearMeetingsCheckedOn"])
    year_meetings = page.locator("#council-year-meetings")
    expect(year_meetings.locator("li")).to_have_count(len(site["yearMeetings"]))
    for row, meeting in zip(year_meetings.locator("li").all(), site["yearMeetings"]):
        expect(row).to_contain_text(meeting["name"])
        expect(row).to_contain_text(meeting["status"])
        expect(row.locator("time").first).to_have_attribute("datetime", meeting["date"])
        if "end" in meeting:
            expect(row.locator("time").last).to_have_attribute("datetime", meeting["end"])
        expect(row.get_by_role("link", name="公式の会期資料")).to_have_attribute("href", meeting["url"])
    expect(page.locator("#council-extra-meetings")).to_contain_text("採決結果公開済み")
    year_meetings.get_by_role("link", name="会期内の詳しい日程").click()
    expect(page).to_have_url(base + "#schedule-2026-09")
    expect(page.locator("#schedule-2026-09")).to_be_visible()
    timeline = page.locator("ol.council-calendar-list")
    expect(timeline.locator("li")).to_have_count(11)
    assert timeline.locator("li").evaluate_all("""rows => rows.every((row, i) => !i ||
      row.offsetLeft === rows[i - 1].offsetLeft && row.offsetTop > rows[i - 1].offsetTop)""")
    assert timeline.locator("li").first.evaluate("row => getComputedStyle(row, '::after').width === '1px'")
    no_overflow(page)

    if width == 1440:
        # Open each exact article route and ensure all record-to-record links are valid.
        valid_routes = {
            "#record/" + session["meta"]["id"] + "/" + item["id"]: (session, item)
            for session in site["sessions"] for item in session["records"]
        }
        for route, (session, item) in valid_routes.items():
            page.goto(base + route)
            expect(page.locator("#council-article-title")).to_have_text(item["title"])
            expect(page.locator(".council-article-aside h2").last).to_have_text("根拠となる公式資料")
            for link in page.locator(".council-article-aside a[href^='#record/']").all():
                assert link.get_attribute("href") in valid_routes
            expect(page.locator(".council-detail-header .council-official")).to_contain_text(item["officialTitle"])
            if item.get("submittedOn"):
                expect(page.locator(".council-detail-header .council-official time")).to_have_attribute(
                    "datetime", item["submittedOn"],
                )
            references = [
                *item["sources"],
                *(exchange["source"] for exchange in item.get("exchanges", [])),
                *(remark["source"] for remark in item.get("remarks", [])),
                *(event["source"] for event in item["article"].get("milestones", [])),
            ]
            if item.get("voting"):
                references.append(item["voting"]["source"])
            expected_urls = {
                session["sources"][ref["id"]]["url"] + (f"#page={ref['page']}" if ref.get("page") else "")
                for ref in references
            }
            actual_urls = page.locator("#council-article a.council-source-link").evaluate_all(
                "links => links.map(link => link.getAttribute('href'))",
            )
            assert expected_urls <= set(actual_urls), route
            styles = page.locator("#council-article :is(.council-citation, .council-source-link)").evaluate_all(
                """notes => notes.map(note => {
                    const style = getComputedStyle(note);
                    return [style.fontSize, style.fontWeight, style.lineHeight];
                })""",
            )
            assert styles and all(style == ["12px", "400", "18.6px"] for style in styles), (route, styles)
    assert not errors, errors
    page.close()
    print(f"PASS: {width} × {height}, council navigation, photo cards, pickup order, search, article routes, calendar and diagrams.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--baseline", type=Path, help="Optional unchanged checkout for navigation/footer comparison")
    args = parser.parse_args()
    viewports = ((1440, 900), (768, 960), (390, 844))
    with TemporaryDirectory() as temp, sync_playwright() as playwright:
        parent = Path(temp)
        (parent / "abiko-dashboard").symlink_to(ROOT, target_is_directory=True)
        browser = playwright.chromium.launch(executable_path=shutil.which("chromium"),
                                             args=["--no-sandbox", "--disable-dev-shm-usage"])
        with server(parent) as origin:
            if args.baseline:
                with server(args.baseline.resolve()) as baseline_origin:
                    for viewport in viewports:
                        exercise(browser, origin, baseline_origin, viewport)
            else:
                for viewport in viewports:
                    exercise(browser, origin, None, viewport)
            exercise_photos(browser, origin)
            for viewport in viewports:
                exercise_home_cards(browser, origin, viewport)
        browser.close()


if __name__ == "__main__":
    main()
