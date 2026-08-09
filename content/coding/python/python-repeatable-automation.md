---
title: "Python으로 반복 업무 자동화를 설계하는 방법"
description: "입출력, dry-run, 작은 함수, 로그, 안전한 외부 명령, 재실행 가능성을 기준으로 Python 자동화를 설계합니다."
date: 2026-08-08
updated: 2026-08-08
publish: true
type: article
topics:
  - coding
  - automation
tags:
  - coding/python
  - coding/automation
  - format/tutorial
aliases: []
related:
  - "[[coding/dev-tools/maintainable-internal-tools]]"
  - "[[services/development-process]]"
service_relevance:
  - development-process
source_urls:
  - "https://docs.python.org/3/library/argparse.html"
  - "https://docs.python.org/3/library/pathlib.html"
  - "https://docs.python.org/3/library/subprocess.html"
  - "https://docs.python.org/3/library/logging.html"
  - "https://docs.python.org/3/library/unittest.html"
enableToc: true
---

> [!abstract] 이 글의 핵심
> 반복 업무 자동화의 첫 목표는 “한 번 실행된다”가 아니라 “무엇을 바꾸는지 미리 알 수 있고, 실패를 설명하며, 같은 입력으로 다시 검증할 수 있다”입니다. 표준 라이브러리의 명확한 경계부터 시작하면 운영과 인수가 쉬워집니다.

파일 이름을 바꾸고, 폴더를 정리하고, 보고서용 데이터를 만드는 일은 작은 Python 스크립트로 시작할 수 있습니다. 하지만 원본을 바로 덮어쓰고 예외를 모두 잡아 버리면 성공 여부를 알기 어렵습니다. 자동화는 코드보다 업무 계약을 먼저 쓰는 작업입니다.

## 1. 입력·출력·금지 범위를 쓴다

입력 폴더, 허용 확장자, 최대 파일 수, 출력 폴더, 중복 처리, 실패 시 보존 정책을 문장으로 정합니다. `pathlib`의 경로 객체를 사용하면 운영체제별 경로 조합을 분리할 수 있습니다. 경로는 사용자 입력을 그대로 신뢰하지 말고 허용된 루트 아래인지 확인합니다.

예를 들어 “`incoming` 아래 CSV만 읽고, `review`에 새 파일을 만들며, `incoming`은 수정하지 않는다”라고 고정합니다. 출력 이름에 시각과 입력 해시를 넣으면 같은 작업의 결과를 구분하기 쉽습니다.

## 2. 명령줄 계약과 dry-run을 만든다

`argparse`로 입력 경로, 출력 경로, `--dry-run`, 로그 수준을 명시적인 옵션으로 제공합니다. 기본값은 안전한 쪽으로 두고, 실제 변경은 `--apply`처럼 눈에 띄는 별도 옵션으로 요구할 수 있습니다.

dry-run은 “변경 예정 파일과 이유”를 출력하고 어떤 파일도 쓰지 않아야 합니다. 운영자가 샘플 결과를 확인한 뒤 적용하도록 하면 코드를 실행하는 사람과 승인하는 사람을 분리할 수 있습니다.

## 3. 작은 함수로 단계별 검증한다

파일 수집, 입력 검증, 변환, 출력 계획, 실제 쓰기를 함수로 나눕니다. 각 함수는 가능한 한 한 가지 책임만 갖고, 구조화된 결과와 오류 이유를 반환합니다. 변환 함수는 파일 시스템이나 외부 서비스에 직접 의존하지 않게 하면 같은 데이터로 쉽게 테스트할 수 있습니다.

예상하지 못한 열, 잘못된 인코딩, 빈 파일, 중복 ID를 각각 오류로 분류합니다. 조용히 건너뛰면 결과가 그럴듯해 보여도 누락을 발견하기 어렵습니다.

## 4. 로그와 종료 코드를 설계한다

`logging`으로 실행 시작, 입력 개수, 변환 결과, 건너뛴 파일, 예외, 출력 위치를 기록합니다. 사용자 데이터나 토큰은 로그에 쓰지 않습니다. 성공, 검토 필요, 실행 실패를 종료 코드로 구분하면 배치 도구나 다른 시스템이 결과를 판단할 수 있습니다.

로그에는 실행 ID, 스크립트 버전, 설정 해시, 입력 목록 또는 목록의 해시를 포함할 수 있습니다. 이렇게 하면 “어제 실행 결과”를 다시 찾고 같은 조건으로 재실행하기 쉬워집니다.

## 5. 외부 명령은 계약을 확인한다

`subprocess`를 호출할 때는 문자열을 셸에 그대로 넘기지 않고 인자 목록과 명시적인 실행 파일을 사용합니다. 입력 파일명에 공백이나 특수 문자가 있어도 안전한지 확인하고, 시간 제한·표준 출력·표준 오류·종료 코드를 기록합니다. 외부 명령의 버전과 환경 차이도 운영 문서에 남깁니다.

가능하면 외부 명령 대신 Python API나 표준 라이브러리를 선택합니다. 필요한 경우에도 먼저 dry-run과 샘플 폴더에서 검증하고, 운영 계정에 광범위한 권한을 주지 않습니다.

## 6. 재실행과 테스트를 기본값으로 둔다

같은 입력을 두 번 처리해도 중복 파일이 생기거나 원본이 손상되지 않게 합니다. 출력이 이미 존재할 때 덮어쓰기, 건너뛰기, 버전 붙이기 중 하나를 명시합니다. 일부 파일만 성공한 경우 다음 실행이 남은 파일을 안전하게 이어서 처리할 수 있어야 합니다.

`unittest`로 정상 입력, 빈 입력, 잘못된 확장자, 중복 ID, 권한 오류, 외부 명령 실패를 테스트합니다. 테스트에서 실제 운영 경로를 지우거나 외부 시스템에 쓰지 않도록 임시 디렉터리와 가짜 명령을 사용합니다.

## 작은 예시 흐름

```text
입력 목록 고정 → 규칙 검증 → dry-run 계획 출력 → 사람 검토
→ 제한된 적용 → 결과·로그 보존 → 동일 입력 재실행 테스트
```

이 흐름은 [[services/development-process|안전한 업무 자동화와 인수 가능한 도구]]로 확장할 때도 그대로 사용할 수 있습니다. 제조 파일을 다룬다면 [[manufacturing/plm/plm-data-quality-checklist|PLM 데이터 품질 체크리스트]]의 ID·리비전·단위 규칙을 입력 검증에 반영합니다.

## 주의점과 한계

> [!warning] 적용 전 확인
> Python 표준 라이브러리 문서의 API가 있다고 해서 운영 데이터에 바로 적용해도 된다는 뜻은 아닙니다. 지원 Python 버전, 파일 권한, 개인정보·보존 정책, 백업과 롤백을 먼저 확인하고, 실제 파일럿은 복사본과 읽기 전용 흐름으로 시작하세요.

## 정리

좋은 자동화는 짧은 코드가 아니라 명확한 입력·출력·실패 계약을 갖습니다. dry-run, 로그, 종료 코드, 테스트, 재실행 규칙을 함께 설계하면 작은 스크립트가 팀이 인수할 수 있는 도구로 자랍니다.

## 출처

- [Python argparse](https://docs.python.org/3/library/argparse.html)
- [Python pathlib](https://docs.python.org/3/library/pathlib.html)
- [Python subprocess](https://docs.python.org/3/library/subprocess.html)
- [Python logging](https://docs.python.org/3/library/logging.html)
- [Python unittest](https://docs.python.org/3/library/unittest.html)
