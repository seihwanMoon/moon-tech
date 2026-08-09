---
title: "제품·제조 데이터 흐름 진단"
description: "제품 정보와 품질 기록이 분산된 팀을 위해 데이터 규칙, 변경 이력, lineage를 작게 연결하는 방법을 설계합니다."
date: 2026-08-08
updated: 2026-08-08
publish: true
type: service
topics:
  - manufacturing
  - data
tags:
  - service/manufacturing-data
  - manufacturing/plm
  - data/lineage
aliases: []
related:
  - "[[manufacturing/plm/plm-data-quality-checklist]]"
  - "[[projects/manufacturing-quality-ai-demo]]"
  - "[[services/index]]"
service_relevance:
  - product-manufacturing-data
source_urls:
  - "https://www.iso.org/standard/35736.html"
  - "https://www.w3.org/TR/prov-overview/"
enableToc: true
---

제품 정보와 품질 기록이 여러 파일과 시스템에 나뉘어 있으면, AI나 자동화를 추가하기 전에 “같은 대상을 같은 이름으로 가리키는가”부터 확인해야 합니다. 이 서비스는 특정 제품 도입을 약속하는 작업이 아니라, 현재 데이터 흐름을 읽고 작은 연결 단위를 설계하는 문제 해결 과정입니다.

## 이런 상황에 유용합니다

- 부품·문서·검사 기록의 식별자가 서로 다릅니다.
- 리비전과 상태가 파일명이나 담당자의 기억에만 남아 있습니다.
- 설계·공정·검사 기록의 연결 근거를 다시 찾는 데 시간이 걸립니다.
- 품질 데이터의 출처와 변경 이력을 설명하기 어렵습니다.

## 먼저 확인하는 항목

[[manufacturing/plm/plm-data-quality-checklist|PLM 데이터 품질 체크리스트]]를 기준으로 다음을 샘플 데이터에 적용합니다.

1. 식별자와 이름이 유일하고 재사용 규칙이 있는가
2. 리비전·상태·유효 기간이 함께 기록되는가
3. 단위·시간대·측정 조건이 빠지지 않는가
4. 설계·공정·검사 레코드가 어떤 관계로 연결되는가
5. 중복·고아 레코드를 찾을 수 있는가
6. 변경·승인·출처를 다시 추적할 수 있는가

ISO/IEC 25012와 W3C PROV는 데이터 품질과 provenance를 생각하는 데 유용한 공식 참고점이지만, 이 진단이 ISO 인증이나 표준 적합성 판정을 대신하지는 않습니다.

## 작은 진단의 산출물

- 대표 객체와 식별자 규칙을 적은 데이터 사전
- 현재 시스템·파일·담당자 사이의 흐름 지도
- 중복·누락·고아·상태 충돌을 확인하는 규칙 목록
- 읽기 전용 샘플로 재실행할 수 있는 검증 절차
- 다음 단계로 넘어갈 조건과 아직 보류할 범위

처음부터 전체 PLM을 통합하지 않습니다. 한 제품군 또는 한 품질 흐름을 선택하고, 데이터 소유자와 검토자를 분명히 한 뒤 결과가 실제 의사결정에 쓰이는지 확인합니다.

## AI와 연결할 때의 경계

데이터가 정리되지 않은 상태에서 검색·요약을 붙이면 오래된 리비전이나 서로 다른 단위가 함께 노출될 수 있습니다. AI는 정리된 근거의 탐색과 후보 요약을 보조할 수 있지만, 변경 승인과 품질 판정은 권한을 가진 사람이 담당해야 합니다.

시작할 문제와 샘플 범위를 정하고 싶다면 [[contact|Contact]]로 현재 흐름을 알려주세요.

## 출처

- [ISO/IEC 25012 Data Quality Model](https://www.iso.org/standard/35736.html)
- [W3C PROV Overview](https://www.w3.org/TR/prov-overview/)
