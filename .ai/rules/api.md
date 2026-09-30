# HTTP API 규칙

백엔드·프론트가 같은 HTTP API를 쓸 때 적용한다.

## URI

- 소문자, 하이픈(`-`). 밑줄·캐멀케이스·대문자를 쓰지 않는다.
- 자원은 명사. 집합은 복수형 (`/orders`, `/order-items`).
- 슬래시(`/`)는 자원 계층에만 쓴다. URI 끝에 `/` 를 붙이지 않는다.
- `/getOrder` 같은 **캐멀케이스·동사-only** 경로는 쓰지 않는다.
- 복합 조회·일괄 저장 등 **POST + body** 로 두는 API는 `{자원}/search`, `{자원}/save-changes` 처럼 **명사·하이픈** 하위 경로로 구분한다.
- 계층을 과하게 중첩하지 않는다.
- 경로에 API 버전을 넣지 않는다 (`/v1/orders` 금지). 헤더·쿼리로도 버전을 기본 두지 않는다.

## HTTP 메서드

- **비즈니스 API 기본:** **POST** + `@RequestBody` `{Feature}RequestDto` (조회·저장·일괄 처리·복합 조건).
- **예외 (필요할 때만):** 단순 조회·파일/엑셀 다운로드 등 **GET** + path·query (body 없음). PUT·PATCH·DELETE 는 해당 API를 만들 때 **GET/POST 로 대체하기 어렵다**고 판단될 때만 도입한다.
- Actuator · SpringDoc 응답은 이 envelope 규칙 **밖** (raw JSON).

## 공통 응답 envelope

비즈니스 REST JSON body는 **`ApiResponse<T>`** 로 통일한다. 구현 package·handler: `.ai/projects/` 해당 백엔드 앱 문서 「HTTP」.

| 필드 | 성공 | 실패 |
| --- | --- | --- |
| `data` | payload (`T`) 또는 `null` (본문 없음 성공) | `null` |
| `error` | `null` | `{ "code", "message" }` (`ApiResponse.Error`) |

- HTTP status 와 의미를 맞춘다. HTTP 200 바디만으로 실패를 표현하지 않는다.
- Controller 성공: `ResponseEntity.ok(ApiResponse.ok(responseDto))` 또는 `ApiResponse.ok()` (payload 없음).
- 4xx·5xx 는 `@RestControllerAdvice` 가 **동일 envelope** 로 반환한다.
- 업무 **payload** 는 `{Feature}ResponseDto` 이다. 목록은 `{Feature}ListResponseDto` 등에 `items`, `totalCount`, 필요 시 `page`, `pageSize` 를 둔다. 다건 처리 결과는 API별 ResponseDto 를 쓴다. envelope 타입명에는 `Dto` 접미사를 붙이지 않는다 (`ApiResponse`).
- **전체 요청 거절** → 4xx/5xx + `error`. **일부 건 실패 리포트** → 2xx + `data` 안에 `failures` 등 (API별 DTO).

## 상태 코드

- 성공은 2xx, 클라이언트 오류는 4xx, 서버 오류는 5xx.
- 생성 후 body 가 있으면 **201** 을 쓸 수 있다. 팀이 **200** 으로 통일해도 된다 (한 가지만 고정).

## 오류 응답

- `error.code` 는 **기계용** 문자열. **프레임워크** handler bucket 은 `HttpStatus.name()` (예: `BAD_REQUEST`, `NOT_FOUND`, `INTERNAL_SERVER_ERROR`). **업무** 예외는 도메인별 code (도입 시 정의).
- `error.message` 는 **사람용** (클라이언트 표시·로그).
- **오류 handler**는 `@RestControllerAdvice` 에 HTTP **status bucket**마다 메서드를 둔다. 메서드명 `{statusCamelCase}ExceptionHandler`, **클래스 안 메서드 순서**는 bucket status 오름차순(400·401·403·404·500·502·503·504 등 팀이 정한 목록). 매개변수 `Exception e`. 프레임워크 `code` = bucket `HttpStatus.name()`, message = `e.getMessage()`. `ResponseStatusException` 은 한 `@ExceptionHandler` 에서 status 에 맞는 bucket 메서드로 위임한다. registry·타입별 code Map 은 두지 않는다. **업무 예외**는 도메인 도입 시 전용 `code`·handler. 구현: `.ai/projects/` 해당 백엔드 앱 「HTTP」.
- 스택 트레이스, 내부 클래스명, 쿼리 같은 내부 구현을 응답으로 내보내지 않는다.
