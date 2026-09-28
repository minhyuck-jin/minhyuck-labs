# labs-api

모노레포 `minhyuck-labs` 의 첫 백엔드 REST API 앱.

## 위치·빌드

| 항목 | 값 |
|------|-----|
| 경로 | `backend/java/labs-api` |
| Gradle | Groovy (`build.gradle`), wrapper 포함 |
| Base package | `com.minhyuck.labs` |
| Spring Boot | 4.1.1 |
| Java | toolchain 25 |
| 앱 version | `0.0.1-SNAPSHOT` (`build.gradle`) |

## 실행

```bash
cd backend/java/labs-api
./gradlew bootRun
./gradlew test
```

로컬 기본 포트: **8080**

## 종속성 (Initializr)

- Spring Web MVC (`spring-boot-starter-webmvc`)
- Validation
- Actuator
- Lombok, configuration-processor
- SpringDoc OpenAPI (`springdoc-openapi-starter-webmvc-ui` 3.1.0)

## HTTP (현재)

| 용도 | URL |
|------|-----|
| Health | `GET /actuator/health` |
| OpenAPI JSON | `/v3/api-docs` (SpringDoc 기본) |
| Swagger UI | `/swagger-ui/index.html` |

REST 비즈니스 API는 아직 없음. 추가 시 `.ai/rules/api.md` 를 따른다 (URI `/v1` 접두사 없음).

## 아직 없음

- DB, JPA/MyBatis, `sql.md` 대상 스키마
- Spring Security / OAuth
- Kafka 등 메시징
- Spring Cloud

정하면 이 파일과 `application.yaml` 을 같은 작업에서 갱신한다.

## 설정

- `src/main/resources/application.yaml`
- 프로필·비밀은 env / 외부 설정 (YAML에 비밀 넣지 않음)
