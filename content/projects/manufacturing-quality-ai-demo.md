---
title: "제조 품질 데이터를 분석하는 AI 보조 시스템 데모"
description: "합성 품질 데이터를 읽고 근거가 있는 요약과 이상 후보를 제시하되 최종 판정은 사람에게 두는 공개 설계 예제입니다."
date: 2026-08-08
updated: 2026-08-08
publish: true
type: project
topics:
  - projects
  - manufacturing
  - ai
tags:
  - project/demo
  - manufacturing/quality
  - ai/assistive
aliases: []
related:
  - "[[manufacturing/plm/plm-data-quality-checklist]]"
  - "[[manufacturing/smart-factory/small-automation-start]]"
  - "[[services/product-manufacturing-data]]"
service_relevance:
  - product-manufacturing-data
source_urls:
  - "https://committee.iso.org/standard/77461.html"
  - "https://www.mtconnect.org/getting-started/"
  - "https://www.iso.org/standard/56847.html"
  - "https://www.nist.gov/programs-projects/industrial-artificial-intelligence-management-and-metrology-iaimm"
  - "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf"
enableToc: true
---

> [!warning] 공개 예제 프로젝트
> 이 문서는 실제 고객·생산라인·수행 경력·개선율을 보여 주는 사례가 아닙니다. 모든 데이터와 결과는 설계를 설명하기 위한 합성·가상 예제이며, 표준 적합성이나 현장 정확도를 주장하지 않습니다.

## 문제 정의

품질 담당자가 여러 검사 기록을 모아 현재 상태를 요약하고, 다시 확인할 이상 후보를 골라야 한다고 가정합니다. 데모의 목표는 자동 판정이 아니라 다음 세 가지를 한 화면에서 확인하는 것입니다.

- 어떤 레코드와 측정 조건을 사용했는가
- 어떤 규칙으로 이상 후보가 표시되었는가
- 담당자가 어떤 근거를 확인하고 승인했는가

## 합성 데이터 경계

가상 생산 로트, 검사 항목, 측정값, 단위, 판정 상태를 작은 CSV로 만든다고 가정합니다. 실제 고객명, 설비 식별자, 공정 능력, 불량률은 포함하지 않습니다. 각 레코드에는 `lot_id`, `inspection_id`, `revision`, `measured_at`, `unit`, `value`, `rule_id`, `review_status`를 둡니다.

## 흐름

1. **수집**: 읽기 전용 샘플 파일을 불러오고 필수 열·단위·시간 형식을 확인합니다.
2. **규칙 검사**: 범위 초과, 단위 불일치, 중복 식별자, 승인되지 않은 리비전을 후보로 표시합니다.
3. **근거 요약**: AI는 원본 레코드의 링크와 규칙 ID를 포함한 초안 요약만 만듭니다.
4. **사람 검토**: 품질 담당자가 원본과 조건을 확인하고 `accepted`, `rejected`, `needs-review` 중 하나를 선택합니다.
5. **기록**: 입력 해시, 규칙 버전, 요약 생성 시각, 검토자를 남깁니다.

## 사람이 맡는 결정

AI는 기록 요약과 이상 후보 표시를 보조할 뿐입니다. 출하·공정 변경·불량 확정·원인 판정은 데모의 자동화 범위에 넣지 않습니다. 사람이 근거를 열어 보고 판단을 수정할 수 있어야 하며, 모델이 사용한 자료가 무엇인지 재현할 수 있어야 합니다.

## 검증 질문

- 동일한 입력과 규칙 버전으로 같은 후보 목록을 다시 만들 수 있는가
- 단위와 리비전이 다른 레코드를 섞어 요약하지 않는가
- 근거가 없는 문장을 생성하면 검토자가 쉽게 알아볼 수 있는가
- 잘못된 후보를 되돌리고 원래 기록을 보존할 수 있는가
- 담당자가 시스템 없이도 원본과 검토 이력을 읽을 수 있는가

QIF·MTConnect·ISO 22400·NIST 자료는 데이터 구조와 제조 측정 맥락을 공부하기 위한 공식 출처입니다. 이 데모가 해당 표준을 구현하거나 인증을 통과했다는 뜻은 아닙니다.

## 다음 확장 조건

샘플 검증이 반복 가능하고 담당자가 결과를 설명할 수 있을 때만 더 많은 공정이나 쓰기 연동을 검토합니다. 보안·권한·보존 기간·오류 복구를 별도로 검토하기 전에는 운영 시스템에 직접 쓰지 않습니다.

## 관련 글과 서비스

- [[manufacturing/plm/plm-data-quality-checklist|PLM 데이터 품질 체크리스트]]
- [[manufacturing/smart-factory/small-automation-start|작은 자동화부터 시작하기]]
- [[services/product-manufacturing-data|제품·제조 데이터 흐름 진단]]

## 출처

- [ISO 23952 QIF](https://committee.iso.org/standard/77461.html)
- [MTConnect Getting Started](https://www.mtconnect.org/getting-started/)
- [ISO 22400-1 Manufacturing KPI Framework](https://www.iso.org/standard/56847.html)
- [NIST Industrial AI Management and Metrology](https://www.nist.gov/programs-projects/industrial-artificial-intelligence-management-and-metrology-iaimm)
- [NIST Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)
