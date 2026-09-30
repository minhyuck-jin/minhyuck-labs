# AGENTS.md — labs-api

`backend/java/labs-api` Gradle 모듈 전용 에이전트 입구다.

## Build & test

모듈 루트: `backend/java/labs-api`

```bash
./gradlew bootRun
./gradlew test
```

### 사실

| 항목 | 값 |
| --- | --- |
| HTTP | `8080` |
| test profile | `./gradlew test` (profile `test`) |
| CI | push·PR 시 **labs-api test** workflow → `./gradlew test` |

### 규칙

- 로컬 Run 전제: Docker 엔진 Running. DB: `../../../.ai/projects/labs-api.md` 「DB · MyBatis · Flyway」.
- IntelliJ Run/Debug: Gradle 위임 (`developmentOnly`가 classpath에 포함). Spring Boot 구성의 작업 디렉터리는 모듈 루트 (`$MODULE_WORKING_DIR$`).
- Compose 연동 off 시: `docker compose up -d` 후 `./gradlew bootRun`.
- 작업 완료: `../../../AGENTS.md` 「작업 완료」.

## Read (이 모듈 수정 시)

1. 이 파일
2. `../../../AGENTS.md` (Read-before-write, 검증 보고)
3. `../../../.ai/rules/common.md`, `../../../.ai/rules/quality.md`
4. `../../../.ai/rules/java.md` — Java·Spring
5. SQL·DB: `../../../.ai/rules/sql.md` + `../../../.ai/projects/labs-api.md`
6. HTTP API 추가·변경: `../../../.ai/rules/api.md`

인덱스: `../../../.ai/rules/README.md` (`.ai/rules/` 전체 Read 금지)

## build.gradle `dependencies` 주석

| 규칙 | 내용 |
| --- | --- |
| 그룹 | `/* Spring Boot */`, `/* DB */` 등 (`// ---` 사용하지 않음) |
| 정렬 | 같은 그룹 **최장 좌변** 다음 공백 4칸 뒤 `//`. 그룹마다 열 맞춤 |
| 설명 | 짧은 `//` 한 줄. 다른 프로젝트·회사 repo 언급 금지 |
| YAML 등 | 사용자 요청 없이 설정 파일에 긴 주석 블록 추가하지 않는다 |

## 하지 않는 것

| 금지 | 내용 |
| --- | --- |
| Git | 이 폴더에 새 Git 저장소 만들지 않는다 (루트 `.git`만) |
| test-only API | envelope·계약 검증만을 위해 `src/main`에 demo Controller 를 두지 않는다. `@WebMvcTest` 스텁은 `src/test` 만. |
| 빈 package | Java 삭제 후 **빈 package 디렉터리**를 남기지 않는다. (Git 미추적·IDE 잔재) |
| handler 과분할 | envelope용 `@RestControllerAdvice` 를 resolver·Detail 등 **별도 main 클래스**로 쪼개지 않는다. 매핑은 handler 클래스 **private** |
| handler 명명 | status bucket 메서드는 `{statusCamelCase}ExceptionHandler`, 매개변수 `Exception e` (`.ai/rules/api.md` 「오류 응답」) |
| 미사용 업무 예외 | 도메인·API 없이 **업무용 Exception 클래스**를 common 에 미리 만들지 않는다. 도입 시 `{domain}` 과 handler 를 함께 추가 |
| 의존성 | `.ai/projects/labs-api.md`에 없는 starter·의존성을 요청 없이 추가하지 않는다 |
| 근거 | `../../../.ai/rules/common.md` 「근거 · 사용자 설명」 |

본문: 스택·DB·패키지·profile — `../../../.ai/projects/labs-api.md`
