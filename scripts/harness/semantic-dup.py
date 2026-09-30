#!/usr/bin/env python3
"""Layer + meaning-level duplicate checks (common.md 「하네스 작성」「중복」·계층 표)."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

# App paths / package facts must not live in .ai/rules/
RULES_IN_PROJECTS = re.compile(
    r"backend/java/labs-api|frontend/react/labs-web|com\.minhyuck\.labs"
)
# Shell command blocks belong in {app}/AGENTS.md, not projects domain body
PROJECTS_BASH = re.compile(r"^```bash", re.M)


def check_file(path: Path) -> list[str]:
    rel = path.relative_to(ROOT).as_posix()
    text = path.read_text(encoding="utf-8")
    errors: list[str] = []

    if rel.startswith(".ai/rules/") and RULES_IN_PROJECTS.search(text):
        errors.append(f"{rel}: app path/package in .ai/rules (use .ai/projects/)")

    if rel.startswith(".ai/projects/") and PROJECTS_BASH.search(text):
        errors.append(f"{rel}: ```bash in projects (commands only in {{app}}/AGENTS.md)")

    if rel == ".ai/projects/labs-api.md":
        if re.search(r"^-\s+HTTP\s+\*\*8080\*\*", text, re.M):
            errors.append(
                f"{rel}: HTTP 8080 duplicates {app_agents('labs-api')} "
                "「Build & test」 (keep port in AGENTS only)"
            )

    if rel == "frontend/react/labs-web/AGENTS.md":
        if "http://localhost:8080" in text and "→" in text:
            errors.append(
                f"{rel}: proxy/8080 URL duplicates .ai/projects/labs-web.md "
                "「백엔드 연동 (로컬 dev)」"
            )

    if rel == ".ai/KNOWLEDGE.md":
        if text.count("「하네스·일관성 검증」") > 2:
            errors.append(f"{rel}: harness verification prose repeated (use one pointer)")

    # Entry files: same Read-before-write sentence in CLAUDE + copilot (meaning dup)
    if rel in (".github/copilot-instructions.md", "CLAUDE.md"):
        pass  # checked cross-file below

    return errors


def app_agents(app: str) -> str:
    if app == "labs-api":
        return "backend/java/labs-api/AGENTS.md"
    return "frontend/react/labs-web/AGENTS.md"


def cross_file(harness_mds: list[Path]) -> list[str]:
    errors: list[str] = []
    read_rule = re.compile(
        r"Read-before-write · `\.ai/rules/common\.md` 「하네스 작성」 · `\.ai/rules/README\.md`"
    )
    hits = []
    for p in harness_mds:
        if p.name in ("CLAUDE.md", "copilot-instructions.md") or p.as_posix().endswith(
            "copilot-instructions.md"
        ):
            if read_rule.search(p.read_text(encoding="utf-8")):
                hits.append(p.relative_to(ROOT).as_posix())
    if len(hits) > 1:
        errors.append(
            f"semantic: identical Read-before-write rule body in {', '.join(hits)} "
            "(one entry template; others → pointer to AGENTS.md)"
        )
    return errors


def harness_md_files() -> list[Path]:
    out: list[Path] = []
    for p in ROOT.rglob("*"):
        if ".git" in p.parts or "node_modules" in p.parts:
            continue
        if p.suffix != ".md":
            continue
        rel = p.relative_to(ROOT).as_posix()
        if (
            rel.startswith(".ai/")
            or rel == "AGENTS.md"
            or rel.endswith("/AGENTS.md")
            or rel == "CLAUDE.md"
            or rel.endswith("/CLAUDE.md")
            or rel == "README.md"
            or rel.startswith("docs/")
            or rel == ".github/copilot-instructions.md"
        ):
            out.append(p)
    return sorted(out)


def main() -> int:
    files = harness_md_files()
    errors: list[str] = []
    for f in files:
        errors.extend(check_file(f))
    errors.extend(cross_file(files))
    for e in errors:
        print(e, file=sys.stderr)
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
