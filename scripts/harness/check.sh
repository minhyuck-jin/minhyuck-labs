#!/usr/bin/env bash
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "${ROOT}" || exit 1

BANNED_FILE="scripts/harness/banned.txt"
DUP_ALLOW_FILE="scripts/harness/dup-allow.txt"
MIN_DUP_LENGTH=25
KNOWLEDGE_SECTIONS=(
  "## 지적 반영 (같은 턴)"
  "## 공통으로 승격 (사람 승인)"
  "## 검증"
  "## 하지 않는 것"
  "## Cursor 전용 (선택, 나중)"
)

failures=0

fail() {
  echo "FAIL [$1] $2"
  failures=$((failures + 1))
}

harness_files() {
  find . \( -path ./.git -o -name build -o -name node_modules -o -name .gradle -o -name .idea \) -prune -o -type f \( \
    -path './.ai/*.md' -o \
    -name AGENTS.md -o \
    -name CLAUDE.md -o \
    -path './.cursor/rules/*.mdc' -o \
    -path './.github/copilot-instructions.md' \
  \) -print | sed 's|^\./||' | sort
}

all_repo_paths() {
  find . \( -path ./.git -o -name build -o -name node_modules -o -name .gradle -o -name .idea \) -prune -o -print | sed 's|^\./||'
}

HARNESS_FILES="$(harness_files)"
REPO_PATHS="$(all_repo_paths)"

# 1. layer: .ai/rules must not contain app-specific facts
while IFS= read -r hit; do
  [[ -z "${hit}" ]] && continue
  fail "layer" "${hit}"
done < <(grep -nE 'labs-api|com\.minhyuck|Postgres' .ai/rules/*.md 2>/dev/null)

# 2. KNOWLEDGE.md holds procedure sections only
if [[ -f .ai/KNOWLEDGE.md ]]; then
  while IFS= read -r heading; do
    allowed=0
    for section in "${KNOWLEDGE_SECTIONS[@]}"; do
      [[ "${heading}" == "${section}" ]] && allowed=1
    done
    [[ "${allowed}" -eq 0 ]] && fail "knowledge" ".ai/KNOWLEDGE.md section not allowed: ${heading}"
  done < <(grep -E '^## ' .ai/KNOWLEDGE.md)
fi

# 3. broken references: backtick paths in harness files (except generic .ai/rules)
while IFS= read -r file; do
  [[ "${file}" == .ai/rules/* ]] && continue
  dir="$(dirname "${file}")"
  line_no=0
  while IFS= read -r line || [[ -n "${line}" ]]; do
    line_no=$((line_no + 1))
    [[ "${line}" == *TO-DO* ]] && continue
    while IFS= read -r token; do
      [[ -z "${token}" ]] && continue
      [[ "${token}" =~ ^[A-Za-z0-9_./-]+$ ]] || continue
      [[ "${token}" == /* || "${token}" == ./* ]] && continue
      [[ "${token}" == *'{'* || "${token}" == *'*'* || "${token}" == *'...'* ]] && continue
      if [[ "${token}" != */* && ! "${token}" =~ \.(md|mdc|sh|ps1|yaml|yml|gradle|json|txt)$ ]]; then
        continue
      fi
      candidate="${token%/}"
      if [[ -e "${candidate}" || -e "${dir}/${candidate}" ]]; then
        continue
      fi
      if [[ "${candidate}" != */* ]] && grep -qE "(^|/)${candidate//./\\.}$" <<< "${REPO_PATHS}"; then
        continue
      fi
      fail "ref" "${file}:${line_no} missing path \`${token}\`"
    done < <(grep -oE '`[^`]+`' <<< "${line}" | tr -d '`')
  done < "${file}"
done <<< "${HARNESS_FILES}"

# 4. duplicates: same sentence body in two or more harness files
dup_input=""
while IFS= read -r file; do
  case "${file}" in
    CLAUDE.md|*/CLAUDE.md|.github/copilot-instructions.md) continue ;;
  esac
  dup_input+="$(awk -v f="${file}" -v min="${MIN_DUP_LENGTH}" '
    /^```/ { in_code = !in_code; next }
    in_code { next }
    {
      line = $0
      sub(/^[[:space:]]*([-*]|[0-9]+\.)[[:space:]]+/, "", line)
      sub(/^[[:space:]]+/, "", line)
      sub(/[[:space:]]+$/, "", line)
      if (line == "" || line ~ /^#/ || line ~ /^\|[-| ]+\|$/ || line ~ /^---$/) next
      if (length(line) < min) next
      print f "\t" line
    }' "${file}")"$'\n'
done <<< "${HARNESS_FILES}"

allowed_dups=""
[[ -f "${DUP_ALLOW_FILE}" ]] && allowed_dups="$(grep -vE '^[[:space:]]*(#|$)' "${DUP_ALLOW_FILE}" | cut -f1)"

while IFS=$'\t' read -r count sentence files; do
  [[ -z "${sentence}" ]] && continue
  if [[ -n "${allowed_dups}" ]] && grep -qxF "${sentence}" <<< "${allowed_dups}"; then
    continue
  fi
  fail "dup" "${files}: ${sentence}"
done < <(printf '%s' "${dup_input}" | awk -F'\t' '
  NF == 2 {
    if (!((($2) SUBSEP ($1)) in seen)) {
      seen[$2, $1] = 1
      count[$2]++
      files[$2] = (files[$2] == "" ? $1 : files[$2] ", " $1)
    }
  }
  END { for (s in count) if (count[s] > 1) print count[s] "\t" s "\t" files[s] }')

# 5. banned patterns (grows with user corrections)
if [[ -f "${BANNED_FILE}" ]]; then
  while IFS=$'\t' read -r pattern reason; do
    [[ -z "${pattern}" || "${pattern}" == \#* ]] && continue
    while IFS= read -r hit; do
      [[ -z "${hit}" ]] && continue
      fail "banned" "${hit} (${reason:-no reason})"
    done < <(grep -rnF --exclude-dir=.git --exclude-dir=build --exclude-dir=node_modules --exclude-dir=.gradle --exclude-dir=.idea \
      --exclude=banned.txt --exclude=check.sh -- "${pattern}" . 2>/dev/null)
  done < "${BANNED_FILE}"
fi

if [[ "${failures}" -gt 0 ]]; then
  echo "harness check: ${failures} failure(s)"
  exit 1
fi
echo "harness check: OK"
