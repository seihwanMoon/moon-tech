---
title: "RAG와 AI 에이전트의 차이와 선택 기준"
description: "검색으로 근거를 찾는 RAG와 도구를 호출해 작업을 수행하는 에이전트를 문제의 불확실성과 권한으로 비교합니다."
date: 2026-08-08
updated: 2026-08-08
publish: true
type: article
topics:
  - ai
  - data
tags:
  - ai/rag
  - ai/agents
  - ai/architecture
aliases: []
related:
  - "[[ai/agents/ai-agent-preflight-checklist]]"
  - "[[source-notes/anthropic-effective-agents-web]]"
  - "[[projects/manufacturing-quality-ai-demo]]"
service_relevance:
  - development-process
source_urls:
  - "https://papers.neurips.cc/paper_files/paper/2020/hash/6b493230205f780e1bc26945df7481e5-Abstract.html"
  - "https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/secure-multitenant-rag"
  - "https://learn.microsoft.com/en-us/azure/developer/ai/advanced-retrieval-augmented-generation"
  - "https://www.anthropic.com/engineering/building-effective-agents"
  - "https://openai.github.io/openai-agents-python/agents/"
enableToc: true
---

> [!abstract] 이 글의 핵심
> RAG는 질문과 관련된 외부 근거를 찾아 생성에 제공하는 패턴이고, 에이전트는 목표를 향해 판단과 도구 실행을 반복하는 시스템입니다. 문서에서 근거를 찾는 문제가 중심이면 RAG부터, 여러 단계의 작업과 권한 조정이 필요하면 제한된 에이전트를 검토합니다.

둘은 경쟁 제품이 아닙니다. 에이전트가 검색 도구로 RAG를 호출할 수도 있고, RAG 응답을 사람이 확인하는 단순한 화면으로 끝낼 수도 있습니다. 중요한 선택은 이름이 아니라 “어디에서 불확실성이 생기며 어떤 행동 권한이 필요한가”입니다.

## RAG는 근거를 찾고 연결하는 구조

Retrieval-Augmented Generation 논문은 생성 모델의 지식만 사용하지 않고 외부 문서를 검색해 응답 생성에 활용하는 접근을 설명합니다. 실무에서 핵심은 임베딩보다 문서 분할, 메타데이터, 권한 필터, 최신성, 검색 결과의 인용입니다.

제조 문서를 예로 들면 제품 ID, 리비전, 유효 상태, 문서 소유자를 검색 메타데이터로 보존해야 합니다. 서로 다른 고객 공간의 문서가 섞이지 않도록 테넌트 경계를 검색 단계에서부터 적용합니다. 검색 결과가 없거나 상충하면 답을 만들기보다 “근거 부족”을 반환하는 정책이 필요합니다.

## 에이전트는 작업 흐름을 조정한다

에이전트는 목표를 작은 단계로 나누고, 관찰 결과에 따라 다음 도구를 선택하며, 상태를 유지하거나 사람의 결정을 요청할 수 있습니다. 예를 들어 검사 기록의 누락을 찾고, 관련 리비전 문서를 검색하고, 담당자에게 검토 목록을 만드는 흐름은 검색만으로 끝나지 않습니다.

그만큼 실패 표면도 넓습니다. 잘못된 도구 호출, 무한 반복, 과도한 권한, 근거 없는 다음 단계가 생길 수 있습니다. 도구의 입력·출력 계약과 실행 제한, 승인 지점, 중단 절차를 먼저 고정해야 합니다.

## 선택을 위한 다섯 질문

### 질문 1. 결과가 문서 답변인가, 상태 변경인가

문서에서 답을 찾고 출처를 보여 주는 것이 목적이면 RAG가 단순하고 예측 가능합니다. 시스템에 값을 쓰거나 티켓을 생성하거나 여러 담당자에게 요청을 보내야 한다면 에이전트의 실행 흐름을 검토하되 쓰기 권한은 뒤로 미룹니다.

### 질문 2. 단계가 고정되어 있는가

입력 형식과 절차가 고정되면 일반 코드나 워크플로 엔진이 더 읽기 쉽습니다. 사용자가 말한 목표와 데이터 상태에 따라 다음 행동이 달라지고, 사람이 예외를 승인해야 한다면 제한된 에이전트가 유용할 수 있습니다.

