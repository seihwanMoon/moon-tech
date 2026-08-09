---
title: "유지보수 가능한 사내 도구를 만드는 구조"
description: "업무 규칙과 외부 연결을 분리하고 설정·권한·테스트·로그·릴리스를 함께 설계하는 사내 도구 구조를 설명합니다."
date: 2026-08-08
updated: 2026-08-08
publish: true
type: article
topics:
  - coding
  - operations
  - security
tags:
  - coding/internal-tools
  - coding/architecture
  - operations/maintenance
aliases: []
related:
  - "[[coding/python/python-repeatable-automation]]"
  - "[[services/development-process]]"
service_relevance:
  - development-process
source_urls:
  - "https://www.12factor.net/"
  - "https://packaging.python.org/specifications/declaring-project-metadata/"
  - "https://docs.python.org/3/library/logging.html"
  - "https://docs.python.org/3/library/unittest.html"
  - "https://owasp.org/www-project-application-security-verification-standard/"
enableToc: true
---

> [!abstract] 이 글의 핵심
> 사내 도구는 화면이나 스크립트 하나가 아니라 업무 규칙, 외부 연결, 설정, 권한, 테스트, 로그, 릴리스와 인수 문서의 묶음입니다. 이 경계를 분리해야 작성자가 바뀌어도 변경 이유와 실패 원인을 찾을 수 있습니다.

사내 도구는 빠르게 만들어야 한다는 압박이 크지만, 처음부터 운영 조건을 무시하면 곧 “만든 사람만 아는 파일”이 됩니다. Twelve-Factor App, PyPA의 프로젝트 메타데이터, Python logging·unittest, OWASP ASVS를 참고해 작은 도구에도 반복 가능한 구조를 적용해 봅니다. 모든 원칙을 기계적으로 강제한다는 뜻은 아니며, 현재 위험과 팀 규모에 맞게 선택합니다.

## 1. 업무 규칙과 외부 연결을 분리한다

CSV 행을 품질 레코드로 해석하는 규칙과 파일 서버·API에서 데이터를 가져오는 코드는 서로 다른 이유로 바뀝니다. `domain` 또는 `rules` 계층은 외부 연결 없이 입력과 출력의 계약을 테스트하고, `adapters` 계층은 파일·HTTP·데이터베이스의 인증과 오류를 담당하게 합니다.

이렇게 나누면 실제 서비스 대신 작은 고정 데이터로 업무 규칙을 검증할 수 있고, 데이터 소스를 바꿀 때도 핵심 판단 코드를 다시 쓰지 않아도 됩니다.

## 2. 설정과 자격증명을 분리한다

실행 환경, 입력 위치, 제한 값, 로그 수준은 설정으로 관리하되 코드와 배포 파일에 비밀번호·토큰을 넣지 않습니다. 개발·테스트·운영 환경의 차이를 명시하고, 설정이 누락되거나 허용 범위를 벗어나면 시작 단계에서 실패하게 합니다.

버전 관리에 포함할 안전한 기본 설정과 운영자가 주입해야 할 비밀을 분리합니다. 변경된 설정의 출처와 적용 시점을 기록하면 결과를 재현하기 쉽습니다.

## 3. 관찰 가능성을 기능으로 만든다

로그는 디버깅용 부록이 아니라 사용자가 결과를 신뢰할 수 있게 만드는 증거입니다. 실행 ID, 버전, 입력 개수, 규칙 결과, 외부 호출, 승인자, 종료 상태를 구조화해 기록합니다. 민감 정보는 마스킹하고, 로그 보존 기간과 접근 권한도 정합니다.

오류 메시지는 “실패” 대신 어느 단계에서 어떤 입력이 왜 거부되었는지 설명해야 합니다. 부분 성공을 허용한다면 성공·보류·실패를 구분하고 다음 실행이 이어 받을 상태를 남깁니다.

## 4. 테스트와 데이터 계약을 함께 둔다

