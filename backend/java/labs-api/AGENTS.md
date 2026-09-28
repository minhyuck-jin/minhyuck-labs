# AGENTS.md — labs-api

`backend/java/labs-api` Gradle 모듈 전용 에이전트 입구다.
저장소 전역 규칙은 **`../../AGENTS.md`** 와 **`.ai/rules/`** 이다.

## Build & test (this module)

모듈 루트(`backend/java/labs-api`)에서:

```bash
docker compose up -d
./gradlew bootRun --args='--spring.profiles.active=local'
./gradlew test
```

스택·DB·패키지·profile **본문:** `../../.ai/projects/labs-api.md` (여기에 복사하지 않는다).

## 이 모듈을 수정할 때 Read

1. 이 파일
2. `../../AGENTS.md` (Read-before-write, 검증 보고)
3. `../../.ai/rules/common.md`, `../../.ai/rules/quality.md`
4. `../../.ai/rules/java.md` — Java·Spring 코드
5. SQL·DB·스키마: `../../.ai/rules/sql.md` + `../../.ai/projects/labs-api.md`
6. HTTP API 추가·변경 시 `../../.ai/rules/api.md`

`.ai/rules/` 전체를 읽지 않는다. 인덱스: `../../.ai/rules/README.md`

## build.gradle `dependencies` 주석

- **그룹:** `/* Spring Boot */`, `/* DB */` 등 블록 주석 (`// ---` 사용하지 않음).
- **의존성 줄:** 같은 그룹 안 **가장 긴 좌변(따옴표까지)** 다음 **공백 4칸** 뒤에 `//` 시작. 그룹마다 열 맞춤.
- **설명:** 짧은 `//` 한 줄. 다른 프로젝트 이름·회사 repo 언급하지 않음.
- **YAML·docker-compose 등:** 사용자가 파일 주석 추가를 요청하지 않으면 채팅 설명만 (설정 파일에 임의로 긴 주석 블록 추가하지 않음).

## CI

push·PR 시 GitHub **labs-api test** workflow 가 `./gradlew test` 를 실행한다. 작업 완료 기준: `../../AGENTS.md` 「작업 완료」.

## 하지 않는 것

- 이 폴더에 **새 Git 저장소** 만들지 않는다 (루트 `.git` 만)
- `../../.ai/projects/labs-api.md` 에 없는 **새 starter·의존성** 을 요청 없이 추가하지 않는다
- `README.md`, `docs/` 를 구현 근거로 쓰지 않는다
