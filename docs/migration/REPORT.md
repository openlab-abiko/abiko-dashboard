# v0.82 file-system migration report

Origin: `abiko_dashboard_v82_cards_metadata_nav_organized.zip` (2026-11-17).

Migration principles:
- All shipped HTML entrypoint URLs are unchanged.
- Original CSS and JavaScript bytes are unchanged; only file locations have changed.
- Every existing `<link rel=stylesheet>` and `<script src>` is preserved in its original order.
- All 21 article pages are carried forward.
- No new runtime frameworks, dependencies, analytics, third-party APIs or database were added.

Files `file-map.json` and `html-reference-changes.json` provide deterministic reverse mappings.

Note: migrating JS to ES modules, removing old CSS overrides, and deduplicating embedded article HTML will be separate projects. Such changes could affect the actual rendered product and are intentionally deferred until full interaction tests exist.

Runtime dependency discovered: `commons-content.js` dynamically injects `assets/js/v34.js`. Exact original code is kept both in `assets/scripts/legacy/v34.js` and at the original URL `assets/js/v34.js`. This is intentional for compatibility.
