# AGENTS.md — minhyuck-labs

이 저장소의 에이전트 규칙 입구다. Cursor·Claude Code·GitHub Copilot은 모두 이 파일에서 시작한다.

## 도구 입구

| 도구 | 입구 |
| --- | --- |
| Cursor | 이 파일 + (선택) `.cursor/rules/*.mdc` — Cursor 전용, 다른 도구는 무시 |
| Claude Code | `CLAUDE.md` → 이 파일 (앱은 해당 `AGENTS.md` / `CLAUDE.md`) |
| GitHub Copilot | `.github/copilot-instructions.md` → 이 파일 |

- 도구별 파일에 `.ai/rules/` 본문을 복사하지 않는다. 원본은 `.ai/rules/`와 이 파일이다.
- 환경·스택·성숙도·**harness 작성 양식** 본문: `.ai/rules/common.md` 「환경·스택」·「하네스 작성」 (`common.md`는 코드·하네스 작업 시 **항상** Read).

## 앱 (monorepo)

루트 `AGENTS.md`는 전역 규칙·읽기 순서·지도만 둔다. 빌드·test 명령은 nested `AGENTS.md`에만 둔다.

### 앱 지도

| Path                      | Module AGENTS                       | Domain (`.ai/projects/`) |
| ------------------------- | ----------------------------------- | ------------------------ |
| `backend/java/labs-api`   | `backend/java/labs-api/AGENTS.md`   | `labs-api.md`            |
| `frontend/react/labs-web` | `frontend/react/labs-web/AGENTS.md` | `labs-web.md`            |
| `mobile/android`          | TO-DO                               | TO-DO                    |
| `mobile/ios`              | TO-DO                               | TO-DO                    |

| 규칙 | 내용 |
| --- | --- |
| nested Read | `backend/**` · `frontend/**` · `mobile/**` 실행 앱이 있으면 해당 nested `AGENTS.md`를 먼저 Read 한다 |
| 미구현 표기 | `README.md` · `docs/` · 앱 표에 `생기면` · `예정` 대신 **TO-DO**만 쓴다 |
| 앱 경로 | `{영역}/{스택}/{앱 id}` (예: `backend/java/labs-api`, `frontend/react/labs-web`). 스택 폴더만 두고 앱 id 없이 (`frontend/react` 만) 두지 않는다 |
| IDE | monorepo **루트 clone Open** 한다. IntelliJ·Cursor **New Project**로 레포 밖에 앱을 새로 만들지 않는다 |
| 프론트 초기화 | 레포 안 경로에서 Vite 등 CLI로 만든다. nested `AGENTS.md` · `.ai/projects/`를 먼저 맞춘다 |
| 빌드 명령 | `./gradlew` · `npm run` 등은 nested `AGENTS.md`를 따른다 |

본문: 스택·버전·DB — `.ai/projects/{앱}.md`

## New PC / dev bootstrap

### 트리거

- 새 PC, clone 직후, 로컬 개발 환경 세팅 요청.

| 항목 | 값 |
| --- | --- |
| Floor | JDK 25 + Docker 엔진 Running + Node.js (`npm` on PATH). clone만으로 JDK·Docker·Node는 설치되지 않는다 |
| Postgres | `.ai/projects/labs-api.md` 「DB · MyBatis · Flyway」 |
| labs-web | `frontend/react/labs-web/AGENTS.md` 「Build & test」. setup 스크립트는 `npm ci` · `npm run test` 까지 실행한다 |
| 스크립트 | `scripts/setup.sh` (macOS/Linux), `scripts/setup.ps1` (Windows) |
| 설치 파일 | Git에 두지 않는다. brew / winget / 공식 설치 |
| 막힘 | Docker Desktop 첫 실행·EULA·관리자 권한은 사용자 개입. 스크립트가 다음 액션을 출력하면 거기서 멈춘다 |

### 순서

1. 이 섹션 + `backend/java/labs-api/AGENTS.md` + `.ai/projects/labs-api.md` + `frontend/react/labs-web/AGENTS.md` Read
2. OS에 맞는 `scripts/setup.sh` 또는 `scripts/setup.ps1` 실행 (JDK·Docker·Node/`npm` 검사, 가능하면 설치 시도, `./gradlew test`, labs-web `npm ci` · `npm run test`)
3. Docker 엔진 Running 확인 후 로컬 Run은 각 앱 nested AGENTS 「Build & test」
4. 설치 바이너리를 커밋하지 않는다

### 메타

| 항목 | 값 |
| --- | --- |
| 사람용 복붙 프롬프트 | 루트 `README.md` Setup Guide |
| 구현 근거 | 이 섹션과 `.ai` |

