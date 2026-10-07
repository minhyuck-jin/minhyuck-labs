# React 기술 규칙

`frontend/**` React 앱에 적용한다.

## 이름

- 컴포넌트 함수·파일은 PascalCase (`UserList.tsx`). 기본 틀·팝업 틀과 같은 폴더의 공통 틀 파일(`sidebar.tsx`, `header.tsx`, `footer.tsx`)만 소문자다.
- 훅 함수·훅 전용 파일은 `use` 접두 + camelCase 파일명 (`useUserList.ts`).
- UI가 아닌 `.ts` · `.tsx` **파일명**은 camelCase (`apiClient.ts`, `apiResponse.ts`). kebab-case·파일명 점 접미사(`*.types.ts`, `*.api.ts`)는 쓰지 않는다 — 역할은 `types/` · `api/` 디렉터리로 구분한다. 화면·레이아웃 파일명은 「화면」.
- 타입·interface **식별자**는 PascalCase (`ApiResponse`, `OrderListRequest`). 백 DTO·`.ai/rules/api.md` envelope 필드명과 맞춘다.
- export type·함수·클래스·변수 JSDoc 은 **한 줄 한국어 명사구**로 **의미**를 요약한다 (예: `화면 레이아웃 유형`). 타입·프레임워크·제품명 나열, 「등」으로 열거하는 문서체는 쓰지 않는다. envelope·Actuator 등 구분·상세는 `.ai/projects/` · `api.md` 에만 둔다. 단계·분기 주석만 설명이 길어진다 (이 파일 「스타일」, `.ai/rules/java.md` 「메서드 흐름과 주석」).
- API 함수 접두: 조회 `fetch`, 검색 `search`, 저장 `save`, 생성 `create`, 수정 `update`, 삭제 `delete`, 업로드 `upload`, 다운로드 `download`, 제출 `submit`, 취소 `cancel`, 다시 받기 `refresh`. 참·거짓은 `is`.
- `patch`는 HTTP PATCH를 그대로 감쌀 때만 쓴다. `remove`는 화면 목록·배열에서 뺄 때만 쓴다. 서버 수정·삭제는 `update`·`delete`.
- 여러 API를 순서대로 부르는 함수는 동작 접두를 다시 쓰지 않고 업무 이름으로 둔다.

## 상태

- 한 화면에서만 쓰는 상태는 컴포넌트 또는 그 화면 훅에 둔다.
- Redux, Zustand 등 전역 스토어는 기본으로 도입하지 않는다. 여러 화면이 같은 상태가 필요하면 동의를 받는다.

## API

- HTTP 호출은 화면 JSX에 흩뿌리지 않고 `api/` 디렉터리 아래 모듈로 모은다.
- 비즈니스 REST envelope 파싱·Actuator 등 envelope 밖 JSON 구분은 `.ai/projects/` 해당 프론트 앱 「소스 레이아웃」·`.ai/rules/api.md` 「HTTP 메서드」. `shared/api` 는 **`NEXT_PUBLIC_{서비스id}_API_PATH` 등 서비스 env 를 읽지 않는다** — URL 조립은 기능별 `api/` (`.ai/projects/` 해당 앱 「환경」).
- Req/Res·envelope 타입은 **같은 scope의 `types/`** 에만 둔다. 타입 파일과 API(호출) 파일을 한 파일에 섞지 않는다.
- TypeScript를 쓰는 코드에서 `any` 를 기본으로 쓰지 않는다. 우회가 필요하면 이유를 적는다.
- 화면의 비동기 호출은 `async`/`await` 다. `useEffect` 콜백은 `async` 로 두지 않고, 안에 `async` 함수를 만들어 `await` 한 뒤 호출한다. 이어서 호출하는 API도 그 함수 안에서 `await` 한다.
- 규모·표준을 두는 시점: `.ai/rules/common.md` 「환경·스택」.

## 스타일

