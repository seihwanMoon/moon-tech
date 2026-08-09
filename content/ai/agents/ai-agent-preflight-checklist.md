---
title: "AI 에이전트 도입 전 확인할 7가지"
description: "AI 에이전트를 만들기 전에 업무 범위, 데이터, 권한, 승인, 위험, 평가, 비용을 점검하는 실무 기준을 정리합니다."
date: 2026-08-08
updated: 2026-08-08
publish: true
type: article
topics:
  - ai
  - manufacturing
tags:
  - ai/agents
  - ai/evaluation
  - format/checklist
aliases: []
related:
  - "[[ai/rag/rag-vs-agent-selection]]"
  - "[[projects/manufacturing-quality-ai-demo]]"
  - "[[source-notes/anthropic-effective-agents-web]]"
service_relevance:
  - development-process
source_urls:
  - "https://www.nist.gov/itl/ai-risk-management-framework"
  - "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf"
  - "https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/"
  - "https://www.anthropic.com/engineering/building-effective-agents"
  - "https://openai.github.io/openai-agents-python/human_in_the_loop/"
enableToc: true
---

> [!abstract] 이 글의 핵심
> 에이전트 도입은 모델을 고르는 일이 아니라 업무 경계와 책임을 설계하는 일입니다. 작은 반복 업무를 선택하고, 읽기 전용 데이터·제한된 도구·사람의 승인·재현 가능한 평가를 먼저 고정해야 합니다.

AI 에이전트라는 이름이 붙으면 곧바로 여러 시스템에 연결하고 자동 실행하고 싶어집니다. 그러나 동적으로 판단하고 도구를 호출하는 시스템은 일반적인 텍스트 생성보다 실패 지점이 많습니다. 이 글의 7가지는 특정 기관이 발표한 공식 목록이 아니라 NIST, OWASP, Anthropic, OpenAI의 자료를 읽고 moon's tech가 편집한 사전 점검 기준입니다.

## 1. 업무와 지표를 한 문장으로 고정했는가

“문의에 답한다”보다 “검사 기록에서 누락된 필드를 찾아 담당자에게 검토 목록을 만든다”처럼 입력과 출력이 분명해야 합니다. 사용자가 누구인지, 기존 방식의 어느 부분이 불편한지, 에이전트가 하지 말아야 할 일은 무엇인지도 적습니다.

지표는 모델의 자신감만으로 만들지 않습니다. 누락 발견 여부, 검토자가 다시 확인하는 시간, 잘못된 자동 실행의 빈도처럼 업무 결과와 위험을 함께 측정합니다. 기준선이 없는 상태에서 개선율을 약속하지 않습니다.

## 2. 데이터의 출처와 최신성을 설명할 수 있는가

에이전트가 읽는 문서와 레코드의 소유자, 변경 시점, 접근 권한, 보존 기간을 목록으로 만듭니다. 동일한 부품이라도 리비전과 상태가 다르면 서로 다른 근거일 수 있습니다. 검색 결과에는 문서 식별자와 버전을 함께 보여 주어야 합니다.

데이터가 오래되었거나 누락되었다면 모델의 응답을 개선하기 전에 데이터 흐름을 고쳐야 합니다. [[manufacturing/plm/plm-data-quality-checklist|PLM 데이터 품질 체크리스트]]가 이 점검을 시작하는 데 유용합니다.

## 3. 도구 권한을 최소화했는가

처음에는 파일 읽기, 검색, 계산처럼 되돌릴 수 있는 도구만 연결합니다. 쓰기·삭제·외부 전송은 별도 권한과 명시적인 승인 단계가 필요합니다. 도구마다 허용 입력, 대상 범위, 시간 제한, 실패 시 동작을 정의하고 호출 로그를 남깁니다.

권한을 “에이전트가 알아서 판단할 것”으로 두면 안 됩니다. 시스템 권한과 사용자의 업무 권한이 일치하는지, 프롬프트에 포함된 데이터가 다른 조직으로 넘어갈 수 있는지 확인합니다.

## 4. 사람이 언제 승인하고 중단하는가

사람 검토는 마지막에 형식적으로 붙이는 버튼이 아닙니다. 위험한 도구 호출 전, 근거가 부족한 응답, 규칙 위반, 예외 입력에서 어떤 사람이 무엇을 확인하는지 정합니다. 승인 화면에는 작업 대상, 사용한 근거, 예상 변경, 거부·수정 방법이 있어야 합니다.

