# labs-web

모노레포 `minhyuck-labs` 의 React 앱. 백엔드 **labs-api** 를 호출한다.

에이전트 **모듈 입구**(빌드·test): `frontend/react/labs-web/AGENTS.md`

## 위치·빌드

| 항목 | 값 |
| --- | --- |
| 경로 | `frontend/react/labs-web` |
| Package manager | npm (`package-lock.json`) |
| 앱 version | `0.0.1` (`package.json`) |
| React | 19.3.0 |
| TypeScript | 7.0.2 |
| Next.js | 16.4.0 (App Router) |
| Vitest | 3.2.7 |
| AG Grid | `ag-grid-react` 36.2.0 (`ag-grid-community` 36.2.0, MIT) |
| 아이콘 | `react-icons` 5.7.0 (기본 lu, 브랜드 si) |
| React Hook Form | 7.89.0 |
| Testing Library | `@testing-library/react` 16.x |
| Lint | ESLint 9 (flat) + Prettier 3 |

**단일 출처:** `frontend/react/labs-web/package.json` · `package-lock.json` (버전 숫자는 lock 기준으로 이 표를 맞춘다).

## 스택 (검증된 최신)

- **취지:** `labs-api` 의 Java 25 · Spring Boot 4.1.1 과 같다. **메이저·현행** 스택을 쓰고, Boot 3 · React 18 예제를 그대로 두지 않는다 (`.ai/rules/common.md` 「환경·스택」).
- **화면:** Next.js App Router. 경로·파일명 규칙은 `.ai/rules/react.md` 「화면」.
- **폼:** React Hook Form. 조회·저장 입력 화면의 작성은 `.ai/rules/react.md` 「폼」.
- **StrictMode:** `frontend/react/labs-web/next.config.ts` `reactStrictMode: false`. 기준은 `.ai/rules/react.md` 「화면」.
- **Vitest:** 단위 테스트는 Next.js Vitest 가이드의 jsdom · `@vitejs/plugin-react` · `vite-tsconfig-paths` 구성이다. 앱 스크립트는 `vite`를 호출하지 않는다. 버전은 lock의 3.2.7.
- **ESLint + TS 7:** `typescript-eslint` 는 아직 TS 7 API 미지원. `typescript` 는 `@typescript/typescript6`(ESLint용). **`next build` 타입 검사**도 이 `typescript` 패키지를 쓴다. **`tsc` 직접 실행**은 `@typescript/native`(TS 7). 추적: typescript-eslint TS 7.1 API.

## 실행·빌드 명령

- **`npm run dev` · `npm run build` · `npm run start` · `npm run test`** 는 **`frontend/react/labs-web/AGENTS.md` 「Build & test」** 만 둔다 (중복 금지).
- dev · start 기본 **3000**.
- 프로덕션 빌드 산출물은 `npm run build` 뒤 앱 루트에 생기며 Git 미추적이다.

## 백엔드 연동 (로컬 dev)

### 사실

| 항목 | 값 |
| --- | --- |
| labs-api base (호스트) | `http://localhost:8080` |
| dev 프록시 | `LABS_API_PROXY_TARGET` → 8080, path `/labs-api` (`frontend/react/labs-web/next.config.ts` `rewrites`) |
| 브라우저 API URL | `process.env.NEXT_PUBLIC_LABS_API_PATH + '/…'` (`api/`). 공개 **도메인은 하나** — 레포·백엔드마다 **`PATH`만 다름**. dotenv **`BASE_URL` · `PATH` · (dev) proxy** 세트는 유지 |
| 메뉴 연동 | `POST /labs-api/menus/search` (`NEXT_PUBLIC_LABS_API_PATH=/labs-api`, `frontend/react/labs-web/src/app/(default)/admin/api/menu.ts`) |

- REST 비즈니스 API 추가 시 `.ai/rules/api.md` 와 `.ai/projects/labs-api.md` 를 따른다.

## 환경

Next.js가 앱 루트 `.env*` 를 읽는다 (`next dev` → `development`, `next build` · `next start` → `production`, `NODE_ENV=test` → `test`). **커스텀 mode 없음.** `.env.development` 는 두지 않는다 (dev 는 `.env` 만).

### 사실

| 파일 | labs-api 대응 | 로드 |
| --- | ----------- | --- |
| `frontend/react/labs-web/.env` | `application.yaml` | dev · build · test 공통 |
| `frontend/react/labs-web/.env.production` | `application-prod.yaml` | `npm run build` · `npm run start` (`production`) |
| `frontend/react/labs-web/.env.test` | `application-test.yaml` | `npm run test` (`test`, `frontend/react/labs-web/vitest.setup.ts` `loadEnvConfig`) |

- **dotenv 위치:** `frontend/react/labs-web/` 앱 루트. Next.js는 `.env*` 를 이 디렉터리에서만 읽는다.

