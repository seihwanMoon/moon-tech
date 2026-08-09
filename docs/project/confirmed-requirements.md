# moon's tech Quartz v5 프로젝트 확정 요구사항

작성일: 2026-08-08  
최종 갱신: 2026-08-09  
상태: 구현, 로컬 검증 및 GitHub Pages 배포 검증 완료

## 1. 프로젝트 목표

현재 `Quartz5` 폴더를 Quartz v5 프로젝트이자 Obsidian Vault의 루트로 사용한다. AI·제조·코딩 지식을 수집, 검토, 합성, 공개하는 개인 전문가 사이트를 구축하고 GitHub Pages에 실제 배포한다.

## 2. 확정된 사용자 결정

- 공개 브랜드명: `moon's tech`
- 공개 소개: “AI·제조·코딩을 연결해 실무에 적용 가능한 시스템을 탐구하는 기술 전문가”
- 연락처: `skimooon@naver.com`
- 원격 저장소: `https://github.com/seihwanMoon/moon-tech`
- 기본 배포 주소: `https://seihwanMoon.github.io/moon-tech`
- 사용자 도메인은 1차 범위에서 제외한다.
- 별도 이미지 로고 없이 텍스트 워드마크를 사용한다.
- 청색·청록색 중심의 차분한 브랜드 테마와 `Noto Sans KR`을 사용한다.
- 콘텐츠와 서비스는 제품명이 아니라 독자의 문제를 중심으로 설명한다.
- 초기 완성형 콘텐츠는 모두 `publish: true`로 발행한다.
- 자체 콘텐츠 표기는 `© moon's tech. All rights reserved.`로 한다.
- 하위 에이전트 사용 시 `gpt-5.6-luna`, `xhigh` 추론을 사용한다.

## 3. 구축 범위

### 공개 페이지

1. 홈
2. AI 인덱스
3. 제조 인덱스
4. 코딩 인덱스
5. 프로젝트 인덱스
6. 서비스 인덱스
7. About
8. Contact

### 초기 완성형 글

- AI 에이전트 도입 전 확인할 7가지
- RAG와 AI 에이전트의 차이와 선택 기준
- PLM 데이터 품질을 개선하는 실무 체크리스트
- 스마트 제조에서 작은 자동화부터 시작하는 방법
- Python으로 반복 업무 자동화를 설계하는 방법
- 유지보수 가능한 사내 도구를 만드는 구조

### 프로젝트 사례

- “제조 품질 데이터를 분석하는 AI 보조 시스템 데모”를 실제 수행 경력으로 오인되지 않도록 공개 예제 프로젝트로 작성한다.

### Source Note

- YouTube, Threads, GitHub, Web Page 유형별 실제 공개 출처 1개씩 조사한다.
- 원문 메타데이터, 요약, 짧은 인용, 작성자 해석을 구분한다.
- 라이선스가 불명확하면 `summary-only` 또는 `link-only`만 사용한다.
- `type: source-note` 문서에만 A형 혼합 리서치 노트 화면을 적용한다.

## 4. 콘텐츠 안전 경계

- `_inbox/`, `_sources/`, `_synthesis/`, `_templates/`, `_attachments-private/`는 Git 및 Quartz 공개 대상에서 제외한다.
- Quartz는 `content/`만 공개 후보로 처리한다.
- `ExplicitPublish`를 사용하고 `publish: true`만 발행한다.
- 원문 전문, 전체 자막, 전체 Threads 캡처, 라이선스 불명확 코드와 이미지는 복제하지 않는다.
- 직접 인용은 필요한 최소 범위와 정확한 위치 정보만 사용한다.

## 5. 최종 화면 계약

- Quartz Explorer, 검색, Graph, Backlinks, 다크 모드는 전역에서 유지한다.
- Source Note도 일반 문서처럼 오른쪽 TOC·Graph·Backlinks를 표시한다.
- Source Note 핵심 화면은 별도 좌우 분할 없이 하나의 읽기 열을 사용한다.
- 출처 정보는 핵심 요약 뒤, 본문 상세 callout 앞의 하단 카드 하나로 통합한다.
- 출처 URL은 출처 정보 안에서 한 번만 표시하고 별도 `원문 보기` 버튼은 두지 않는다.
- 원문의 주장과 moon's tech의 해석을 명확히 구분한다.
- 상세 내용은 Obsidian foldable callout 5개로 구성한다.
- 1~4번은 기본 접힘, 5번 `변경 기록`은 기본 펼침이다.
- 모바일에서는 1단으로 전환하고 가로 스크롤이 없어야 한다.
- 인쇄 첫 페이지에는 핵심 요약과 출처를 유지하고 상세 내용은 모두 펼친다.

### 전역 탐색

- 상단: `Home`, `News`, `Service`, `About`, `Contact`
- 상단 `Service` 하위: `제조`, `AI`, `프로젝트`
- 왼쪽 브랜드: `Moon's Tech`
- 왼쪽 Explorer 제목: `Topic`
- 왼쪽 루트: `News`, `Service`, `About`, `Contact`
- 왼쪽 `Service` 하위: `제조`, `AI`, `프로젝트`
- `Source Notes`는 화면에서 `News`로 표시하되 기존 URL은 유지한다.
- 하단: `© moon's tech. All rights reserved.` 한 줄만 표시한다.

## 6. 자동 검증

- 공개 Source Note 필수 frontmatter 누락 시 빌드를 실패시킨다.
- URL, 날짜, 유형, 라이선스, 이용 범위, 핵심 포인트와 다음 행동 개수를 검증한다.
- `summary-and-short-quotation`에는 `source_locator`를 요구한다.
- 외부 링크 응답 실패와 180일 이상 지난 확인일은 경고로 처리한다.
- 단위 테스트, Quartz 프로덕션 빌드, 데스크톱·태블릿·모바일·인쇄 브라우저 검증을 수행한다.

## 7. 완료 조건

- 로컬 빌드와 모든 자동 검증이 성공한다.
- 일반 글 레이아웃 회귀가 없다.
- Source Note 4종이 전용 레이아웃으로 정상 렌더링된다.
- 한글 검색, Explorer, Graph, Backlinks, RSS, sitemap이 동작한다.
- GitHub Actions가 성공하고 GitHub Pages 공개 URL이 정상 응답한다.
- `TASKLIST.md`의 모든 항목이 증거와 함께 완료 처리된다.

## 8. 기준 문서

- `quartz-obsidian-implementation-guide.md`
- `quartz-a-hybrid-source-note-implementation-spec.md`

두 문서가 충돌할 경우 Source Note 세부 구현은 `quartz-a-hybrid-source-note-implementation-spec.md`를 우선한다.
