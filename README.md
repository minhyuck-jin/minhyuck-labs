# minhyuck-labs

## Layout

```
minhyuck-labs/
├── .ai/                    AI Coding Assistants 규칙·메모
│   ├── KNOWLEDGE.md            지식 반영·승격 절차
│   ├── projects/               앱별 도메인·스택
│   │   ├── labs-api.md             labs-api 앱 도메인·스택
│   │   └── README.md               앱 목록 인덱스
│   └── rules/                  공통 코딩 규칙
│       ├── api.md                  REST·HTTP API
│       ├── common.md               공통 작업 방식
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
│   └── react/                  TO-DO
├── mobile/
│   ├── android/                TO-DO
│   └── ios/                    TO-DO
└── scripts/                로컬 개발 환경 검사·설치 Scripts
    ├── harness/                하네스 점검 (check.sh, banned.txt, hook 스크립트)
    ├── setup.sh                macOS / Linux
    └── setup.ps1               Windows
```

## Setup Guide

1. 레파지토리 Clone.
2. AI Coding Assistants에서 해당 레파지토리 Open.
3. 아래 프롬프트를 순서대로 입력
    - 3.1. `AGENTS.md 「New PC / dev bootstrap」 읽고 이 PC 로컬 개발 환경 세팅 준비해 줘.`
    - 3.2. `OS에 맞는 scripts/setup 스크립트 실행하고, 없는 JDK 25·Docker 는 설치해 줘.`
    - 3.3. `Docker 엔진이 Running 인지 확인해 줘. 내가 직접 해야 하는 단계가 있으면 그것만 알려 줘.`
    - 3.4. `./gradlew bootRun 띄워서 health UP 확인하고 종료해 줘.`
4. Setup 확인
    - 4.1. 프롬프트 입력: `./gradlew test 가 BUILD SUCCESSFUL 이고 health 가 {"status":"UP"} 이면 완료, 아니면 실패. 한 단어로만 답해 줘.`
    - 4.2. 답이 `완료` 이면 Setup 완료.

## Version

0.0.1

## History

| Version | Notes                                      |
|---------|--------------------------------------------|
| 0.0.1   | Monorepo layout, harness, labs-api setting |