업무 규칙 단위 테스트, 외부 연결 어댑터 테스트, 대표 입력을 이용한 통합 테스트를 나눕니다. 빈 값, 중복 ID, 단위 오류, 권한 거부, 타임아웃 같은 실패 입력을 먼저 정합니다. 테스트 데이터는 실제 고객 정보가 아닌 합성 또는 비식별 샘플을 사용합니다.

PyPA의 `pyproject.toml` 명세를 사용하면 프로젝트 이름, 버전, 지원 Python 범위, 의존성을 한 곳에서 설명할 수 있습니다. 배포 전에는 동일한 테스트와 린트를 다시 실행하고, 변경 로그에 사용자 영향과 롤백을 적습니다.

## 5. 권한과 입력을 방어적으로 검증한다

도구가 읽을 수 있는 경로와 쓸 수 있는 경로를 구분하고, 사용자 입력이 다른 폴더나 계정으로 탈출하지 않는지 확인합니다. 파일 업로드·명령 호출·외부 URL·쿼리 매개변수는 허용 목록과 크기·시간 제한을 갖습니다. OWASP ASVS는 웹 애플리케이션 보안 요구를 점검하는 출발점으로 활용할 수 있습니다.

권한을 가진 서비스 계정으로 실행하더라도 사용자별 승인과 데이터 소유권을 생략하지 않습니다. 특히 [[ai/rag/rag-vs-agent-selection|RAG와 에이전트 비교]]처럼 자동화가 문서를 검색하거나 도구를 호출할 때는 검색 권한과 실행 권한을 별도로 검사합니다.

## 6. 릴리스와 인수 절차를 문서화한다

한 사람이 로컬에서 실행하는 것과 팀이 운영하는 것은 다릅니다. 지원 버전, 설치·업데이트 절차, 환경 변수, 권한 요청, 테스트 명령, 로그 위치, 흔한 오류, 롤백, 담당자 교체 순서를 README에 적습니다. 릴리스마다 버전과 변경 이유를 남기고, 이전 버전으로 돌아가는 방법을 실제로 시험합니다.

인수 문서는 개발이 끝난 뒤 작성하는 회고가 아니라 설계 중에 발견된 운영 조건의 목록입니다. 테스트가 지나갔다는 사실만으로 실제 업무가 안전하다고 결론 내리지 않습니다.

## 권장 구조 예시

```text
tool/
  src/
    domain/       # 업무 규칙과 데이터 계약
    adapters/     # 파일·API·DB 연결
    cli/          # 명령줄과 실행 옵션
  tests/           # 규칙·어댑터·통합 테스트
  docs/            # 운영·인수·변경 기록
  pyproject.toml   # 이름·버전·의존성·지원 범위
```

팀의 언어와 배포 방식에 맞춰 이름은 바꿀 수 있지만, 변경 이유가 다른 관심사를 한 파일과 한 권한에 몰아넣지 않는 것이 핵심입니다.

## 주의점과 한계

> [!warning] 적용 전 확인
> Twelve-Factor, PyPA, Python, OWASP 자료는 설계 참고점입니다. 조직의 규제·보안·품질 요구와 운영 플랫폼을 대신하지 않습니다. 실제 배포 전에는 보안 담당자와 데이터 소유자의 승인을 받고, 장애 시 수동 대체 절차를 확인하세요.

## 정리

유지보수성은 “깔끔한 코드”보다 경계와 증거에 가깝습니다. 업무 규칙을 독립적으로 테스트하고, 외부 연결·설정·권한·로그·릴리스를 문서화하면 도구가 한 사람의 개인 작업에서 팀의 운영 자산으로 바뀝니다. 반복 업무의 첫 범위를 정하려면 [[services/development-process|안전한 업무 자동화와 인수 가능한 도구]]를 참고하세요.

## 출처

- [The Twelve-Factor App](https://www.12factor.net/)
- [PyPA pyproject.toml specification](https://packaging.python.org/specifications/declaring-project-metadata/)
- [Python logging](https://docs.python.org/3/library/logging.html)
- [Python unittest](https://docs.python.org/3/library/unittest.html)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
