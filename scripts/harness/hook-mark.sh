#!/usr/bin/env bash
# afterFileEdit (Cursor) / PostToolUse (Claude Code). Records what kind of file the agent edited this turn.
input="$(cat | tr -d '\n')"
root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
state_dir="${root}/.git"
[[ -d "${state_dir}" ]] || { echo '{}'; exit 0; }

file_path="$(sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' <<< "${input}")"
[[ -z "${file_path}" ]] && { echo '{}'; exit 0; }

touch "${state_dir}/harness-edited"

harness_regex='(^|/)(AGENTS\.md|CLAUDE\.md|README\.md|copilot-instructions\.md)$|(^|/)\.ai/|(^|/)\.cursor/(rules/|hooks\.json)|(^|/)\.claude/|(^|/)docs/|(^|/)scripts/harness/'
if [[ "${file_path}" =~ ${harness_regex} ]]; then
  touch "${state_dir}/harness-dirty"
fi

echo '{}'
exit 0