- UI가 아닌 `.ts` 모듈 멤버 순서: **export 공개 함수(메인) 먼저**, 그 아래는 메인 본문에서 **처음 등장하는 순**으로 헬퍼·오류 클래스 등 상세를 둔다 (`.ai/rules/java.md` 「메서드 흐름과 주석」과 같음).
- 검사 순서·의미가 코드만으로 드러나지 않는 `if` 분기에는 **한글 `//`** 로 **조건**을 적는다 (예: `// 응답 상태가 정상(2xx)이 아닌 경우`). 처리 동작 나열·뻔한 주석은 쓰지 않는다 (`.ai/rules/java.md` 「메서드 흐름과 주석」).
- 짧은 URL·검증 조합 등 **2~3줄 헬퍼**는 기본 인라인한다. 헬퍼·유틸 남발 금지: `.ai/rules/common.md` 「작업 방식」.

## 폼

- 조회·저장 입력이 있는 화면은 React Hook Form으로 만든다. 패키지 버전은 `.ai/projects/` 해당 프론트 앱.
- 제출 핸들러는 `async` 다. 저장 뒤 조회처럼 이어지는 API도 그 핸들러 안에서 `await` 한다.
- 중복 제출은 `formState.isSubmitting` 으로 막는다. 핸들러 Promise가 끝나기 전에 버튼이 다시 눌리지 않게 한다.

## 화면

- 아래 경로는 App Router 화면의 경로다. 지금 앱에 구현된 트리는 `.ai/projects/` 해당 프론트 앱 「소스 레이아웃」이다.
- 주소는 `src/app` 폴더다. 화면 파일은 `page.tsx`, 레이아웃 파일은 `layout.tsx`다.
- 루트 `src/app/layout.tsx`는 `html`, `body`와 전역 CSS만 둔다.
- 기본 틀과 팝업 틀은 route group `(default)`, `(popup)`으로 나눈다. 괄호 이름은 주소에 붙지 않는다. `(default)`는 PC 전용 화면이 아니라 기본 틀이다.
- `(default)/layout.tsx`가 기본 틀이다. `sidebar.tsx`, `header.tsx`, `footer.tsx`는 그 파일과 같은 폴더에 둔다.
- 기본 틀에 화면을 넣을 때 도메인 대표 화면은 `(default)/{domain}/page.tsx`이고 주소는 `/{domain}`이다. 같은 도메인의 다른 화면은 `(default)/{domain}/{경로}/page.tsx`다. 대표 화면용 `main` 폴더는 두지 않는다.
- 팝업 틀에 화면을 넣을 때는 `(popup)/{domain}/{경로}/page.tsx`다. `(popup)` 바로 아래 `page.tsx`는 두지 않는다. `(default)`와 같은 주소가 되면 안 된다.
- 도메인 `api/`, `types/`는 그 도메인 폴더에 둔다. 여러 도메인이 같이 쓰는 코드는 `src/app/shared/`에 둔다.
- `StrictMode`를 쓰지 않는다. 개발 모드에서 effect를 두 번 실행하지 않는다.
- 프론트 화면은 반응형 웹을 표준으로 한다.
- 스타일을 작성·수정할 때 iPhone Safari와 Android Chrome 표시를 함께 맞춘다.
- iPhone Safari에서 어긋나기 쉬운 뷰포트 높이, safe area, `fixed`·`sticky`, 16px 미만 입력 초점 확대를 스타일에서 맞춘다.
- 글꼴은 프로젝트에 넣은 파일만 쓴다. 외부 폰트 URL은 쓰지 않는다.

## 비밀

- 프론트 번들(`NEXT_PUBLIC_*` 등)에 넣은 값은 브라우저에 그대로 노출된다. 시크릿·개인 토큰·DB 비밀번호를 두지 않는다.
- 비밀이 필요한 처리는 백엔드에서 한다 (공통 기준은 `.ai/rules/quality.md`).