### 질문 3. 근거와 권한을 분리할 수 있는가

RAG에서는 검색 결과에 권한·테넌트·리비전을 붙이고, 에이전트에서는 각 도구 호출에도 같은 검사를 반복해야 합니다. “검색은 안전하니 요약도 안전하다” 또는 “사용자가 요청했으니 실행해도 된다”는 가정은 금물입니다.

### 질문 4. 실패 시 원래 흐름으로 돌아갈 수 있는가

RAG의 오답은 사람이 근거를 확인해 수정할 수 있어야 합니다. 에이전트가 상태를 바꾼다면 멱등성, 롤백, 승인 전 미리보기, 부분 실패 처리까지 필요합니다.

### 질문 5. 무엇을 평가할 것인가

RAG는 검색 재현율, 근거의 적합성, 인용 정확성, 최신성, 거부 응답을 평가합니다. 에이전트는 여기에 도구 선택, 단계 순서, 승인 누락, 불필요한 반복, 비용, 지연, 최종 상태를 더합니다.

## 한눈에 비교

| 질문      | RAG                      | AI 에이전트                 |
| --------- | ------------------------ | --------------------------- |
| 중심 문제 | 외부 근거를 찾아 응답    | 목표를 단계로 수행          |
| 주요 구성 | 검색·권한 필터·생성·인용 | 계획·도구·상태·승인         |
| 기본 권한 | 읽기 중심                | 읽기에서 제한적 쓰기로 확장 |
| 첫 파일럿 | 문서 질문과 근거 표시    | 검토 가능한 반복 작업       |
| 주요 실패 | 누락·오래된·잘못된 문서  | 잘못된 실행·반복·권한 초과  |

## 실무 적용 순서

먼저 [[ai/agents/ai-agent-preflight-checklist|에이전트 도입 전 7가지]]를 사용해 업무 경계와 위험을 적습니다. 문서 검색만으로 문제의 상당 부분을 해결할 수 있다면 RAG를 먼저 만들고, 응답에 항상 출처와 리비전을 넣습니다. RAG 응답을 사람이 검토한 뒤 다음 시스템에 복사하는 흐름이 반복될 때, 그 중 일부를 명시적인 도구와 승인으로 감싼 에이전트를 실험합니다.

이때 에이전트가 RAG 결과를 신뢰한다고 가정하지 말고, 검색 결과가 비어 있거나 충돌하는 경우를 별도 상태로 처리합니다. [[projects/manufacturing-quality-ai-demo|제조 품질 데이터 데모]]처럼 AI는 요약과 후보 표시까지만 담당하고 최종 판정은 사람에게 두는 경계가 안전한 시작점입니다.

## 주의점과 한계

> [!warning] 적용 전 확인
> RAG와 에이전트 어느 쪽도 정확성·최신성·사람 대체를 자동 보장하지 않습니다. 데이터 소유권, 개인정보, 다중 테넌트 권한, 모델·검색 설정의 버전, 비용과 서비스 중단 시 대체 절차를 별도로 검토하세요.

## 정리

근거가 필요한 질문에는 먼저 검색과 출처 표시를 설계하고, 작업의 상태와 권한을 조정해야 할 때만 에이전트를 추가합니다. 복잡한 이름보다 되돌릴 수 있는 범위와 평가 가능한 실패를 선택하는 것이 좋은 아키텍처 기준입니다. 관련 문제를 작은 파일럿으로 구조화하려면 [[services/development-process|안전한 업무 자동화와 인수 가능한 도구]]를 참고할 수 있습니다.

## 출처

- [Lewis et al. — Retrieval-Augmented Generation](https://papers.neurips.cc/paper_files/paper/2020/hash/6b493230205f780e1bc26945df7481e5-Abstract.html)
- [Microsoft Azure — Secure multitenant RAG](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/secure-multitenant-rag)
- [Microsoft Azure — Advanced RAG](https://learn.microsoft.com/en-us/azure/developer/ai/advanced-retrieval-augmented-generation)
- [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI Agents SDK — Agents](https://openai.github.io/openai-agents-python/agents/)
