# labs-api

모노레포 `minhyuck-labs` 의 첫 백엔드 REST API 앱.

에이전트 **모듈 입구**(빌드·test): `backend/java/labs-api/AGENTS.md`

## 위치·빌드

| 항목 | 값 |
| --- | --- |
| 경로 | `backend/java/labs-api` |
| Gradle | Groovy (`build.gradle`), wrapper 포함 |
| Base package | `com.minhyuck.labs` |
| Spring Boot | 4.1.1 |
| Java | toolchain 25 |
| 앱 version | `0.0.1-SNAPSHOT` (`build.gradle`) |

## Spring Boot 4 (이 앱)

- REST: **`spring-boot-starter-webmvc`** (Boot 3 `spring-boot-starter-web` 예제 그대로 금지).
- JSON: Jackson 3 — Boot 4 기본. Java 스타일·Lombok 등: `.ai/rules/java.md`.

## 실행·빌드 명령

- **`./gradlew` · docker compose** · HTTP 포트 등 런타임은 **`backend/java/labs-api/AGENTS.md` 「Build & test」** 만 둔다 (중복 금지).
- 로컬 Postgres: 아래 「DB · MyBatis · Flyway」.

## Gradle 의존성

- **단일 출처:** `backend/java/labs-api/build.gradle` (주석 규칙: 같은 모듈 `AGENTS.md`).

## HTTP (현재)

### 사실

| 용도 | URL |
| --- | --- |
| Context path | `/labs-api` (`application.yaml` `server.servlet.context-path`) |
| Health | `GET /labs-api/actuator/health` |
| OpenAPI JSON | `/labs-api/v3/api-docs` (SpringDoc 기본) |
| Swagger UI | `/labs-api/swagger-ui/index.html` |
| 메뉴 목록 | `POST /labs-api/menus/search` |

- 비즈니스 API: POST 기본 — `.ai/rules/api.md` 「HTTP 메서드」.
- Envelope: `ApiResponse<T>` (`common.dto.response`). 필드 `data`, `error` (`ResponseError`: `code`, `message`). 오류: `GlobalExceptionHandler` — bucket **400·404·500** (`badRequestExceptionHandler` → `notFoundExceptionHandler` → `internalServerErrorExceptionHandler`). 프레임워크 `error.code` = bucket `HttpStatus.name()`, message = `e.getMessage()`. 그 외 예외(405·415·`ResponseStatusException` 등)는 **500** bucket. **업무 예외·추가 bucket**은 `{domain}`·Security 등 도입 시. 검증: `ApiResponseWebTest`, `GlobalExceptionHandlerTest` (`src/test`).

## DB · MyBatis · Flyway

- **PostgreSQL** (모듈 `docker-compose.yml`, `localhost:5432/labs_api`). **JPA 없음.** 영속은 **MyBatis** 만.
- **로컬 DB 기동:** `developmentOnly` `spring-boot-docker-compose`. 전제: Docker 엔진 Running. Boot 기동 시 Compose up, 종료 시 stop (volume 유지). 호스트 Postgres 설치는 쓰지 않는다.
- **Flyway:** `src/main/resources/db/migration/V*.sql`. migration 파일명·수정 금지: `.ai/rules/sql.md`. Postgres 런타임은 `flyway-database-postgresql` (Flyway 12+).
- 실행 파일을 다른 사람에게 주기 전까지의 SQL은 현재 버전 파일만 수정한다. 그 파일을 준 뒤의 SQL은 다음 버전 파일이다. `__` 뒤는 그 변경의 짧은 설명이다.
- **test** profile: H2 in-memory (`./gradlew test`, CI). Compose off (아래 「설정」). 그 외 Postgres. 동일 Flyway migration.
- **테스트:** `@SpringBootTest` + `test` profile — H2 + Flyway (`.ai/rules/testing.md` 단위 테스트 규칙과 별도).
- 설정: `application.yaml` `mapper-locations: classpath*:com/minhyuck/labs/**/mapper/*.xml`, `map-underscore-to-camel-case: true`.
- `backend/java/labs-api/build.gradle` `sourceSets.main.resources`: `backend/java/labs-api/src/main/resources` + `backend/java/labs-api/src/main/java` (`.java` 제외). MyBatis `*Mapper.xml` classpath.
- `@MapperScan("com.minhyuck.labs")` 는 `MyBatisConfig`. 인터페이스 `@Mapper`.

## menu

사이드바 메뉴. 그룹은 `menu_path` 가 비고, 화면은 경로가 있다. 깊이는 최상위와 그 자식까지다.

### 사실

| 항목 | 값 |
| --- | --- |
| DDL | `backend/java/labs-api/src/main/resources/db/migration/V1__initial_schema.sql` |
| 키 | `menu_id` `BIGINT GENERATED ALWAYS AS IDENTITY` |
| 상위 | `parent_menu_id`. 비어 있으면 최상위. 있는 메뉴만 가리킨다 |
| 표시 | `use_yn` `BOOLEAN`, 기본 `TRUE` |
| 일시 | `created_at`, `updated_at`. 넣는 시점의 기본값. 고칠 때 `updated_at` 은 그 쿼리에서 갱신 |
| 시드 | 같은 파일. 가계부 `/budget` `sort_order` 1, 투자 `/invest` `sort_order` 2. 둘 다 최상위 |

- 자식의 부모는 최상위만 허용한다. migration·이후 저장에서 지킨다.
- 조회는 `POST /labs-api/menus/search`. 응답은 `ApiResponse` 의 `MenuListResponseDto` (`menuList`, `totalCount`). 원소는 `MenuDto`. 하위는 `subMenuList`. 하위 메뉴 순서는 서비스에서 `sortOrder` 로 맞춘다.

## 설정 (profile)

### 사실

| 파일 | 역할 |
| --- | --- |
| `application.yaml` | Postgres(env), MyBatis, SpringDoc on, DEBUG logging, Actuator `health`+`prometheus` |
| `application-test.yaml` | H2, CI, `spring.docker.compose.enabled: false` |
| `application-prod.yaml` | SpringDoc off, INFO logging |

- 설정 추가 시 위 역할을 지킨다. 비밀은 YAML·Git 에 넣지 않고 env 만. `prod`: `--spring.profiles.active=prod`.

## 패키지 (feature · MSA 지향)

- 업무 **`{domain}`** 경계는 추후 서비스 분리 후보. 도메인 폐기 시 **`{domain}` 패키지 삭제**.
- 호출: **`{domain}.controller` → `{domain}.service` → Mapper**.
- **Repository** 패키지 레이어는 두지 않는다. 영속은 `{domain}.mapper` (Service 가 Mapper 주입).

### 사실

```text
com.minhyuck.labs
├── LabsApiApplication.java
├── config/                    전역 @Configuration
├── common/                    여러 도메인 횡단 (예외 handler, 공통 DTO 등). 업무 Service·Controller 금지
├── admin/                     메뉴·페이지·코드 관리 (`MenuController`)
│   ├── controller/
│   ├── service/
│   └── mapper/
├── budget/                    가계부. API 클래스는 아직 없다
├── invest/                    투자. API 클래스는 아직 없다
└── {domain}/                  URI 자원명과 맞춤 (소문자)
    ├── controller/            HTTP — 패키지명 `web` 금지
    ├── service/
    └── mapper/                *Mapper.java + *Mapper.xml (같은 폴더). XML namespace = interface FQCN
```

## 아직 없음

- SQLite·폰 싱크 상세.
- Spring Security / OAuth.
- Kafka 등 메시징.
- Spring Cloud.

정하면 이 파일과 `application.yaml` 을 같은 작업에서 갱신한다.
