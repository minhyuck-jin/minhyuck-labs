# labs-web

모노레포 `minhyuck-labs` 의 React SPA. 백엔드 **labs-api** 를 호출한다.

에이전트 **모듈 입구**(빌드·test): `frontend/react/labs-web/AGENTS.md`

## 위치·빌드

| 항목 | 값 |
| --- | --- |
| 경로 | `frontend/react/labs-web` |
| Package manager | npm (`package-lock.json`) |
| 앱 version | `0.0.1` (`package.json`) |
| React | 19.3.0 |
| TypeScript | 7.0.2 |
| Vite | 8.3.1 |
| Vitest | 3.2.7 |
| Testing Library | `@testing-library/react` 16.x |
| Lint | ESLint 9 (flat) + Prettier 3 |

**단일 출처:** `frontend/react/labs-web/package.json` · `package-lock.json` (버전 숫자는 lock 기준으로 이 표를 맞춘다).

## 스택 (검증된 최신)

- **취지:** `labs-api` 의 Java 25 · Spring Boot 4.1.1 과 같다. **메이저·현행** 스택을 쓰고, Boot 3 · React 18 예제를 그대로 두지 않는다 (`.ai/rules/common.md` 「환경·스택」).
- **초기화:** 레포 안 `create-vite` (`react-ts`). 이후 `package.json` 에서 **검증된 최신**으로 올리고 `npm run build` · `npm run test` · `npm run lint` 로 확인한다.
- **Vitest:** npm 상 5.x 이지만, Vite 8 + `@vitejs/plugin-react` 조합에서는 **3.x** 가 안정적으로 맞는 경우가 많다. 5.x 로 올릴 때는 peer 의존성 확인 후 같은 작업에서 test·build 를 돌린다.
- **ESLint + TS 7:** `typescript-eslint` 는 아직 TS 7 API 미지원. `typescript` 는 `@typescript/typescript6`(ESLint용). **`tsc` · `tsc -b`** 는 `@typescript/native`(TS 7) — Microsoft side-by-side. 추적: typescript-eslint TS 7.1 API.

## 실행·빌드 명령

- **`npm run dev` · `npm run build` · `npm run test`** 는 **`frontend/react/labs-web/AGENTS.md` 「Build & test」** 만 둔다 (중복 금지).
- dev **5173**, preview 기본 **4173** (Vite preview).
- 프로덕션 빌드 산출물: `npm run build` 후 앱 루트의 dist/ (Git 미추적).

## 백엔드 연동 (로컬 dev)

### 사실

| 항목 | 값 |
| --- | --- |
| labs-api base (호스트) | `http://localhost:8080` |
| dev 프록시 | `LABS_API_PROXY_TARGET` → 8080, path `/labs-api` (`vite.config.ts` `server.proxy`) |
| 브라우저 API URL | `import.meta.env.VITE_LABS_API_PATH + '/…'` (`api/`). 공개 **도메인은 하나** — 레포·백엔드마다 **`PATH`만 다름**. dotenv **`BASE_URL` · `PATH` · (dev) proxy** 세트는 유지 |
| 첫 연동 | `GET /labs-api/actuator/health` (`VITE_LABS_API_PATH=/labs-api`, `frontend/react/labs-web/src/api/sample.ts`) |

- REST 비즈니스 API 추가 시 `.ai/rules/api.md` 와 `.ai/projects/labs-api.md` 를 따른다.

## 환경

Vite **기본 mode** (`vite` · `vite build` · Vitest `test`). **`--mode` 커스텀 없음.** `.env.development` 는 두지 않는다 (dev 는 `.env` 만).

### 사실

| 파일 | labs-api 대응 | 로드 |
| --- | ----------- | --- |
| `frontend/react/labs-web/env/.env` | `application.yaml` | dev · build · test 공통 |
| `frontend/react/labs-web/env/.env.production` | `application-prod.yaml` | `npm run build` (`production`) |
| `frontend/react/labs-web/env/.env.test` | `application-test.yaml` | `npm run test` (`test`) |

- **dotenv 위치:** `frontend/react/labs-web/env/` (`vite.config.ts` `envDir`). 앱 루트 `.env` 는 두지 않는다.

- **`VITE_{서비스id}_API_PATH`:** 백엔드 `server.servlet.context-path`(또는 게이트웨이 prefix)와 **동일** (labs-api: `/labs-api` — `.ai/projects/labs-api.md` 「HTTP」).
- **API env (백엔드·BFF · 레포 하나당 dotenv 블록):** **`VITE_{서비스id}_API_BASE_URL`** (도메인·공개 origin, mode별) · **(dev `.env` 만) `{서비스id}_API_PROXY_TARGET`** · **`VITE_{서비스id}_API_PATH`** (path prefix). labs-api: **`VITE_LABS_API_BASE_URL`**, **`LABS_API_PROXY_TARGET`**, **`VITE_LABS_API_PATH`**. 블록 **안** 빈 줄 없음, dev 순서 **BASE → proxy → PATH** (prod·test: BASE → PATH). **`api/` fetch URL은 `import.meta.env.VITE_{서비스id}_API_PATH + '/…'` 만** (SFC `process.env.NEXT_PUBLIC_*_API_PATH + '/…'`). **`BASE_URL`을 `api/` URL 앞에 concat 하지 않음** — 사용자-facing 도메인 하나, path 로 백엔드 구분 (`frontend/react/labs-web/src/api/sample.ts`). rename export · `env.ts` 래퍼 · `const meta = import.meta` 별칭 없음. prod dotenv 에 `*_PROXY_*` 없음. nginx 등은 「환경」 설명.
- **`VITE_*`:** 클라이언트 번들. 타입: `frontend/react/labs-web/src/vite-env.d.ts`. 비밀 금지 (`react.md`).
- 로컬 덮어쓰기: `frontend/react/labs-web/env/` 아래 Vite `.env.local` · mode별 `.env.*.local` (`*.local`, Git 제외).

