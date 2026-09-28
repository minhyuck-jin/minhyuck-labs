# labs-api

모노레포 `minhyuck-labs` 의 첫 백엔드 REST API 앱.

에이전트 **모듈 입구**(빌드·test): `backend/java/labs-api/AGENTS.md`

## 위치·빌드

| 항목 | 값 |
|------|-----|
| 경로 | `backend/java/labs-api` |
| Gradle | Groovy (`build.gradle`), wrapper 포함 |
| Base package | `com.minhyuck.labs` |
| Spring Boot | 4.1.1 |
| Java | toolchain 25 |
| 앱 version | `0.0.1-SNAPSHOT` (`build.gradle`) |

## Spring Boot 4 (이 앱)

- REST: **`spring-boot-starter-webmvc`** (Boot 3 `spring-boot-starter-web` 예제 그대로 금지)
- JSON: Jackson 3 — Boot 4 기본. Java 스타일·Lombok 등: `.ai/rules/java.md`

## 실행·빌드 명령

**`./gradlew` · docker compose** 는 **`backend/java/labs-api/AGENTS.md` 「Build & test」** 만 둔다 (중복 금지).

- HTTP **8080**. Postgres: `docker-compose.yml` (기본 `localhost:5432/labs_api`).
- Profile **local**: Postgres + Flyway. **test**: H2 + Flyway (`./gradlew test`, CI).

## Gradle 의존성

**단일 출처:** `backend/java/labs-api/build.gradle` (주석 규칙: 같은 모듈 `AGENTS.md`).

## HTTP (현재)

| 용도 | URL |
|------|-----|
| Health | `GET /actuator/health` |
| OpenAPI JSON | `/v3/api-docs` (SpringDoc 기본) |
| Swagger UI | `/swagger-ui/index.html` |

REST 비즈니스 API는 아직 없음. 추가 시 `.ai/rules/api.md` 를 따른다 (URI `/v1` 접두사 없음).

## DB · MyBatis · Flyway

- **PostgreSQL** (`docker-compose.yml`). **JPA 없음.** 영속은 **MyBatis** 만.
- **Flyway:** `src/main/resources/db/migration/V*.sql`. migration 파일명·수정 금지: `.ai/rules/sql.md`.
- **local** profile: Postgres. **test** profile: H2 in-memory (`./gradlew test`, CI). 동일 Flyway migration.
- **테스트:** `@SpringBootTest` + `test` profile — H2 + Flyway (`.ai/rules/testing.md` 범위 **이 앱 예외**).
- 설정: `application.yaml` `mapper-locations: classpath*:com/minhyuck/labs/**/mapper/*.xml`, `map-underscore-to-camel-case: true`
- `build.gradle` `sourceSets`: `src/main/java/**/*.xml` classpath
- `@MapperScan("com.minhyuck.labs")`, 인터페이스 `@Mapper`

## 아직 없음

- SQLite·폰 싱크 상세
- Spring Security / OAuth
- Kafka 등 메시징
- Spring Cloud

정하면 이 파일과 `application.yaml` 을 같은 작업에서 갱신한다.

## 설정

- `src/main/resources/application.yaml`
- 프로필·비밀은 env / 외부 설정 (YAML에 비밀 넣지 않음)

## 운영 (prod) 정책

로컬·dev 에서는 SpringDoc·Actuator 를 켜도 된다. **prod 프로필** 을 만들 때 같은 작업에서 아래를 반영한다.

- **SpringDoc:** `springdoc.api-docs.enabled=false`, `springdoc.swagger-ui.enabled=false`
- **Actuator:** 노출 endpoint 는 **최소**(예: health 만). 세부는 배포 환경 정할 때 이 절을 한 줄로 고정한다
- **비밀:** prod YAML·Git 에 API 키·DB URL·비밀번호를 넣지 않는다 (env / Secrets)

`application-prod.yaml` 은 prod 배포 준비 시 추가한다.

## 패키지 (feature · MSA 지향)

업무 **`{domain}`** 경계는 추후 서비스 분리 후보. 도메인 폐기 시 **`{domain}` 패키지 삭제**.

```text
com.minhyuck.labs
├── LabsApiApplication.java
├── config/                    전역 @Configuration
├── common/                    여러 도메인 횡단 (예외 handler, 공통 DTO 등). 업무 Service·Controller 금지
└── {domain}/                  URI 자원명과 맞춤 (소문자)
    ├── controller/            HTTP — 패키지명 `web` 금지
    ├── service/
    └── mapper/                *Mapper.java + *Mapper.xml (같은 폴더). XML namespace = interface FQCN
```

- 호출: **`{domain}.controller` → `{domain}.service` → Mapper**
- **Repository** 패키지 레이어는 두지 않는다. 영속은 `{domain}.mapper` (Service 가 Mapper 주입)
