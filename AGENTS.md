# AGENTS.md — minhyuck-labs

이 저장소의 에이전트 규칙 입구다. Cursor·Claude Code·GitHub Copilot 모두 이 파일에서 시작한다.

## 도구 입구
- Cursor: 이 파일 (+ 선택 `.cursor/rules/*.mdc` — Cursor 전용, 다른 도구는 무시)
- Claude Code: `CLAUDE.md` → 이 파일 (앱 폴더는 해당 `AGENTS.md` / `CLAUDE.md`)
- GitHub Copilot: `.github/copilot-instructions.md` → 이 파일
- 규칙은 도구별 파일에 복사하지 않는다. 원본은 `.ai/rules/` 와 이 파일이다.

## 앱 (monorepo)

`backend/**` · `frontend/**` 등 **실행 가능한 앱**이 있으면, 그 경로의 **nested `AGENTS.md`** 를 먼저 읽는다 (빌드·test 명령은 앱 파일에만 둔다).

| 경로 | 모듈 AGENTS | 도메인 (`.ai/projects/`) |
|------|-------------|----------------------------|
| `backend/java/labs-api` | `backend/java/labs-api/AGENTS.md` | `labs-api.md` |
| `frontend/react` | (앱 생기면 추가) | (생기면) |

루트 이 파일은 **전역** 규칙·읽기 순서·지도다. 앱별 `./gradlew` 등은 nested 파일을 따른다.

## Read-before-write (코드·하네스 수정 전)

파일을 **수정·생성·삭제**하기 **전**, 그 턴의 **첫 도구 호출**은 Read 이어야 한다.

1. 이 파일
2. `.ai/rules/common.md`, `.ai/rules/quality.md`
3. 아래 **읽기 순서**에 해당하는 rules·projects·코드 파일

**대체 불가:** 대화 요약, 이전 채팅, “읽었을 것”으로 Read 를 건너뛰지 않는다.
Read 없이 `Write` / `StrReplace` 등 변경 도구를 호출하지 않는다.

규칙 목록·1줄 요약: `.ai/rules/README.md`

## 읽기 순서 (토큰 — 필요한 것만)

`.ai/rules/` **전체를 매번 읽지 않는다.**

### 항상 (코드·하네스 작업)
- `common.md`, `quality.md`

### 작업 경로·주제에 따라 추가
| 조건 | 추가로 Read |
|------|-------------|
| `backend/**` Java·Spring | `java.md` |
| `frontend/**` React | `react.md` |
| HTTP API 설계·구현 | `api.md` |
| SQL·DB·스키마 | `sql.md` (공통) + **해당 앱** `.ai/projects/{앱}.md` |
| 테스트 작성·수정 | `testing.md` |
| Git 조작·push·작업 마무리 | `git.md` |
| 특정 앱·도메인 | `.ai/projects/{앱}.md` (있을 때만) |

`.ai/rules/` 에 앱 전용(경로, JPA 유무, Postgres 등)을 쓰지 않는다. 층 구분: `common.md` 「`.ai` 규칙 층」.

### 근거
- **구현·분석 근거는 코드와 `.ai` 뿐**이다. `README.md`, `docs/` 는 근거로 쓰지 않는다.

## 작업 후 — 검증 보고

답변·작업 마무리 시 아래를 구분한다 (`git.md` 와 동일).

| 표기 | 의미 |
|------|------|
| **확인함** | Read·실행·재현으로 직접 확인한 내용 |
| **미확인** | 코드·설정을 읽지 않았거나, 사용자 말·추측에만 의존 |
| **미실행: 사유** | 테스트·빌드·린트·수동 확인을 돌리지 않음 (이유 명시) |

- 테스트·빌드·린트 “통과”는 **실제로 실행한 경우만** 적는다.
- 확인한 범위(예: 변경 파일, 특정 모듈)를 함께 적는다.

## 작업 완료 (Definition of done)

`backend/java/labs-api` 의 Java·설정·Gradle 을 바꾼 작업은 **완료·merge 가능**이라고 말하기 전에 아래 중 하나를 만족한다.

1. 모듈 루트에서 **`./gradlew test`** 를 실행했고, **확인함**으로 보고한다.
2. GitHub **`labs-api test` workflow** 가 해당 커밋·PR 에서 **green** 이다.

