# moon's tech 초기 콘텐츠 공식 근거

조사일: 2026-08-08

이 문서는 초기 공개 글과 데모 프로젝트에서 사용할 1차 출처 목록이다. 기술 주장에는 공식 문서, 표준 발행기관, 원 논문을 우선 사용한다.

## AI 에이전트 도입 전 확인할 7가지

- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [NIST Generative AI Profile, NIST AI 600-1](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)
- [OWASP Agentic AI Threats and Mitigations](https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/)
- [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI Agents SDK — Human-in-the-loop](https://openai.github.io/openai-agents-python/human_in_the_loop/)

편집 체크 항목은 업무·지표, 데이터, 도구 권한, 사람 승인, 보안 위험, 평가·로그, 비용·대체 경로다. 이는 특정 기관의 공식 “7가지”가 아니라 여러 공식 자료를 종합한 moon's tech의 편집 기준임을 명시한다.

## RAG와 AI 에이전트의 차이와 선택 기준

- [Lewis et al. — Retrieval-Augmented Generation](https://papers.neurips.cc/paper_files/paper/2020/hash/6b493230205f780e1bc26945df7481e5-Abstract.html)
- [Microsoft Azure — Secure multitenant RAG](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/secure-multitenant-rag)
- [Microsoft Azure — Advanced RAG](https://learn.microsoft.com/en-us/azure/developer/ai/advanced-retrieval-augmented-generation)
- [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI Agents SDK — Agents](https://openai.github.io/openai-agents-python/agents/)

RAG는 검색과 근거 제공, agent는 동적 판단과 도구 실행이 중심이라는 실용적 구분을 사용한다. 두 방식이 정확성을 자동 보장하거나 사람을 완전히 대체한다고 쓰지 않는다.

## PLM 데이터 품질 실무 체크리스트

- [ISO/IEC 25012 Data Quality Model](https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/03/57/35736.html)
- [ISO/TS 8000-82 Creating Data Rules](https://www.iso.org/standard/78707.html)
- [NIST — Contextualizing Manufacturing Data for Lifecycle Decision Making](https://www.nist.gov/publications/contextualizing-manufacturing-data-lifecycle-decision-making)
- [ISO 23952 Quality Information Framework](https://committee.iso.org/standard/77461.html)
- [W3C PROV Overview](https://www.w3.org/TR/prov-overview/)

식별자, 리비전·상태, 단위·시간, 데이터 규칙, 설계·공정·검사 연결, 중복·고아 레코드, lineage, 승인 이력을 확인한다. ISO 인증 체크리스트라고 주장하지 않는다.

## 스마트 제조에서 작은 자동화부터 시작하는 방법

- [ISO 22400-1 Manufacturing KPI Framework](https://www.iso.org/standard/56847.html)
- [NIST Smart Manufacturing Systems Test Bed](https://www.nist.gov/laboratories/tools-instruments/smart-manufacturing-systems-sms-test-bed)
- [NIST AMS 200-2](https://www.nist.gov/publications/connecting-deploying-and-using-smart-manufacturing-systems-test-bed)
- [NIST Smart Manufacturing Program](https://www.nist.gov/smart-manufacturing)
- [NIST 2026 Roadmap on AI/ML for Smart Manufacturing](https://www.nist.gov/publications/2026-roadmap-artificial-intelligence-and-machine-learning-smart-manufacturing)

한 공정·한 담당자·한 출력물, 기준 KPI, 읽기 전용 수집, 제한된 파일럿, 사람 검토 후 쓰기 자동화 순서를 제안한다. 즉시 생산성 향상이나 비용 절감을 보장하지 않는다.

## Python 반복 업무 자동화 설계

- [Python argparse](https://docs.python.org/3/library/argparse.html)
- [Python pathlib](https://docs.python.org/3/library/pathlib.html)
- [Python subprocess](https://docs.python.org/3/library/subprocess.html)
- [Python logging](https://docs.python.org/3/library/logging.html)
- [Python unittest](https://docs.python.org/3/library/unittest.html)

입출력 명시, dry-run, 작은 함수, 실행 로그, 안전한 외부 명령, 재실행 가능성, 종료 코드 구분을 핵심으로 삼는다. 최신 Python 문서의 신규 기능은 지원 버전을 확인한 뒤 사용한다.

## 유지보수 가능한 사내 도구 구조

- [The Twelve-Factor App](https://www.12factor.net/)
- [PyPA pyproject.toml specification](https://packaging.python.org/specifications/declaring-project-metadata/)
- [Python logging](https://docs.python.org/3/library/logging.html)
- [Python unittest](https://docs.python.org/3/library/unittest.html)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)

업무 규칙과 외부 연결 분리, 설정·자격증명 분리, 테스트·로그·릴리스 절차, 입력 검증과 권한 관리를 강조한다. Twelve-Factor와 ASVS를 모든 내부 도구에 그대로 강제하지 않는다.

## 공개 데모 프로젝트

- [ISO 23952 QIF](https://committee.iso.org/standard/77461.html)
- [MTConnect Getting Started](https://www.mtconnect.org/getting-started/)
- [ISO 22400-1 KPI Framework](https://www.iso.org/standard/56847.html)
- [NIST Industrial AI Management and Metrology](https://www.nist.gov/programs-projects/industrial-artificial-intelligence-management-and-metrology-iaimm)
- [NIST Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)

모든 데이터는 합성·가상 데이터로 표시한다. 실제 고객, 생산라인, 개선율, 표준 적합성, 인증, 현장 정확도를 주장하지 않는다. AI는 기록 요약과 이상 후보 표시를 담당하고 최종 판정은 사람에게 둔다.

## 문제 중심 서비스

- 데이터 규칙과 lineage가 필요한 팀
- 반복 파일·엑셀 업무를 안전하게 자동화하려는 팀
- 문서·PLM 자료에서 근거를 찾기 어려운 팀
- 데모 이후 운영·인수인계가 불안한 팀
- 제조 데이터를 어디서부터 연결할지 모르는 팀

수치 성과와 SLA는 실제 측정 또는 계약 범위가 없으면 약속하지 않는다.

## Source Note 후보 4종

| 유형    | 출처                                                                                                     | 게시일     | 라이선스            | 사용         |
| ------- | -------------------------------------------------------------------------------------------------------- | ---------- | ------------------- | ------------ |
| YouTube | [Anthropic — Building more effective AI agents](https://www.youtube.com/watch?v=uhJJgc-0iTQ)             | 2025-10-17 | all-rights-reserved | summary-only |
| Threads | [Ethan Mollick 게시물](https://www.threads.com/@ethan_mollick/post/C46AfItO8RS)                          | 2024-03-24 | all-rights-reserved | summary-only |
| GitHub  | [Microsoft Agent Framework](https://github.com/microsoft/agent-framework)                                | 2025-04-28 | MIT                 | summary-only |
| Web     | [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) | 2024-12-19 | all-rights-reserved | summary-only |

네 자료 모두 전문, 전체 자막, 스크린샷, 긴 직접 인용을 복제하지 않는다. GitHub 저장소 코드를 재사용할 경우에만 별도 고지와 MIT 라이선스 보존을 검토한다.