### 규칙

- **공통 + production + test** 층만 둔다. 다른 저장소 env 세트를 **요청 없이 복제하지 않는다**.
- dotenv **주석**은 변수 위 **짧은 라벨** 한 줄 (예: `# labs-api local domain`). `frontend/react/labs-web/src/vite-env.d.ts` `ImportMetaEnv` JSDoc도 **같은 라벨**만. 장문·nginx · trailing slash 등 **설명은 이 파일 「환경」** 에만 둔다. `.ai/rules/` 포인터만 달지 않는다.
- 같은 `{서비스id}` dotenv: dev **`VITE_{서비스id}_API_BASE_URL` → `{서비스id}_API_PROXY_TARGET` → `VITE_{서비스id}_API_PATH`**. prod·test: **BASE → PATH**. 한 블록 **안** 빈 줄 없음. 다른 서비스·레포 블록과만 빈 줄로 구분.
- API·레포가 늘면 **위 3종( prod 는 BASE+PATH ) · `api/` `import.meta.env` PATH concat · (dev) proxy** 를 `{서비스id}` 로 세트 추가한다. 단일 `VITE_API_PATH` / `VITE_API_BASE_URL` 로 합치지 않는다.

## 소스 레이아웃

```text
frontend/react/labs-web/src/
├── main.tsx              Vite 진입 (`index.html` → `/src/main.tsx`)
├── App.tsx               루트 조립 (Vite 관례). `<HomePage />` 등
├── index.css             전역 entry (`main.tsx` import) — `styles/` re-export
├── styles/               공통 CSS (테마·재사용 클래스). 페이지별 `.css` 없음
│   ├── theme.css         토큰 (`:root` 변수)
│   └── ui.css            레이아웃·상태 등 **정해진 class 이름**
├── pages/                화면 TSX (`HomePage.tsx` — `/` 메인·초기 health 데모). 스모크는 `HomePage.test.tsx` colocation
├── layouts/              (패키지만)
├── components/           (패키지만)
├── hooks/                (패키지만)
├── types/                (패키지만)
├── api/                  HTTP (`sample.ts` — `import.meta.env` + path. JSX fetch 금지 — react.md)
└── test/                 Vitest setup
```

- **CSS:** 페이지·컴포넌트 TSX 에 스타일 블록·전용 `.css` import 를 두지 않는다. `frontend/react/labs-web/src/styles/theme.css` · `frontend/react/labs-web/src/styles/ui.css` 에 테마·공통 class 를 모으고, TSX 는 `className` 으로 그 이름만 쓴다. 새 class 가 필요하면 `frontend/react/labs-web/src/styles/` 에 추가한다.
- **`App.tsx`:** 조립만. 전용 App CSS 파일·App.test.tsx 는 두지 않는다. Vitest 는 대상 TSX 옆 `*.test.tsx` (예: `frontend/react/labs-web/src/pages/HomePage.test.tsx`).
- **패키지:** `layouts/` · `components/` · `hooks/` · `types/` 는 필요 시 채운다.
- **import:** `src/` 아래 TS·TSX 는 **`@/`** 별칭 (`@` → `frontend/react/labs-web/src`). `../` 상대 import 는 쓰지 않는다. CSS entry (`main.tsx` → `@/index.css`) 포함.
- HTTP 공통 client·core 층은 별도 논의 후 추가.

## 설정

| 파일 | 역할 |
| --- | --- |
| `vite.config.ts` | `envDir`, dev server port·`open`, `/labs-api` proxy (`loadEnv`), `resolve.alias` `@` → `src` |
| `frontend/react/labs-web/env/` | dotenv — 「환경」 표 |
| `frontend/react/labs-web/src/vite-env.d.ts` | `ImportMetaEnv` |
| `vitest.config.ts` | Vitest (jsdom, setup) |
| `eslint.config.js` | ESLint flat (TS, react-hooks, react-refresh) |
| `prettier.config.js` | Prettier (format; `eslint-config-prettier` 로 충돌 규칙 off) |
| `package.json` | scripts, version, dependencies |
| `tsconfig*.json` | TypeScript (앱 / Node·Vite 설정 분리) |

## 아직 없음

- 라우터 (React Router 등).
- UI 라이브러리 (MUI, Tailwind 등).
- E2E (Playwright 등).
- CI workflow.

정하면 이 파일과 `package.json` 을 같은 작업에서 갱신한다.
