# minhyuck-labs

개인 **포트폴리오·Side Project** 를 모아 두는 모노레포입니다.  
백엔드·프론트·(예정) 모바일을 한 저장소에서 관리하고, 실무에 가깝게 **Spring Boot · PostgreSQL · MyBatis** 로 API를 만들고 **React** 로 화면을 붙이는 것을 목표로 합니다.

> 저장소는 **Private** 로 운영합니다. 이력서·채용 담당자에게만 **Collaborator** 로 열람 권한을 줄 수 있습니다.

## 지금 하는 것

| 영역 | 상태 | 기술 |
|------|------|------|
| **labs-api** | DB·CI 기반 구축 완료, 비즈니스 API는 진행 중 | Spring Boot 4.1, Java 25, PostgreSQL, MyBatis, Flyway |
| **frontend/react** | 예정 | React |
| **android / ios** | 예정 | — |

## labs-api (백엔드)

REST API 모듈입니다. 로컬에서 Postgres(Docker)와 연동해 개발합니다.

```bash
cd backend/java/labs-api
docker compose up -d
./gradlew bootRun --args='--spring.profiles.active=local'
```

- Health: http://localhost:8080/actuator/health  
- Swagger UI: http://localhost:8080/swagger-ui/index.html  
- 테스트: `./gradlew test` (GitHub Actions `labs-api test`)

## 저장소 구조

| 경로 | 설명 |
|------|------|
| `backend/java/labs-api` | 백엔드 API |
| `frontend/react` | 프론트 (예정) |
| `docs/` | [소개·경력·프로젝트 요약](docs/README.md) |
| `.ai/` | AI 코딩 에이전트용 규칙 (구현 근거) |

## 더 읽을 곳

- 사람용: [`docs/`](docs/README.md)  
- AI·개발 입구: [`AGENTS.md`](AGENTS.md)
