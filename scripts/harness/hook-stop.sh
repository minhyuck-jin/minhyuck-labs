#!/usr/bin/env bash
# stop (Cursor) / Stop (Claude Code). Forces a harness review turn when the agent edited files this turn.
# Usage: hook-stop.sh cursor|claude
tool="${1:-cursor}"
input="$(cat | tr -d '\n')"
root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
state_dir="${root}/.git"
max_rounds=3

no_action() {
  echo '{}'
  exit 0
}

[[ -d "${state_dir}" ]] || no_action
grep -qE '"status"[[:space:]]*:[[:space:]]*"(aborted|error)"' <<< "${input}" && no_action

edited=0
dirty=0
[[ -f "${state_dir}/harness-edited" ]] && edited=1
[[ -f "${state_dir}/harness-dirty" ]] && dirty=1
if [[ "${edited}" -eq 0 ]]; then
  rm -f "${state_dir}/harness-rounds"
  no_action
fi
rm -f "${state_dir}/harness-edited" "${state_dir}/harness-dirty"

rounds=$(( $(cat "${state_dir}/harness-rounds" 2>/dev/null || echo 0) + 1 ))
if [[ "${rounds}" -gt "${max_rounds}" ]]; then
  rm -f "${state_dir}/harness-rounds"
  no_action
fi
echo "${rounds}" > "${state_dir}/harness-rounds"

correction_steps="[지적 반영] 이번 턴에 사용자 지적이 있었으면 아래를 모두 수행한다. 없었으면 '지적 없음' 한 줄만 적는다.
1. 지적 내용 수정
2. .ai/KNOWLEDGE.md 「지적 반영」 기준으로 규칙인지 1회성인지 판단
3. 규칙이면 KNOWLEDGE.md 표의 해당 파일에 반영
4. 기계로 잡을 수 있으면 scripts/harness/banned.txt 또는 scripts/harness/check.sh 에 추가"

pending_steps="[Pending] AGENTS.md 「하네스·일관성 검증」Pending. 직전 assistant 턴에서 사용자 미답 질문·선택지가 있으면 ## Pending 블록, 없으면 Pending: 없음 한 줄. 하네스 점검: … 보고 **다음**에 적는다."

if [[ "${dirty}" -eq 1 ]]; then
  check_output="$(bash "${root}/scripts/harness/check.sh" 2>&1)"
  check_status=$?
  message="[하네스 강제 점검] 이번 턴에 하네스 파일이 바뀌었다. 완료 전에 아래를 수행한다.
1. scripts/harness/check.sh 결과 (exit ${check_status}):
${check_output}
2. 실패 항목이 있으면 고친다.
3. 하네스 파일 전부 Read: AGENTS.md, 모든 nested AGENTS.md·CLAUDE.md, .ai/ 아래 전부, .cursor/rules/, .github/copilot-instructions.md
4. 판단 점검: 파일 간 중복 본문, 파일 성격(역할 표: .ai/KNOWLEDGE.md), 내용 타당성, 실제 코드·설정과 일치, 옛 경로 잔재
${correction_steps}
마지막에 '하네스 점검: 확인함' 또는 '하네스 점검: 수정함 (무엇)' 한 줄을 보고한다.
${pending_steps}"
else
  message="[지적 반영 점검] 이번 턴에 파일이 바뀌었다.
0. 직전 턴 사용자 요청(설명·분석·리뷰 등)에 대한 답이 아직 끝나지 않았거나 hook으로 끊겼으면, 아래 [지적 반영]·Pending **앞에** 그 답을 **다시 보여주거나** 이어서 완료한다. '지적 없음' 한 줄만으로 대체하지 않는다.
${correction_steps}
${pending_steps}"
fi

escaped="$(printf '%s' "${message}" | awk 'BEGIN { ORS = "" } { gsub(/\\/, "\\\\"); gsub(/"/, "\\\""); gsub(/\t/, " "); if (NR > 1) print "\\n"; print }')"

if [[ "${tool}" == "claude" ]]; then
  printf '{"decision":"block","reason":"%s"}\n' "${escaped}"
else
  printf '{"followup_message":"%s"}\n' "${escaped}"
fi
exit 0
