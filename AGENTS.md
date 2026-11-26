# Project instructions for Codex, Claude Code and contributors

## Non-negotiable design freeze
This repository represents the **Abiko Dashboard v0.82** baseline. Refactoring must preserve all existing pages, content, styling, URLs, interactive behavior, DOM behavior and accessibility. Do not invent or change civic figures, article text, photos, labels, legends or source citations as part of a code refactor.

1. Inspect `README.md`, `docs/ARCHITECTURE.md` and `docs/DESIGN_FREEZE.md` before changes.
2. Use `python3 tests/check_integrity.py` after every change. `--strict-baseline` is a one-time migration audit and intentionally fails for future purposeful edits.
3. For visual/interaction changes, use `tests/visual_regression.py` with the versioned baseline; report any nonzero visual difference.
4. CSS source file order and classic (non-module) JS execution order are essential. NEVER alphabetize, concatenate, minify, reformat, split, defer or module-convert deployed CSS/JS without regression coverage and review.
5. Do not replace verified numbers with AI guesses, and keep data attribution, source period and retrieval date separate.
6. Preserve relative URLs and all 21 article permalinks.
7. Submit a reviewable diff, explain risk, and wait for the operator's approval before merging to `main` or manually running the production workflow. After Pages is enabled, the workflow publishes approved changes from `main`.
8. Keep GitHub repository provider-neutral: no required ChatGPT Sites or Claude deployment API.
9. Preserve baseline snapshots and record decisions in docs. Keep secrets and credentials out of repository.

Recommended workflow: new branch → focused change → static validation → browser comparison → operator approval → merge to `main` → verify the Pages deployment.
