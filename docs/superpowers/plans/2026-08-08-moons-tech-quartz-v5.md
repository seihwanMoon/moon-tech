# moon's tech Quartz v5 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 현재 폴더를 Obsidian 편집, Quartz v5 정적 생성, 실제 출처 기반 Source Note, 완성형 한국어 콘텐츠, GitHub Pages 배포가 가능한 `moon's tech` 사이트로 구축한다.

**Architecture:** Quartz v5 공식 템플릿을 기반으로 `content/`만 공개하고, 비공개 연구 폴더는 Git과 빌드에서 제외한다. `type: source-note`는 frontmatter를 검증하는 독립 모듈과 빌드 전 validator, 전용 `SourceNoteBrief` 컴포넌트, 조건부 레이아웃을 통해 일반 글과 분리한다.

**Tech Stack:** Node.js 22, npm, Quartz v5, TypeScript/TSX, SCSS, Obsidian Flavored Markdown, YAML, Node test runner 또는 Vitest, Playwright, GitHub Actions, GitHub Pages

---

### Task 1: 프로젝트 기반과 안전 경계

**Files:**

- Create/merge: Quartz v5 공식 템플릿 파일
- Modify: `.gitignore`
- Create: `.obsidian/app.json`, `.obsidian/core-plugins.json`
- Create: `_inbox/.gitkeep`, `_sources/*/.gitkeep`, `_synthesis/.gitkeep`, `_attachments-private/.gitkeep`

- [x] **Step 1: 공식 Quartz v5 템플릿을 현재 폴더에 병합한다.**

```powershell
git clone --depth 1 --branch v5 https://github.com/jackyzha0/quartz.git "G:\My Drive\Quartz5\.tmp-quartz-v5"
robocopy "G:\My Drive\Quartz5\.tmp-quartz-v5" "G:\My Drive\Quartz5" /E /XD .git content docs
npm ci
```

- [x] **Step 2: 공개와 비공개 경계를 설정한다.**

`.gitignore`에 다음 패턴을 추가한다.

```gitignore
_inbox/
_sources/
_synthesis/
_templates/
_attachments-private/
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.obsidian/cache/
public/
.quartz/cache/
```

- [x] **Step 3: 초기 빌드가 성공하는지 확인한다.**

```powershell
npx quartz plugin install --from-config
npx quartz build
```

Expected: 종료 코드 0, `public/index.html` 생성.

### Task 2: Quartz 설정과 Obsidian Vault

**Files:**

- Modify: `quartz.config.yaml`
- Modify: `quartz.ts`
- Create: `.obsidian/app.json`, `.obsidian/core-plugins.json`
- Modify: `package.json`

- [x] **Step 1: `ko-KR`, `seihwanMoon.github.io/moon-tech`, `ExplicitPublish`를 설정한다.**

```yaml
configuration:
  pageTitle: "moon's tech"
  pageTitleSuffix: " | moon's tech"
  locale: ko-KR
  baseUrl: "seihwanMoon.github.io/moon-tech"
```

- [x] **Step 2: 검증과 빌드 명령을 고정한다.**

```json
{
  "scripts": {
    "test": "node --test tests/**/*.test.mjs",
    "validate:sources": "node scripts/validate-source-notes.mjs",
    "build:verified": "npm run test && npm run validate:sources && npx quartz build"
  }
}
```

- [x] **Step 3: `npm run build:verified`가 통과하도록 설정 병합 오류를 해결한다.**

### Task 3: 템플릿과 공개 콘텐츠 구조

**Files:**

- Create: `_templates/source-youtube.md`, `_templates/source-thread.md`, `_templates/source-github.md`, `_templates/source-web.md`, `_templates/synthesis.md`, `_templates/article.md`, `_templates/public-source-note.md`
- Create: `content/index.md`, `content/{ai,manufacturing,coding,projects,services,source-notes}/index.md`
- Create: `content/about.md`, `content/contact.md`

- [x] **Step 1: 기준 문서의 7개 템플릿을 생성한다.**
- [x] **Step 2: 모든 공개 페이지에 `publish: true`, 설명, 날짜, 유형을 작성한다.**
- [x] **Step 3: 내부 링크로 홈, 주제, 프로젝트, 서비스, Source Notes를 연결한다.**
- [x] **Step 4: Quartz 빌드 후 8개 필수 페이지의 HTML 생성을 확인한다.**

### Task 4: 완성형 글과 예제 프로젝트

**Files:**

- Create: `content/ai/*.md` 2개
- Create: `content/manufacturing/*.md` 2개
- Create: `content/coding/*.md` 2개
- Create: `content/projects/case-studies/manufacturing-quality-ai-assistant-demo.md`
- Create: `content/services/*.md` 2개

- [x] **Step 1: 각 글을 문제, 개념, 적용 방법, 확인 범위, 한계, 출처 구조로 작성한다.**
- [x] **Step 2: 변동 가능성이 있는 기술 주장은 공식 문서로 검증하고 출처 URL을 기록한다.**
- [x] **Step 3: 프로젝트는 공개 데모임을 제목과 본문에 명시하고 실제 수행 경력을 주장하지 않는다.**
- [x] **Step 4: 깨진 내부 링크와 빈 섹션이 없는지 검사한다.**

### Task 5: Source Note validator를 TDD로 구현

**Files:**

- Create: `scripts/source-note-schema.mjs`
- Create: `scripts/validate-source-notes.mjs`
- Create: `tests/source-note-validator.test.mjs`

- [x] **Step 1: 필수 필드 누락 공개 문서가 실패하는 테스트를 작성한다.**

