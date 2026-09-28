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

## 운영 (prod) 정책

로컬·dev 에서는 SpringDoc·Actuator 를 켜도 된다. **prod 프로필** 을 만들 때 같은 작업에서 아래를 반영한다.

- **SpringDoc:** `springdoc.api-docs.enabled=false`, `springdoc.swagger-ui.enabled=false`
- **Actuator:** 노출 endpoint 는 **최소**(예: health 만). 세부는 배포 환경 정할 때 이 절을 한 줄로 고정한다
- **비밀:** prod YAML·Git 에 API 키·DB URL·비밀번호를 넣지 않는다 (env / Secrets)

`application-prod.yaml` 은 prod 배포 준비 시 추가한다.

## 패키지 구조 (feature · MSA 지향)

Base: **`com.minhyuck.labs`**. **업무별 `{domain}`** + **`controller` / `service`**. HTTP 패키지는 **`web` 아님 → `controller`**.

```text
com.minhyuck.labs
├── LabsApiApplication.java
├── config/                    전역 Spring 설정
├── common/                    여러 도메인 공통 (예외 handler, 공통 오류 DTO 등)
└── {domain}/                  업무 단위 (ping, …). URI 자원명과 맞춤
    ├── controller/
    └── service/
```

- **MSA:** 지금은 단일 `labs-api` JAR. `{domain}` 경계는 **추후 서비스 분리 후보**로 본다.
- **common:** 업무 Service·Controller 금지. 횡단·공유 기술만.
- **영속:** `{domain}.mapper` 등 도메인 하위 (Repository 레이어 패키지 기본 없음).

상세: `.ai/rules/java.md` 「패키지 (feature · MSA 지향)」.
