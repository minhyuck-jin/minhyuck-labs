# AGENTS.md — labs-web

`frontend/react/labs-web` npm 앱 전용 에이전트 입구다.

## Build & test

모듈 루트: `frontend/react/labs-web`

```bash
npm install
npm run dev
npm run build
npm run test
npm run lint
npm run format:check
```

### 사실

| 항목 | 값 |
| --- | --- |
| dev | `npm run dev` → `http://localhost:5173` |
| preview | `npm run build` 후 `npm run preview` (기본 `4173`) |
| format write | `npm run format` |
| format check | `npm run format:check` |

### 규칙

- URL·프록시·dotenv: `../../../.ai/projects/labs-web.md` 「백엔드 연동 (로컬 dev)」, 「환경」.
- 로컬 dev는 Vite 프록시를 쓴다. labs-api 직접 호출 시 CORS 설정이 필요하다.
- labs-api `./gradlew bootRun` 전제 (Docker Running).
- IDE: monorepo 루트 Open (`../../../AGENTS.md` 「앱 (monorepo)」).

## Read (이 모듈 수정 시)

1. 이 파일
2. `../../../AGENTS.md` (Read-before-write, 검증 보고)
3. `../../../.ai/rules/common.md`, `../../../.ai/rules/quality.md`
4. `../../../.ai/rules/react.md` — React 코드
5. HTTP API: `../../../.ai/rules/api.md` + `../../../.ai/projects/labs-api.md`
6. 도메인·스택: `../../../.ai/projects/labs-web.md`

인덱스: `../../../.ai/rules/README.md` (`.ai/rules/` 전체 Read 금지)

## 하지 않는 것

| 금지 | 내용 |
| --- | --- |
| Git·하네스 | `../../../AGENTS.md` 「건드리지 말 것」 |
| env | `VITE_*`에 시크릿·DB 비밀번호 넣지 않는다. dotenv: `../../../.ai/projects/labs-web.md` 「환경」 |

본문: 스택·프록시·버전 — `../../../.ai/projects/labs-web.md`