둘 다 아니면 **“통과”, “문제없음”, “테스트 OK”** 를 쓰지 않고 **`미실행: 사유`** 만 쓴다. CI 가 있는데 로그를 보지 않고 통과를 주장하지 않는다.

## 건드리지 말 것

- **커밋·push 금지:** `.env`, `.env.*`, API 키, DB 비밀번호, `**/credentials*`, 기타 비밀을 담은 파일
- **Git 조작:** `git reset --hard`, force push, hook 우회 — 상세는 `.ai/rules/git.md` 「하지 않는 것」
- **하네스:** 요청·`.ai/KNOWLEDGE.md` 절차 없이 rules 전체를 다른 파일에 복붙하지 않는다

## 문서 동기화

폴더 구조, 공개 프로젝트 목록, 하네스 경로가 바뀌면 **같은 작업에서** 루트 `README.md` 와 `docs/` 를 맞춘다.
기능이 의미 있게 바뀌면 `.ai/projects/` 와 `docs/` 해당 소개만 최신화한다. 요청 없는 홍보 문구는 쓰지 않는다.

## 레이아웃

| 경로 | 용도 |
|------|------|
| `.ai/rules/` | 공통 기술 규칙. 인덱스: `.ai/rules/README.md` |
| `.ai/KNOWLEDGE.md` | 지식 반영·공통 승격 절차 |
| `.ai/projects/` | AI가 읽는 업무·도메인 |
| `docs/` | 사람용 (소개, 경력, 프로젝트 요약) |
| `backend/` `frontend/` `android/` `ios/` | 코드 (Java 앱: `backend/java/labs-api/AGENTS.md`) |
| `.cursor/rules/` | Cursor 전용 glob 규칙 (선택) |
| `.github/workflows/` | CI (예: `labs-api-test.yml`) |

## 작업 방식

- 작업 단위가 바뀌면 새 대화에서 시작한다.
- 답변은 간결하게 한다. 긴 설명은 요청할 때만 한다.
- 저장소 전체를 훑지 않는다. 관련 파일에서 시작해 호출 관계를 따라간다.
- 광범위한 조사가 필요하면 서브에이전트에 위임해 메인 대화 컨텍스트를 아낀다.
- 파일 경로는 줄이지 않고 전체 경로로 적는다. 경로 중간에 말줄임을 넣지 않는다.

## 하네스 수정 후 검증 (필수 — 사용자에게 묻기 전)

`.ai/` · `AGENTS.md` · nested `AGENTS.md` · `.cursor/rules/` 를 **수정·생성한 작업**은 **완료 보고 전** 아래를 **직접** 수행한다. “나중에”·“물어보면” 하지 않는다.

1. **층 위반:** `.ai/rules/` 에 앱 경로·base package·DB 종류·JPA/MyBatis/Flyway **앱 선택**·`@MapperScan` 등 **앱 전용**이 없는지 grep (`labs-api`, `com.minhyuck`, `backend/java/labs-api` 등).
2. **중복:** 같은 스택·패키지·실행 명령·DB 설정이 **두 파일 이상**에 **본문**으로 있지 않은지 확인. 역할 분리:
   - `projects/{앱}.md` — 앱 스택·패키지·DB·설정 **본문(단일 출처)**
   - `{모듈}/AGENTS.md` — `./gradlew`·모듈 convention·**projects 로 포인터** (스택 본문 복붙 금지)
   - `.ai/rules/` — 공통만. `README.md` — 사람용 요약(필요 시 projects 와 동기화)
3. **읽기 순서:** `AGENTS.md` 표·nested AGENTS Read 목록·`README.md` 인덱스가 바뀐 파일과 **일치**하는지 확인.
4. **지적 반영:** 사용자·리뷰 지적은 **같은 작업**에서 하네스·`KNOWLEDGE.md` 에 남긴다.

검증 결과를 작업 마무리에 **확인함** / **수정함** 으로 한 줄 적는다.

## 지적된 실수·학습

사용자·리뷰에서 지적된 실수와 확정된 사실은 코드와 **같은 작업**에서 `.ai/` 또는 이 파일에 반영한다.
절차·승격: `.ai/KNOWLEDGE.md`