```javascript
test("published source note rejects missing source_url", () => {
  const errors = validateSourceNote({ type: "source-note", publish: true })
  assert.ok(errors.some((error) => error.field === "source_url"))
})
```

- [x] **Step 2: 테스트가 `validateSourceNote is not defined`로 실패하는지 확인한다.**

```powershell
node --test tests/source-note-validator.test.mjs
```

- [x] **Step 3: 허용값, URL, 날짜, 목록 개수와 조건부 필드를 검증하는 최소 구현을 작성한다.**
- [x] **Step 4: 정상, 누락, 잘못된 URL, 라이선스, 직접 인용 위치 테스트를 통과시킨다.**
- [x] **Step 5: `content/**/*.md`를 읽어 공개 오류는 종료 코드 1, 초안 경고는 종료 코드 0으로 출력한다.**

### Task 6: 실제 Source Note 4종 작성

**Files:**

- Create: `content/source-notes/youtube/*.md`
- Create: `content/source-notes/threads/*.md`
- Create: `content/source-notes/github/*.md`
- Create: `content/source-notes/web/*.md`

- [x] **Step 1: 각 유형의 실제 공개 원문과 공식 메타데이터를 조사한다.**
- [x] **Step 2: 라이선스와 허용 범위에 맞춰 요약·짧은 인용·링크만 작성한다.**
- [x] **Step 3: 5개 foldable callout과 실제 관련 글 위키링크를 작성한다.**
- [x] **Step 4: `npm run validate:sources`가 4개 노트를 모두 통과하는지 확인한다.**

### Task 7: SourceNoteBrief 플러그인을 TDD로 구현

**Files:**

- Create: `plugins/source-note-brief/package.json`, `tsconfig.json`, `tsup.config.ts`
- Create: `plugins/source-note-brief/src/schema.ts`, `index.tsx`, `styles.scss`
- Create: `plugins/source-note-brief/src/schema.test.ts`, `index.test.tsx`
- Modify: `quartz.config.yaml`, `quartz.lock.json`, `quartz.ts`

- [x] **Step 1: 각 source 유형, 누락 필드, 안전한 URL 정규화 테스트를 먼저 작성하고 실패를 확인한다.**
- [x] **Step 2: `parseSourceNote`의 최소 구현으로 테스트를 통과시킨다.**
- [x] **Step 3: 핵심 요약, 출처 메타, 주장·해석, 다음 행동, 원문 링크 렌더링 테스트를 먼저 작성한다.**
- [x] **Step 4: SourceNoteBrief TSX와 유형별 스타일을 구현해 테스트를 통과시킨다.**
- [x] **Step 5: `type: source-note`에만 전용 컴포넌트와 조건부 사이드바가 적용되도록 v5 레이아웃에 통합한다.**
- [x] **Step 6: 일반 article과 Source Note 빌드 결과를 비교한다.**

### Task 8: 브랜드 디자인과 반응형 화면

**Files:**

- Create: `docs/design/moons-tech-concept.png`
- Create: `docs/design/design-system.md`
- Modify: `quartz/styles/custom.scss`
- Modify: `plugins/source-note-brief/src/styles.scss`

- [x] **Step 1: 홈과 Source Note 핵심 화면의 기준 디자인 이미지를 생성한다.**
- [x] **Step 2: 색상, 글꼴, 간격, 컨테이너, 링크·버튼·callout 토큰을 문서화한다.**
- [x] **Step 3: 홈·프로젝트·서비스·Source Note 화면을 동일한 디자인 시스템으로 구현한다.**
- [x] **Step 4: 390px, 768px, 1440px와 라이트·다크·인쇄 CSS를 구현한다.**

### Task 9: 자동·브라우저·시각 검증

**Files:**

- Create: `tests/browser/site.spec.ts`
- Create: `docs/verification/fidelity-ledger.md`

- [x] **Step 1: 단위 테스트, validator, Quartz 프로덕션 빌드를 실행한다.**

```powershell
npm run build:verified
```

- [x] **Step 2: Playwright로 홈, 일반 글, Source Note 4종, 폴더 index를 검사한다.**
- [x] **Step 3: 접기 기본 상태, 검색, 내부 링크, 모바일 오버플로, 외부 링크 속성을 검사한다.**
- [x] **Step 4: 1440px와 390px 스크린샷 및 인쇄 PDF를 확인한다.**
- [x] **Step 5: 기준 디자인과 실제 스크린샷을 `view_image`로 비교하고 최소 5개 비교점을 ledger에 기록한다.**

### Task 10: GitHub Pages 배포와 종료

**Files:**

- Create/Modify: `.github/workflows/deploy.yml`
- Modify: `TASKLIST.md`
- Create: `docs/project/operations.md`

- [x] **Step 1: CI에서 `npm ci`, 플러그인 설치, 테스트, validator, Quartz 빌드, Pages 업로드를 수행한다.**
- [x] **Step 2: 현재 폴더를 Git 저장소로 초기화하고 `origin`을 연결해 전체 변경을 커밋한다.**
- [x] **Step 3: `main` 브랜치를 푸시하고 Pages source를 GitHub Actions로 설정한다.**
- [x] **Step 4: Actions 종료 코드 0과 배포 URL HTTP 200을 확인한다.**
- [x] **Step 5: 운영 명령, 새 글 발행 방법, 롤백·비공개 전환 방법을 문서화한다.**
- [x] **Step 6: 모든 Tasklist 항목과 `/goal`을 실제 증거가 있을 때만 완료 처리한다.**