- **`NEXT_PUBLIC_{서비스id}_API_PATH`:** 백엔드 `server.servlet.context-path`(또는 게이트웨이 prefix)와 **동일** (labs-api: `/labs-api` — `.ai/projects/labs-api.md` 「HTTP」).
- **API env (백엔드·BFF · 레포 하나당 dotenv 블록):** **`NEXT_PUBLIC_{서비스id}_API_BASE_URL`** (도메인·공개 origin, mode별) · **(dev `.env` 만) `{서비스id}_API_PROXY_TARGET`** · **`NEXT_PUBLIC_{서비스id}_API_PATH`** (path prefix). labs-api: **`NEXT_PUBLIC_LABS_API_BASE_URL`**, **`LABS_API_PROXY_TARGET`**, **`NEXT_PUBLIC_LABS_API_PATH`**. 블록 **안** 빈 줄 없음, dev 순서 **BASE → proxy → PATH** (prod·test: BASE → PATH). **`api/` fetch URL은 `process.env.NEXT_PUBLIC_{서비스id}_API_PATH + '/…'` 만**. **`BASE_URL`을 `api/` URL 앞에 concat 하지 않음** — 사용자-facing 도메인 하나, path 로 백엔드 구분 (`frontend/react/labs-web/src/app/(default)/admin/api/menu.ts`). rename export · `env.ts` 래퍼 없음. prod dotenv 에 `*_PROXY_*` 없음. `LABS_API_PROXY_TARGET` 은 서버 전용(rewrites)이라 `NEXT_PUBLIC_` 를 붙이지 않는다. nginx 등은 「환경」 설명.
- **`NEXT_PUBLIC_*`:** 클라이언트 번들. 비밀 금지 (`react.md`).
- 로컬 덮어쓰기: 앱 루트 `.env.local` · mode별 `.env.*.local` (`*.local`, Git 제외).

### 규칙

- **공통 + production + test** 층만 둔다. 다른 저장소 env 세트를 **요청 없이 복제하지 않는다**.
- dotenv **주석**은 변수 위 **짧은 라벨** 한 줄 (예: `# labs-api local domain`). 장문·nginx · trailing slash 등 **설명은 이 파일 「환경」** 에만 둔다. `.ai/rules/` 포인터만 달지 않는다.
- 같은 `{서비스id}` dotenv: dev **`NEXT_PUBLIC_{서비스id}_API_BASE_URL` → `{서비스id}_API_PROXY_TARGET` → `NEXT_PUBLIC_{서비스id}_API_PATH`**. prod·test: **BASE → PATH**. 한 블록 **안** 빈 줄 없음. 다른 서비스·레포 블록과만 빈 줄로 구분.
- API·레포가 늘면 **위 3종( prod 는 BASE+PATH ) · `api/` `process.env` PATH concat · (dev) proxy** 를 `{서비스id}` 로 세트 추가한다. 단일 `NEXT_PUBLIC_API_PATH` / `NEXT_PUBLIC_API_BASE_URL` 로 합치지 않는다.

## 소스 레이아웃

```text
frontend/react/labs-web/src/app/
├── layout.tsx            html · body · 전역 CSS. 주소에 안 붙음
├── favicon.ico           탭 아이콘. Next.js가 자동 연결 (`layout.tsx` icons 없음)
├── (default)/            기본 틀 route group. 괄호는 주소에 안 붙음
│   ├── layout.tsx        사이드바 + 화면
│   ├── sidebar.tsx       로고·메뉴 검색·2단계 메뉴·접기
│   ├── page.tsx          주소 `/`. 헬스체크·AG Grid 샘플
│   ├── budget/page.tsx   주소 `/budget`
│   ├── invest/page.tsx   주소 `/invest`
│   └── admin/            메뉴·페이지·코드 관리 (백 `admin` 대응). 화면 파일 없음
│       ├── api/          메뉴 조회 `menu.ts`
│       └── types/        메뉴 타입 `menu.ts`
├── (popup)/              팝업 틀 route group. 화면은 생길 때 `{domain}/{경로}/page.tsx`
│   └── layout.tsx
├── shared/               횡단 (백 `common` 대응). 업무 코드 금지. 화면 파일 없음
│   ├── styles/           공통 CSS (테마·재사용 class). 페이지별 `.css` 없음
│   │   ├── global.css    전역 entry (루트 `layout.tsx` import)
│   │   ├── theme.css     토큰 (`:root` 변수)
│   │   └── ui.css        레이아웃·상태 등 **정해진 class 이름**
│   ├── types/            공통 타입만 (예: envelope `ApiResponse`, 틀 `LayoutType`). camelCase 파일명
│   └── api/              envelope·Raw JSON fetch (`apiClient.ts`). 서비스 PATH·env 없음
└── assets/               import 정적 파일. `shared`와 같은 높이
    ├── fonts/            글꼴 (`PretendardVariable.woff2`)
    └── images/           로고·그림 (`logo.png`, `logoHorizontal.png`, `logoSymbol.png`)
```