## Read-before-write (코드·하네스 수정 전)

- 파일을 **수정·생성·삭제**하기 **전**, 그 턴의 **첫 도구 호출**은 Read 이어야 한다.
- 대화 요약, 이전 채팅, “읽었을 것”으로 Read를 건너뛰지 않는다.
- Read 없이 `Write` / `StrReplace` 등 변경 도구를 호출하지 않는다.

### Read 순서 (이 파일 기준)

1. 이 파일
2. `.ai/rules/common.md`, `.ai/rules/quality.md`
3. 아래 「읽기 순서」에 해당하는 rules · projects · 코드 파일

인덱스: `.ai/rules/README.md`

## 읽기 순서 (토큰 — 필요한 것만)

- `.ai/rules/` 전체를 매번 읽지 않는다.
- `.ai/rules/`에 앱 전용(경로, JPA 유무, Postgres 등)을 쓰지 않는다. 층: `.ai/rules/common.md` 「하네스 작성」 계층 표.

### 항상 (코드·하네스 작업)

| 파일 |
| --- |
| `common.md` |
| `quality.md` |

### 작업 경로·주제에 따라 추가

| 조건 | 추가로 Read |
| --- | -------- |
| `backend/**` Java·Spring | `java.md` |
| `frontend/**` React | `react.md` |
| HTTP API 설계·구현 | `api.md` |
| SQL·DB·스키마 | `sql.md` + **해당 앱** `.ai/projects/{앱}.md` |
| 테스트 작성·수정 | `testing.md` |
| Git 조작·push·작업 마무리 | `git.md` |
| 특정 앱·도메인 | `.ai/projects/{앱}.md` (있을 때만) |

### 근거

- 구현·분석·`README.md`/`docs` 역할: `.ai/rules/common.md` 「하네스 작성」「근거 · 사용자 설명」.

## 작업 후 — 검증 보고

답변·작업 마무리 시 아래 표기를 구분한다 (단일 출처; `git.md`는 포인터).

| 표기 | 의미 |
| --- | --- |
| **확인함** | Read·실행·재현으로 직접 확인한 내용 |
| **미확인** | 코드·설정을 읽지 않았거나, 사용자 말·추측에만 의존 |
| **미실행: 사유** | 테스트·빌드·린트·수동 확인을 돌리지 않음 (이유 명시) |

- 테스트·빌드·린트 “통과”는 **실제로 실행한 경우만** 적는다.
- 확인한 범위(예: 변경 파일, 특정 모듈)를 함께 적는다.

## 작업 완료 (Definition of done)

### 대상

- `backend/java/labs-api`의 Java·설정·Gradle 변경.

- **완료·merge 가능**이라고 말하기 전에 아래 **하나**를 만족한다.
  1. 모듈 루트에서 `./gradlew test`를 실행했고 **확인함**으로 보고한다.
  2. GitHub **labs-api test** workflow가 해당 커밋·PR에서 **green**이다.
- 둘 다 아니면 **“통과”, “문제없음”, “테스트 OK”**를 쓰지 않고 **`미실행: 사유`**만 쓴다.
- CI가 있는데 로그를 보지 않고 통과를 주장하지 않는다.

## 건드리지 말 것

| 금지 | 내용 |
| --- | --- |
| 커밋·push | `.env`, `.env.*`, API 키, DB 비밀번호, `**/credentials*`, 기타 비밀 파일 |
| Git 조작 | `git reset --hard`, force push, hook 우회 — `.ai/rules/git.md` 「하지 않는 것」 |
| 하네스 | 요청·`.ai/KNOWLEDGE.md` 절차 없이 rules 전체를 다른 파일에 복붙하지 않는다 |

## 문서 동기화

- 폴더 구조, 공개 프로젝트 목록, 하네스 경로가 바뀌면 **같은 작업에서** 루트 `README.md`와 `docs/`를 맞춘다.
- 기능이 의미 있게 바뀌면 `.ai/projects/`와 `docs/` 해당 소개만 최신화한다. 요청 없는 홍보 문구는 쓰지 않는다.
- `README.md`의 `Version` · `History`는 사용자가 요청할 때만 올린다.

## 레이아웃

| 경로 | 용도 |
| --- | --- |
| `.ai/rules/` | 공통 기술 규칙. 인덱스: `.ai/rules/README.md` |
| `.ai/KNOWLEDGE.md` | 지적 반영·공통 승격 절차 |
| `.ai/projects/` | AI가 읽는 업무·도메인 |
| `docs/` | 사람용 (소개, 경력, 프로젝트 요약) |
| `backend/` `frontend/` `mobile/` | 코드 |
| `.cursor/rules/` | Cursor 전용 glob (선택) |
| `.cursor/hooks.json`, `.claude/settings.json` | 하네스 점검 hook |
| `scripts/` | setup, `scripts/harness/check.sh` |
| `.github/workflows/` | CI (예: `labs-api-test.yml`, `harness-check.yml`) |

