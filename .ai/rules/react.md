# React 기술 규칙

`frontend/**` React 앱에 적용한다.

## 이름

- 컴포넌트 함수·파일은 PascalCase (`UserList.tsx`).
- 훅 함수·훅 전용 파일은 `use` 접두 + camelCase 파일명 (`useUserList.ts`).
- UI가 아닌 `.ts` · `.tsx`(진입·조립 등 Vite 관례 제외) **파일명**은 camelCase (`apiClient.ts`, `apiResponse.ts`). kebab-case·파일명 점 접미사(`*.types.ts`, `*.api.ts`)는 쓰지 않는다 — 역할은 `types/` · `api/` 디렉터리로 구분한다.
- 타입·interface **식별자**는 PascalCase (`ApiResponse`, `OrderListRequest`). 백 DTO·`.ai/rules/api.md` envelope 필드명과 맞춘다.
- export type·함수·클래스 JSDoc 은 **한 줄 한국어**로 **하는 일**만 적는다. 타입·프레임워크·제품명 나열, 「등」으로 열거하는 문서체는 쓰지 않는다. envelope·Actuator 등 구분·상세는 `.ai/projects/` · `api.md` 에만 둔다.

## 상태

- 한 화면에서만 쓰는 상태는 컴포넌트 또는 그 화면 훅에 둔다.
- Redux, Zustand 등 전역 스토어는 기본으로 도입하지 않는다. 여러 화면이 같은 상태가 필요하면 동의를 받는다.

## API

- HTTP 호출은 화면 JSX에 흩뿌리지 않고 `api/` 디렉터리 아래 모듈로 모은다.
- 비즈니스 REST envelope 파싱·Actuator 등 envelope 밖 JSON 구분은 `.ai/projects/` 해당 프론트 앱 「소스 레이아웃」·`.ai/rules/api.md` 「HTTP 메서드」. `shared/api` 는 **`VITE_{서비스id}_API_PATH` 등 서비스 env 를 읽지 않는다** — URL 조립은 `api/` · `domains/…/api/` (`.ai/projects/` 해당 앱 「환경」).
- Req/Res·envelope 타입은 **같은 scope의 `types/`** 에만 둔다. 타입 파일과 API(호출) 파일을 한 파일에 섞지 않는다.
- TypeScript를 쓰는 코드에서 `any` 를 기본으로 쓰지 않는다. 우회가 필요하면 이유를 적는다.

## 스타일

- UI가 아닌 `.ts` 모듈 멤버 순서: **export 공개 함수(메인) 먼저**, 그 아래는 메인 본문에서 **처음 등장하는 순**으로 헬퍼·오류 클래스 등 상세를 둔다 (`.ai/rules/java.md` 「메서드 흐름과 주석」과 같음).
- 검사 순서·의미가 코드만으로 드러나지 않는 `if` 분기에는 **한글 `//`** 로 **조건**을 적는다 (예: `// 응답 상태가 정상(2xx)이 아닌 경우`). 처리 동작 나열·뻔한 주석은 쓰지 않는다 (`.ai/rules/java.md` 「메서드 흐름과 주석」).
- 짧은 URL·검증 조합 등 **2~3줄 헬퍼**는 기본 인라인한다. 헬퍼·유틸 남발 금지: `.ai/rules/common.md` 「작업 방식」.

## 비밀

- 프론트 번들(`VITE_*` 등)에 넣은 값은 브라우저에 그대로 노출된다. 시크릿·개인 토큰·DB 비밀번호를 두지 않는다.
- 비밀이 필요한 처리는 백엔드에서 한다 (공통 기준은 `.ai/rules/quality.md`).