- **글꼴:** 전역 글꼴 파일은 `frontend/react/labs-web/src/app/assets/fonts/PretendardVariable.woff2`. `@font-face`는 `frontend/react/labs-web/src/app/shared/styles/theme.css`. 외부 폰트 URL: `.ai/rules/react.md` 「화면」.
- **CSS:** 페이지·컴포넌트 TSX 에 스타일 블록·전용 `.css` import 를 두지 않는다. `frontend/react/labs-web/src/app/shared/styles/theme.css` · `frontend/react/labs-web/src/app/shared/styles/ui.css` 에 테마·공통 class 를 모으고, TSX 는 `className` 으로 그 이름만 쓴다. 새 class 가 필요하면 `frontend/react/labs-web/src/app/shared/styles/` 에 추가한다. 반응형·iPhone Safari·Android Chrome: `.ai/rules/react.md` 「화면」.
- **진입:** 루트 `frontend/react/labs-web/src/app/layout.tsx` 가 `html`(`lang` `ko`)·`body`·전역 CSS다. `/` 는 `frontend/react/labs-web/src/app/(default)/page.tsx`, `/budget` 은 가계부, `/invest` 는 투자. 사이드바 이동은 Next.js Link. Vitest 는 대상 TSX 옆 `*.test.tsx` (예: `frontend/react/labs-web/src/app/(default)/page.test.tsx`).
- **패키지:** 도메인 `api/` · `types/` 와 `frontend/react/labs-web/src/app/shared/` 는 필요 시 채운다. 버튼·입력·그 조합은 `@minhyuck-labs/ui`. 화면을 넣는 경로는 `.ai/rules/react.md` 「화면」.
- **파일명:** 화면은 `page.tsx`, 틀은 `layout.tsx`. 기본 틀과 같은 폴더에 있는 공통 틀 파일은 `sidebar.tsx`다. 그 외 camelCase (`apiResponse.ts`, `apiClient.ts`). 점 접미사(`*.types.ts`)·kebab 파일명 금지 — `.ai/rules/react.md` 「이름」. 정적 파일 이름은 담은 내용으로 짓는다. 화면 이름으로 짓지 않는다.
- **import:** `src/` 아래 TS·TSX 는 **`@/`** 별칭 (`@` → `frontend/react/labs-web/src`). `../` 상대 import 는 쓰지 않는다.
- **`frontend/react/labs-web/src/app/shared/api/apiClient.ts`:** **`NEXT_PUBLIC_*`·서비스 PATH 없음** — 인자 `url` 은 호출 측이 만든 **브라우저 `fetch` URL**(보통 `process.env.NEXT_PUBLIC_{서비스id}_API_PATH + '/…'`). 공개 함수 **`fetch*` 접두** (`fetchGetApi`, `fetchPostApi`, `fetchRawJson`). **`fetchGetApi` · `fetchPostApi`** — **표준(공통) API 응답** envelope (`ApiResponse` → `data`, `error` 시 `ApiRequestError`); POST 는 **`requestBody` 필수** (`JSON.stringify`). **`fetchRawJson`** — envelope 밖 **Raw JSON GET** (`.ai/rules/api.md` 「HTTP 메서드」). `RequestInit`·PUT/PATCH/DELETE 는 두지 않는다. PATH·멀티 백엔드 조립은 **도메인 `api/`** 만.

## 설정

| 파일 | 역할 |
| --- | --- |
| `frontend/react/labs-web/next.config.ts` | `reactStrictMode`, `agentRules` off, dev `/labs-api` rewrites, Turbopack root |
| `frontend/react/labs-web/.env` | dotenv — 「환경」 표 |
| `frontend/react/labs-web/vitest.config.ts` | Vitest (jsdom, `setupFiles` → `vitest.setup.ts`) |
| `frontend/react/labs-web/vitest.setup.ts` | `@next/env` `loadEnvConfig`, `@testing-library/jest-dom` |
| `frontend/react/labs-web/eslint.config.js` | ESLint flat (TS, react-hooks) |
| `frontend/react/labs-web/prettier.config.js` | Prettier (format; `eslint-config-prettier` 로 충돌 규칙 off) |
| `frontend/react/labs-web/package.json` | scripts, version, dependencies |
| `frontend/react/labs-web/tsconfig.json` | TypeScript (`next build` 타입 검사) |

## 아직 없음

- 공통 UI 패키지 `@minhyuck-labs/ui`.
- UI 키트 (MUI, Tailwind 등).
- E2E (Playwright 등).
- CI workflow.
- 기본 틀의 `header.tsx` · `footer.tsx`.

정하면 이 파일과 `package.json` 을 같은 작업에서 갱신한다.
