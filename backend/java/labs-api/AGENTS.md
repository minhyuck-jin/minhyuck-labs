# AGENTS.md — labs-api

`backend/java/labs-api` Gradle 모듈 전용 에이전트 입구다.
저장소 전역 규칙은 **`../../AGENTS.md`** 와 **`.ai/rules/`** 이다.

## Build & test (this module)

모듈 루트(`backend/java/labs-api`)에서:

```bash
./gradlew test
./gradlew bootRun
```

- Java toolchain: **25** (`build.gradle`)
- Spring Boot: **4.1.1**
- Base package: **`com.minhyuck.labs`**
- 로컬 HTTP: **8080**

## 이 모듈을 수정할 때 Read

1. 이 파일
2. `../../AGENTS.md` (Read-before-write, 검증 보고)
3. `../../.ai/rules/common.md`, `../../.ai/rules/quality.md`
4. `../../.ai/rules/java.md` — Java·Spring 코드
5. HTTP API 추가·변경 시 `../../.ai/rules/api.md`
6. 도메인·스택: `../../.ai/projects/labs-api.md`

`.ai/rules/` 전체를 읽지 않는다. 인덱스: `../../.ai/rules/README.md`

## CI

push·PR 시 GitHub **labs-api test** workflow 가 `./gradlew test` 를 실행한다. 작업 완료 기준: `../../AGENTS.md` 「작업 완료」.

## 하지 않는 것

- 이 폴더에 **새 Git 저장소** 만들지 않는다 (루트 `.git` 만)
- Spring Cloud·DB starter 를 요청 없이 추가하지 않는다
- `README.md`, `docs/` 를 구현 근거로 쓰지 않는다
