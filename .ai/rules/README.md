# `.ai/rules` 인덱스

규칙 **전체를 한 번에 읽지 않는다.** `AGENTS.md` 의 읽기 순서에 따라 **이번 작업에 필요한 파일만** Read 한다.

| 파일 | 한 줄 요약 | 읽는 때 |
|------|-----------|---------|
| `common.md` | UTF-8/LF, 최소 수정, 추측·헬퍼 금지, docs 근거 금지 | **항상** (코드·하네스 작업) |
| `quality.md` | 입력·null·예외·비밀·로그·injection·timeout, 미완성 커밋 금지 | **항상** (코드·하네스 작업) |
| `git.md` | 브랜치, 커밋, 버전(tag·앱 version), 검증 보고 | Git 조작·작업 마무리 보고 |
| `java.md` | 레이어, Dto, Lombok, B1~B12 스타일 | `backend/**` Java·Spring |
| `react.md` | R1~R5 React 규칙 | `frontend/**` React |
| `api.md` | REST URI·HTTP·상태코드·오류 body (URI `/v1` 없음) | HTTP API 설계·구현 |
| `sql.md` | SQL·DB 규칙 | DB 정한 뒤, SQL·스키마 작업 |
| `testing.md` | given-when-then, Test 접미사 | 테스트 작성·수정 |

업무·도메인은 `../projects/` 이다. 지식 반영·승격 절차는 `../KNOWLEDGE.md` 이다.
