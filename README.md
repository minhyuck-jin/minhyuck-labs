# minhyuck-labs

개인 저장소.

## 레이아웃

| 경로 | 용도 |
|------|------|
| `backend/java/labs-api` | 백엔드 REST API (Spring Boot 4.1, Java 25) |
| `frontend/react` | 프론트엔드 (React, 예정) |
| `android` | 안드로이드 (나중에) |
| `ios` | iOS (나중에) |
| `docs/` | 소개, 경력, 프로젝트 요약 |
| `.ai/` | 에이전트용 규칙·도메인. 구현 근거 |

### labs-api (로컬 실행)

```bash
cd backend/java/labs-api
./gradlew bootRun
```

- Health: http://localhost:8080/actuator/health  
- Swagger UI: http://localhost:8080/swagger-ui/index.html  

사람용 문서는 [`docs/`](docs/README.md) 를 본다.

IntelliJ / Cursor / Claude / Copilot 은 저장소 **루트**를 연다. 에이전트 입구는 `AGENTS.md` 다. 앱 도메인은 `.ai/projects/labs-api.md` 다.
