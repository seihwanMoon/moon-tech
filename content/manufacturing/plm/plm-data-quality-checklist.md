---
title: "PLM 데이터 품질을 개선하는 실무 체크리스트"
description: "PLM과 품질 데이터를 연결하기 전에 식별자, 리비전, 단위, 규칙, 관계, 중복, lineage, 승인을 점검하는 방법입니다."
date: 2026-08-08
updated: 2026-08-08
publish: true
type: article
topics:
  - manufacturing
  - data
tags:
  - manufacturing/plm
  - manufacturing/quality
  - data/quality
aliases: []
related:
  - "[[manufacturing/smart-factory/small-automation-start]]"
  - "[[projects/manufacturing-quality-ai-demo]]"
  - "[[source-notes/anthropic-effective-agents-web]]"
service_relevance:
  - product-manufacturing-data
source_urls:
  - "https://www.iso.org/standard/35736.html"
  - "https://www.iso.org/standard/78707.html"
  - "https://www.nist.gov/publications/contextualizing-manufacturing-data-lifecycle-decision-making"
  - "https://committee.iso.org/standard/77461.html"
  - "https://www.w3.org/TR/prov-overview/"
enableToc: true
---

> [!abstract] 이 글의 핵심
> PLM 데이터 품질은 값이 채워졌는지만의 문제가 아닙니다. 같은 대상을 다시 찾을 수 있고, 리비전과 상태를 구분하며, 설계·공정·검사 기록의 관계와 승인 이력을 추적할 수 있어야 합니다.

PLM 데이터를 AI 검색이나 보고서 자동화에 연결하려 할 때 가장 먼저 드러나는 문제는 “필드가 비어 있다”가 아닙니다. 비슷한 이름의 객체가 중복되고, 유효한 리비전이 모호하고, 단위와 시점이 섞이고, 어느 기록이 어느 판단의 근거였는지 다시 찾기 어렵다는 점입니다. 아래 항목은 ISO/IEC 25012와 ISO/TS 8000-82, NIST, ISO QIF, W3C PROV를 참고한 편집 체크리스트입니다. ISO 인증 심사나 표준 적합성 판정표가 아닙니다.

## 1. 식별자와 이름

부품·문서·공정·검사·결함을 식별하는 키를 각각 정합니다. 화면에 보이는 명칭과 시스템 내부 ID를 분리하고, 재사용 금지 또는 재사용 조건을 기록합니다. 사람이 읽는 이름의 표기 차이를 무조건 합치지 말고, 동일 객체라는 근거를 남깁니다.

**확인 질문**

- 같은 ID가 두 객체를 가리키지 않는가
- 신규·폐기·대체 ID의 관계를 추적할 수 있는가
- 외부 시스템으로 내보낼 때도 원래 ID가 보존되는가

## 2. 리비전과 상태

리비전은 변경 순서를, 상태는 사용 가능 여부나 승인 상태를 설명합니다. 파일명에 `final`을 넣는 것으로 둘을 대체하지 않습니다. 유효 기간, 변경 사유, 승인자, 적용 범위를 함께 기록하고 현재 기준을 명시합니다.

**확인 질문**: 최신이라는 표현이 어느 날짜와 기준을 뜻하는가? 설계 리비전과 검사 당시 리비전이 다르면 그 차이를 설명할 수 있는가?

## 3. 단위와 시간

수치에는 단위를, 측정에는 시간대와 측정 조건을 붙입니다. 숫자가 같아 보여도 mm와 inch, 현지 시간과 UTC가 섞이면 비교와 추세가 왜곡될 수 있습니다. 변환한 값은 원래 값, 변환 규칙, 실행 시점을 함께 보존합니다.

## 4. 데이터 규칙과 검증 위치

필수값, 허용 범위, 형식, 참조 무결성, 조합 조건을 규칙으로 표현합니다. 규칙 이름과 버전을 부여하고, 입력 시점·변환 시점·보고서 시점 중 어디에서 검사했는지 기록합니다. 규칙 실패를 조용히 고치지 말고 오류 큐나 검토 목록으로 보냅니다.

## 5. 설계·공정·검사 관계

객체마다 어떤 관계가 있는지 정의합니다. 부품이 어느 설계 문서와 어느 공정 계획에 속하고, 어느 검사 결과가 어떤 리비전을 확인했는지 링크가 있어야 합니다. 표 하나로 모든 관계를 표현하려 하지 말고 관계 유형·방향·유효 기간을 적습니다.

## 6. 중복과 고아 레코드

중복 후보는 자동 병합하기 전에 담당자가 확인합니다. 어떤 레코드가 어디에서도 참조되지 않는지, 참조는 있지만 대상이 사라졌는지 주기적으로 찾습니다. 병합·폐기·대체의 결과가 원본 기록과 함께 남아야 합니다.

## 7. Lineage와 출처

W3C PROV의 관점처럼 데이터가 어떤 활동과 행위를 통해 만들어졌는지 설명할 수 있어야 합니다. 원본 파일, 가져온 시각, 변환 코드 버전, 규칙 버전, 담당자를 함께 기록하면 요약이나 지표가 어디에서 왔는지 다시 확인할 수 있습니다.

## 8. 승인 이력과 접근 권한

값을 바꿀 수 있는 사람과 승인할 수 있는 사람을 분리합니다. 읽기·작성·승인·배포 권한을 같은 역할에 모두 주지 않고, 변경 전후 값과 사유를 남깁니다. 품질 기록은 AI 요약을 만들 때도 원본과 승인 상태가 보존되어야 합니다.

## 샘플 기반 적용 순서

전체 시스템을 한 번에 정리하는 대신 대표 제품군 하나, 리비전 몇 개, 검사 흐름 하나를 선택합니다.

1. 샘플 레코드의 ID·리비전·상태·단위·시점을 표로 만듭니다.
2. 규칙을 사람이 읽는 문장과 기계 검증 가능한 조건으로 나눕니다.
3. 설계·공정·검사 관계와 원본 위치를 링크합니다.
4. 위반·중복·고아 후보를 검토자에게 보여 주고 판단을 기록합니다.
5. 동일 샘플을 재실행해 같은 결과와 변경 이력을 얻는지 확인합니다.

## 주의점과 한계

> [!warning] 적용 전 확인
> 이 체크리스트는 데이터 품질 개선을 위한 시작점입니다. 사용 중인 PLM, QMS, ERP의 데이터 모델과 계약·보안·보존 요건을 확인하고, ISO 표준을 따랐다는 표현이나 인증을 임의로 사용하지 마세요.

## 정리

품질 데이터는 “값이 있다”보다 “무엇을 언제 어떤 규칙으로 측정했고 누가 승인했는지 다시 설명할 수 있다”가 중요합니다. 데이터 사전과 lineage를 작은 흐름에서 먼저 만들면 이후 검색·분석·자동화의 근거가 선명해집니다. 다음 단계는 [[services/product-manufacturing-data|제품·제조 데이터 흐름 진단]]에서 문제의 범위를 좁혀 볼 수 있습니다.

## 출처

- [ISO/IEC 25012 Data Quality Model](https://www.iso.org/standard/35736.html)
- [ISO/TS 8000-82 Creating Data Rules](https://www.iso.org/standard/78707.html)
- [NIST — Contextualizing Manufacturing Data for Lifecycle Decision Making](https://www.nist.gov/publications/contextualizing-manufacturing-data-lifecycle-decision-making)
- [ISO 23952 Quality Information Framework](https://committee.iso.org/standard/77461.html)
- [W3C PROV Overview](https://www.w3.org/TR/prov-overview/)
