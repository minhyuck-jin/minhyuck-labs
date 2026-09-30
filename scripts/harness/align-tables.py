#!/usr/bin/env python3
"""Markdown pipe tables: align columns only when every cell is English (no Hangul)."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

SEP_RE = re.compile(r"^:?-+:?$")
HANGUL_RE = re.compile(r"[\u3131-\u318E\uAC00-\uD7A3]")


def split_row(line: str) -> list[str] | None:
    s = line.strip()
    if not s.startswith("|") or not s.endswith("|"):
        return None
    parts = s.split("|")
    if len(parts) < 3:
        return None
    return [p.strip() for p in parts[1:-1]]


def is_separator(cells: list[str]) -> bool:
    return bool(cells) and all(SEP_RE.match(c) for c in cells)


def row_has_hangul(cells: list[str]) -> bool:
    return any(HANGUL_RE.search(c) for c in cells)


def table_is_english_only(rows: list[list[str]]) -> bool:
    for row in rows:
        if is_separator(row):
            continue
        if row_has_hangul(row):
            return False
    return True


def format_row(cells: list[str]) -> str:
    return "| " + " | ".join(cells) + " |"


def format_compact(rows: list[list[str]]) -> list[str]:
    out: list[str] = []
    ncols = len(rows[0])
    header = rows[0] if rows else []
    min_widths = [max(3, len(c)) for c in header] if header else [3] * ncols
    for row in rows:
        if is_separator(row):
            sep_cells = ["-" * min_widths[i] for i in range(ncols)]
            out.append(format_row(sep_cells))
        else:
            out.append(format_row(row))
    return out


def format_aligned(rows: list[list[str]]) -> list[str]:
    if not rows:
        return []
    ncols = len(rows[0])
    if any(len(r) != ncols for r in rows):
        return None  # type: ignore[return-value]
    widths = [3] * ncols
    for row in rows:
        if is_separator(row):
            continue
        for i, cell in enumerate(row):
            widths[i] = max(widths[i], len(cell))
    out: list[str] = []
    for row in rows:
        if is_separator(row):
            sep_cells = ["-" * widths[i] for i in range(ncols)]
            out.append(format_row(sep_cells))
        else:
            padded = [row[i].ljust(widths[i]) for i in range(ncols)]
            out.append(format_row(padded))
    return out


def format_table(rows: list[list[str]]) -> list[str] | None:
    if any(len(r) != len(rows[0]) for r in rows):
        return None
    if table_is_english_only(rows):
        return format_aligned(rows)
    return format_compact(rows)


def iter_tables(lines: list[str]):
    i = 0
    while i < len(lines):
        cells = split_row(lines[i])
        if cells is None:
            i += 1
            continue
        start = i
        block: list[list[str]] = []
        while i < len(lines):
            c = split_row(lines[i])
            if c is None:
                break
            block.append(c)
            i += 1
        if len(block) >= 2 and is_separator(block[1]):
            yield start, i, block
        else:
            i = start + 1


def process_file(path: Path, fix: bool) -> list[str]:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)
    plain = [ln.rstrip("\n") for ln in lines]
    errors: list[str] = []
    replacements: list[tuple[int, int, list[str]]] = []

    for start, end, block in iter_tables(plain):
        formatted = format_table(block)
        if formatted is None:
            errors.append(f"{path}:{start + 1}: ragged column count in table")
            continue
        expected = plain[start:end]
        if expected != formatted:
            kind = "english" if table_is_english_only(block) else "hangul"
            errors.append(
                f"{path}:{start + 1}: table format ({kind}; align only if all cells English, no Hangul)"
            )
            replacements.append((start, end, formatted))

    if fix and replacements:
        for start, end, formatted in reversed(replacements):
            plain[start:end] = formatted
            lines[start:end] = [a + "\n" for a in formatted]
        path.write_text("".join(lines), encoding="utf-8")

    return errors if not fix else [e for e in errors if "ragged" in e]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("files", nargs="*")
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--fix", action="store_true")
    args = parser.parse_args()
    if args.check and args.fix:
        print("use either --check or --fix", file=sys.stderr)
        return 2
    if not args.check and not args.fix:
        args.check = True

    paths = [Path(p) for p in args.files] if args.files else []
    all_errors: list[str] = []
    for path in paths:
        if not path.is_file():
            continue
        errs = process_file(path, fix=args.fix)
        all_errors.extend(errs)

    for e in all_errors:
        print(e, file=sys.stderr)
    return 1 if all_errors else 0


if __name__ == "__main__":
    sys.exit(main())
