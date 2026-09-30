# minhyuck-labs

## Layout

```
minhyuck-labs/
├── .ai/                    AI Coding Assistants 규칙·메모
│   ├── KNOWLEDGE.md            지식 반영·승격 절차
│   ├── projects/               앱별 도메인·스택
│   │   ├── labs-api.md             labs-api 앱 도메인·스택
│   │   ├── labs-web.md             labs-web 앱 도메인·스택
│   │   └── README.md               앱 목록 인덱스
│   └── rules/                  공통 코딩 규칙
│       ├── api.md                  REST·HTTP API
│       ├── common.md               공통·환경·스택·하네스 작성
│       ├── git.md                  Git·버전·검증 보고
│       ├── java.md                 Java·Spring 스타일
│       ├── quality.md              품질·안전
│       ├── react.md                React
│       ├── README.md               규칙 읽기 순서 인덱스
│       ├── sql.md                  Flyway·SQL
│       └── testing.md              테스트
├── .claude/
│   └── settings.json           Claude Code 하네스 점검 hook
├── .cursor/
│   ├── hooks.json              Cursor 하네스 점검 hook
│   └── rules/                  Cursor glob 규칙
├── AGENTS.md               AI Coding Assistants Instructions
├── CLAUDE.md               Claude Code Instructions (pointer to AGENTS.md)
├── backend/
│   └── java/
│       └── labs-api/               REST API (Spring Boot 4.1, Java 25)
├── docs/                   소개, 경력, 프로젝트 정리
├── frontend/
│   └── react/
│       └── labs-web/           React SPA (Vite, React 19, TypeScript)
├── mobile/
│   ├── android/                TO-DO
│   └── ios/                    TO-DO
└── scripts/                로컬 개발 환경 검사·설치 Scripts
    ├── harness/                하네스 점검 (`scripts/harness/check.sh`, banned.txt, hook)
    ├── setup.sh                macOS / Linux
    └── setup.ps1               Windows
```

## Setup Guide

1. 레파지토리 Clone.
2. AI Coding Assistants에서 해당 레파지토리 Open.
3. 아래 프롬프트를 순서대로 입력
    - 3.1. `AGENTS.md 「New PC / dev bootstrap」 읽고 이 PC 로컬 개발 환경 세팅 준비해 줘.`
    - 3.2. `OS에 맞는 scripts/setup 스크립트 실행하고, 없는 JDK 25·Docker·Node.js(npm) 는 설치해 줘. (스크립트가 labs-api ./gradlew test 와 labs-web npm ci · npm run test 까지 돌린다.)`
    - 3.3. `Docker 엔진이 Running 인지 확인해 줘. 내가 직접 해야 하는 단계가 있으면 그것만 알려 줘.`
    - 3.4. `backend/java/labs-api 에서 ./gradlew bootRun 띄워서 GET http://localhost:8080/labs-api/actuator/health 가 {"status":"UP"} 인지 확인하고 종료해 줘.`
    - 3.5. `bootRun 다시 켠 상태에서 frontend/react/labs-web 에 npm run dev 하고 http://localhost:5173 에서 백엔드 health UP 이 보이는지 확인해 줘.`
4. Setup 확인
    - 4.1. 프롬프트 입력: `setup 스크립트·./gradlew test·labs-web npm run test 가 모두 통과했고, 3.4 health 와 3.5 화면까지 확인했으면 완료, 아니면 실패. 한 단어로만 답해 줘.`
    - 4.2. 답이 `완료` 이면 Setup 완료.

## Run Guide

1. Docker 엔진 Running.
2. IntelliJ에서 minhyuck-labs Open.
3. Backend Run
    - 3.1. 메뉴바 실행(Run) → 구성 편집(Edit Configurations) → 실행/디버그 구성(Run/Debug Configurations) 창 Open.
    - 3.2. 창 좌상단 +(새 구성) → Spring Boot.
        - 이름(Name): LabsApiApplication (원하는 이름으로 변경 가능).
        - 실행 위치(Run on): 로컬 머신(Local machine).
        - JDK: 25
        - 모듈(Module): labs-api.main
        - Main class(필드): 오른쪽 $ 기호 클릭 → Spring Boot 클래스 선택 창 Open.
            - LabsApiApplication (com.minhyuck.labs · labs-api.main) 선택 → 확인(OK).
            - Main class 값 com.minhyuck.labs.LabsApiApplication 로 채워졌는지 확인.
        - 활성화된 프로파일(Active profiles): 공란.
        - 옵션 수정(Modify options) → 작업 디렉터리(Working directory) 선택.
        - 작업 디렉터리(Working directory): $MODULE_WORKING_DIR$
        - 창 하단 확인(OK).
    - 3.3. 메뉴바 IntelliJ IDEA → 설정(Settings).
        - 좌측 트리: 빌드, 실행, 배포(Build, Execution, Deployment) → 빌드 도구(Build Tools) → Gradle.
        - Gradle 프로젝트(Gradle Projects): labs-api 선택.
        - 다음을 사용하여 빌드 및 실행(Build and run using): Gradle (디폴트).
        - 다음을 사용하여 테스트 실행(Run tests using): Gradle (디폴트).
        - Gradle JVM: 프로젝트 SDK (JDK 25).
        - 확인(OK).
    - 3.4. 툴바 실행 구성(LabsApiApplication) → Run(실행) 또는 Debug(디버그).
    - 3.5. 실행/디버그(Run/Debug) 도구 창 콘솔(Console)에서 아래 로그가 보이면 OK.
        - Started LabsApiApplication in … seconds — 앱 기동 완료.
        - Container … Healthy — Postgres 컨테이너 준비됨.
        - Database: jdbc:postgresql://127.0.0.1:5432/labs_api — DB 연결됨.
4. Frontend Run
    - 4.1. Cursor(또는 IDE) 왼쪽 하단 터미널(Terminal) Open. 프롬프트 끝이 minhyuck-labs (레포 루트) 인지 확인.
    - 4.2. 터미널에 아래를 순서대로 입력.
        - cd frontend/react/labs-web
        - npm run dev
    - 4.3. 터미널에 Local: http://localhost:5173/ 가 보이면 dev 서버 OK.
    - 4.4. 브라우저가 http://localhost:5173 자동 Open. Backend health UP 이 보이면 OK.

## Version

0.0.1

## History

| Version | Notes                                              |
| ------- | -------------------------------------------------- |
| 0.0.1   | Monorepo layout, harness, labs-api, labs-web setup |
