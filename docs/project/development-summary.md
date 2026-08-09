# moon's tech 개발 완료 기록

작성일: 2026-08-09  
상태: 구현, 검증, GitHub Pages 배포 완료

## 1. 개발 목표와 결과

`G:\My Drive\Quartz5`를 Quartz v5 프로젝트와 Obsidian Vault의 공용 루트로 구축했다. AI, 제조, 코딩 지식을 문제 중심으로 설명하는 개인 전문가 사이트를 완성하고 `seihwanMoon/moon-tech` 저장소와 GitHub Pages에 배포했다.

- 공개 사이트: <https://seihwanmoon.github.io/moon-tech/>
- GitHub 저장소: <https://github.com/seihwanMoon/moon-tech>
- 공개 연락처: `skimooon@naver.com`
- 구현 커밋: `6e124c7`
- 배포 검증 기록 커밋: `ce0fa79`
- 최종 확인 Actions: [31302364473](https://github.com/seihwanMoon/moon-tech/actions/runs/31302364473), success

## 2. 확정 제품 결정

- 브랜드 표기는 본문에서 `moon's tech`, 왼쪽 로고에서 `Moon's Tech`를 사용한다.
- 상단 탐색은 `Home / News / Service / About / Contact`다.
- `Service` 하위는 `제조 / AI / 프로젝트`다.
- 왼쪽 Explorer 제목은 `Topic`이며 루트는 `News / Service / About / Contact`다.
- `Source Notes`는 화면에서 `News`로 표시하지만 기존 `source-notes/...` URL은 유지한다.
- 푸터는 `© moon's tech. All rights reserved.` 한 줄만 표시한다.
- 청색과 청록색 중심의 라이트·다크 테마와 `Noto Sans KR`을 사용한다.
- 초기 완성형 공개 콘텐츠는 모두 `publish: true`다.

## 3. 프로젝트 구조

```text
G:\My Drive\Quartz5\                 Vault 원본과 Git 작업 폴더
├─ content\                           공개 후보 Markdown
├─ _inbox\, _sources\, _synthesis\  비공개 조사·검토 영역
├─ _templates\                        비공개 작성 템플릿
├─ plugins\source-note-brief\         Source Note 전용 Quartz 플러그인
├─ quartz\                            Quartz v5 소스와 moon's tech 컴포넌트
├─ scripts\                           로컬 런타임·검증 스크립트
├─ tests\                             프로젝트 계약 테스트
├─ docs\                              요구사항·설계·검증·운영 기록
└─ .github\workflows\deploy.yml       GitHub Pages CI/CD

%LOCALAPPDATA%\moon-tech-runtime\     의존성·캐시·빌드 결과용 실행 사본
```

Google Drive 원본에는 `node_modules/`, `.quartz/`, `public/`을 만들지 않는다. `scripts/run-local.ps1`이 원본을 AppData 런타임으로 동기화하고 그 위치에서 의존성 설치, 테스트, 빌드를 수행한다.

## 4. 구현 내용

### Quartz와 Vault 기반

- Quartz v5 프로젝트 파일과 Obsidian 설정을 현재 폴더에 통합했다.
- `locale: ko-KR`, Pages `baseUrl`, 한글 글꼴과 브랜드 색상을 설정했다.
- `@quartz-community/explicit-publish`로 `publish: true` 문서만 공개한다.
- 비공개 폴더와 런타임 산출물을 `.gitignore`와 테스트로 차단했다.
- 검색, Explorer, Graph, Backlinks, RSS, sitemap과 SPA 탐색을 유지했다.

### 공개 콘텐츠

- 공개 Markdown 22개를 작성했다.
- 홈, AI, 제조, 코딩, 프로젝트, 서비스, About, Contact 페이지를 구성했다.
- AI·제조·코딩 완성형 글 6개와 공개 예제 프로젝트 1개를 작성했다.
- 서비스 설명은 제품 목록보다 독자의 문제와 해결 과정에 초점을 맞췄다.
- YouTube, Threads, GitHub, Web 유형의 실제 Source Note 4개를 작성했다.

### Source Note 시스템

- `scripts/source-note-schema.mjs`에 frontmatter 정규화와 검증 규칙을 구현했다.
- `scripts/validate-source-notes.mjs`가 공개 Source Note의 필수 필드, URL, 날짜, 라이선스, 이용 범위, 목록 개수와 인용 위치를 검사한다.
- `plugins/source-note-brief`에 스키마, TSX 렌더러, 반응형·다크·인쇄 스타일과 패키지 검증을 구현했다.
- Source Note는 하나의 읽기 열에서 핵심 요약, 포인트, 주장과 해석, 다음 행동을 표시한다.
- 출처 정보는 본문 상세 영역 앞의 카드 하나로 통합했으며 `원문 보기` 버튼과 중복 출처 항목은 제거했다.
- 상세 내용은 callout 5개로 구성하고 1~4번은 접힘, `05. 변경 기록`은 펼침 상태로 시작한다.
- 일반 문서와 동일하게 오른쪽 목차, 그래프 뷰, 백링크를 표시한다.

### 브랜드 UI

- `MoonsTechHeader`, `MoonsTechExplorer`, `MoonsTechFooter`를 로컬 Quartz 컴포넌트로 등록했다.
- 데스크톱 탐색과 모바일 Topic 오버레이를 구현했다.
- 모바일 메뉴의 접근성 상태와 배경 스크롤 잠금을 적용했다.
- 390px, 768px, 1440px 화면, 라이트·다크 테마와 A4 인쇄 레이아웃을 구현했다.
- Source Note 기준 이미지와 실제 화면을 같은 크기로 비교하고 fidelity ledger를 남겼다.

### 테스트와 자동화

- Quartz 및 프로젝트 테스트: 200/200, 46 suites
- Source Note Brief 테스트: 15/15
- validator: Markdown 22개, Source Note 4개, 오류 0, 경고 0
- 프로덕션 빌드: 입력 22개, 출력 214개
- 실제 Chrome 검증: 홈, 일반 글, Source Note 4종, 모바일 메뉴, 검색, 테마, 인쇄
- 최종 Design QA: `passed`

## 5. 배포 구성

`.github/workflows/deploy.yml`은 `main` push에서 다음 순서로 동작한다.

1. 저장소 checkout과 Node.js 22 설정
2. 루트와 Source Note 플러그인 `npm ci`
3. 플러그인 패키지 빌드와 배포 파일 검증
4. Quartz 플러그인 설치
5. 타입, Prettier, 단위 테스트와 Source Note validator
6. Quartz 프로덕션 빌드
7. Pages artifact 업로드와 배포

Pages는 GitHub Actions workflow 방식과 HTTPS 강제를 사용한다. 최종 검증에서 홈, Source Note, `index.xml`, `sitemap.xml`이 모두 HTTP 200을 반환했다.

## 6. 주요 파일

| 목적                  | 파일                                                                                   |
| --------------------- | -------------------------------------------------------------------------------------- |
| 확정 요구사항         | `docs/project/confirmed-requirements.md`                                               |
| 구현 계획과 완료 이력 | `docs/superpowers/plans/2026-08-08-moons-tech-quartz-v5.md`                            |
| 전체 완료 목록        | `TASKLIST.md`                                                                          |
| 운영 방법             | `docs/project/operations.md`                                                           |
| 인수인계              | `HANDOFF.md`                                                                           |
| Quartz 설정           | `quartz.config.yaml`, `quartz.ts`                                                      |
| 전역 UI               | `quartz/components/MoonsTechHeader.tsx`, `MoonsTechExplorer.ts`, `MoonsTechFooter.tsx` |
| Source Note 플러그인  | `plugins/source-note-brief/`                                                           |
| Source Note validator | `scripts/source-note-schema.mjs`, `scripts/validate-source-notes.mjs`                  |
| 분리 런타임           | `scripts/run-local.ps1`                                                                |
| 자동 배포             | `.github/workflows/deploy.yml`                                                         |
| 자동 검증 기록        | `docs/verification/build-and-test.md`                                                  |
| 브라우저 검증 기록    | `docs/verification/browser-qa.md`                                                      |
| 시각 비교 기록        | `docs/verification/fidelity-ledger.md`, `design-qa.md`                                 |

## 7. 유지해야 할 경계

- 공개 파일은 반드시 `content/`와 `publish: true` 조건을 모두 만족해야 한다.
- 원문 전문, 전체 자막, 전체 Threads 캡처와 라이선스가 불명확한 자료는 공개 저장소에 복제하지 않는다.
- 비공개 원본 폴더와 루트 런타임 산출물을 Git에 추가하지 않는다.
- Source Note에서 원문의 주장과 moon's tech의 해석을 섞지 않는다.
- 배포 완료 판단은 Actions 성공만으로 끝내지 않고 공개 URL의 HTTP 응답과 실제 화면까지 확인한다.

## 8. 완료 상태

현재 구현 범위의 미완료 항목은 없다. 이후 변경은 새 콘텐츠 발행, 디자인 개선 또는 기능 확장으로 별도 계획을 세워 진행한다.