## 작업 방식

- 작업 단위가 바뀌면 새 대화에서 시작한다.
- 답변은 간결하게 한다. 긴 설명은 요청할 때만 한다.
- 저장소 전체를 훑지 않는다. 관련 파일에서 시작해 호출 관계를 따라간다.
- 광범위한 조사가 필요하면 서브에이전트에 위임한다.
- 파일 경로는 줄이지 않고 전체 경로로 적는다.

## 하네스·일관성 검증 (필수 — 사용자에게 묻기 전)

- 트리거 중 **하나라도** 해당하면 완료 보고 전 아래를 **직접** 수행한다.
- 사용자가 「하네스 점검해」라고 말할 때까지 기다리지 않는다.
- harness·문서 정리를 **끝**이라고 말하기 전: 저장소 **모든** `.md`와 harness `.mdc`를 `.ai/rules/common.md` 「하네스 작성」 기준으로 Read하고 `scripts/harness/check.sh`를 **green**으로 돌린다. 일부만 손본 뒤 전체 완료처럼 보고하지 않는다.
- 한 줄·문구 수정도 트리거다. “작은 수정이라 생략”하지 않는다.
- 검증 결과를 작업 마무리에 **확인함** / **수정함** 한 줄 적는다.

### 트리거

- `.ai/` · `AGENTS.md` · nested `AGENTS.md` · `CLAUDE.md` · `.cursor/rules/` · `README.md` · `docs/` 수정·생성.
- **profile** · YAML · `build.gradle` · 폴더 구조 변경.
- **사용자 지적** (문구·규칙·설정 등).

### 강제 장치

| 장치 | 동작 |
| --- | --- |
| `scripts/harness/check.sh` | 기계 점검 (층 위반, `KNOWLEDGE.md` 섹션, 깨진 경로, 줄 dup, `scripts/harness/semantic-dup.py` **의미 중복**, `### 사실`·rules `### 규칙`, prose 불릿, **표 열 정렬**, 금지 패턴·**금지 경로 존재** (`banned.txt`에 `/` 포함 패턴); `README.md`·`docs/`·`.mdc` 포함) |
| `.cursor/hooks.json`, `.claude/settings.json` | 수정 턴 종료 시 점검 지시. 생략하지 않는다 |
| `.github/workflows/harness-check.yml` | push · PR에서 `check.sh` |

### `check.sh`가 못 잡는 판단 (1~6)

1. **층 위반:** `.ai/rules/`에 앱 전용이 없는지 grep.
2. **중복:** `.ai/rules/common.md` 「하네스 작성」「중복」— 줄 dup·`semantic-dup.py`가 잡지 못한 **새** 겹침은 수정 시 **합치기**·**단일 출처+포인터**. 스택·명령·DB는 `projects/{앱}.md`와 nested `AGENTS.md` 역할 분리.
3. **일치:** harness · `projects/` · 코드·설정 YAML이 같은 사실인지. 옛 경로 잔재.
4. **파일 성격:** `KNOWLEDGE.md`는 절차만. 역할: `.ai/rules/common.md` 「하네스 작성」 계층 표.
5. **하네스 양식:** `.ai/rules/common.md` 「하네스 작성」. 블록 타입·표 정렬·prose·**파일 내 중복** 규칙.
6. **지적 반영:** `.ai/KNOWLEDGE.md` 「지적 반영」 같은 턴.

### Pending (hook · 하네스 점검 턴)

- stop hook followup이 **그 턴의 사용자 메시지**로 이어지면, 「하네스 점검: …」 **다음**에 Pending을 적는다.
- **`[지적 반영 점검]`만** 이어진 턴: 직전 사용자 요청(설명·분석 등)에 대한 답을 **지적 없음만**으로 대체하지 않는다. hook 절차 **앞**에 답을 다시 보여주거나 이어서 완료한다 (`scripts/harness/hook-stop.sh`).
- 직전 assistant 턴에서 사용자 **답이 없는** 질문·선택지가 있으면 **`## Pending`** 블록.
- 해당 없으면 **`Pending: 없음`** 한 줄.

## 지적된 실수·학습

- 사용자·리뷰 지적과 확정 사실은 코드와 **같은 작업**에서 `.ai/` 또는 이 파일에 반영한다.

절차·승격: `.ai/KNOWLEDGE.md`