승인자가 자리를 비웠을 때의 대체 경로와 에이전트를 즉시 중단하는 방법도 문서화합니다. [[source-notes/anthropic-effective-agents-youtube|에이전트 설계 Source Note]]의 요약처럼 초기 범위는 사람이 결과를 확인할 수 있는 업무가 적합합니다.

## 5. 보안 위험을 시나리오로 시험했는가

프롬프트 주입, 민감 정보 노출, 과도한 권한, 도구 결과의 변조, 반복 호출로 인한 비용 증가를 실제 입력 예제로 점검합니다. “악성 사용자가 없을 것”이라는 가정 대신 문서 안에 들어온 지시를 에이전트가 데이터와 혼동할 수 있는 상황을 만들어 봅니다.

OWASP의 Agentic AI 자료를 위협 목록의 출발점으로 사용할 수 있지만, 조직의 데이터와 권한 모델을 반영한 별도 검토가 필요합니다.

## 6. 평가와 로그를 재현할 수 있는가

대표 입력, 기대하는 근거, 허용 가능한 답변 범위를 작은 평가 세트로 고정합니다. 모델 버전, 프롬프트, 검색 설정, 도구 호출 순서, 최종 승인 결과를 함께 기록해야 문제가 생겼을 때 다시 실행할 수 있습니다.

평가에는 정확성만 넣지 않습니다. 근거 없는 주장, 민감 정보의 포함, 승인 없는 실행, 지연과 비용도 실패로 취급합니다. 새 버전은 이전 세트와 비교한 뒤 제한된 사용자에게 공개합니다.

## 7. 비용과 대체 경로를 준비했는가

모든 일을 에이전트로 처리할 필요는 없습니다. 정규식, SQL, 일반 검색, 고정된 배치 스크립트가 더 예측 가능한 경우가 많습니다. 토큰·도구 호출·사람 검토에 드는 비용을 업무 가치와 함께 비교하고, 서비스 중단이나 모델 오류 때 수동 절차로 돌아갈 수 있게 합니다.

## 실무 점검표

| 항목      | 확인 질문                                | 시작 증거             |
| --------- | ---------------------------------------- | --------------------- |
| 업무·지표 | 입력, 출력, 금지 범위가 한 문장인가      | 기준선과 예시 5건     |
| 데이터    | 출처·리비전·권한을 설명할 수 있는가      | 데이터 목록과 소유자  |
| 도구      | 읽기 전용부터 시작하는가                 | 권한 표와 호출 로그   |
| 사람      | 승인·거부·중단의 책임자가 있는가         | 승인 흐름도           |
| 보안      | 공격·오류 시나리오를 시험했는가          | 테스트 입력과 결과    |
| 평가·로그 | 같은 입력을 다시 평가할 수 있는가        | 버전 고정 평가 세트   |
| 비용·대체 | 수동 또는 단순 자동화로 돌아갈 수 있는가 | 중단 절차와 비용 가정 |

## 주의점과 한계

> [!warning] 적용 전 확인
> 아래 자료는 위험 관리와 에이전트 설계를 위한 공식 참고점이지, 특정 조직의 법률·보안·품질 승인 절차를 대신하지 않습니다. 실제 데이터와 권한을 사용하기 전에는 개인정보, 보안, 보존 기간, 계약 조건을 별도로 검토하세요.

## 정리

일곱 항목에 답할 수 없다면 모델 선택을 미루고 문제 범위와 데이터 흐름을 먼저 줄이세요. 반대로 업무가 작고, 근거를 확인할 수 있고, 사람이 승인하며, 실패 시 되돌릴 수 있다면 제한된 읽기 전용 파일럿을 시작할 수 있습니다. [[services/development-process|안전한 업무 자동화와 인수 가능한 도구]]는 이 점검을 실제 운영 흐름으로 연결할 때 참고할 수 있습니다.

## 출처

- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [NIST Generative AI Profile (AI 600-1)](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)
- [OWASP Agentic AI Threats and Mitigations](https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/)
- [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI Agents SDK — Human-in-the-loop](https://openai.github.io/openai-agents-python/human_in_the_loop/)
