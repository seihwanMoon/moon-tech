# moon's tech 프로젝트 Handoff

작성일: 2026-08-09  
인계 상태: 운영 가능, 미완료 작업 없음

## 1. 먼저 확인할 문서

후속 작업자는 아래 순서로 읽는다.

1. `HANDOFF.md`
2. `docs/project/confirmed-requirements.md`
3. `docs/project/development-summary.md`
4. `docs/project/operations.md`
5. `TASKLIST.md`
6. 변경 영역에 따라 `docs/verification/`과 Source Note 명세

## 2. 현재 서비스 상태

- 원본 Vault·Git 폴더: `G:\My Drive\Quartz5`
- 저장소: <https://github.com/seihwanMoon/moon-tech>
- 공개 사이트: <https://seihwanmoon.github.io/moon-tech/>
- 기본 브랜치: `main`
- 최신 배포 검증 커밋: `ce0fa79`
- 최신 확인 Actions: [31302364473](https://github.com/seihwanMoon/moon-tech/actions/runs/31302364473), success
- 공개 연락처: `skimooon@naver.com`
- 완료 목록: `TASKLIST.md` 전체 체크

최종 확인 시 홈, 대표 Source Note, RSS와 sitemap은 HTTP 200이었다. 실제 Chrome에서 데스크톱과 모바일 탐색, Source Note 오른쪽 레일, 스크롤 잠금과 가로 오버플로를 다시 확인했고 콘솔 오류는 없었다.

## 3. 작업 시작 전 안전 점검

```powershell
Set-Location 'G:\My Drive\Quartz5'
git status --short
git pull --ff-only
Test-Path .\node_modules
```

기대 결과:

- 작업 전 Git 상태가 깨끗하다.
- `main`이 `origin/main`과 일치한다.
- 루트 `node_modules`는 `False`다.

기존 변경이 있으면 소유자를 확인하기 전 덮어쓰거나 삭제하지 않는다. `git reset --hard`와 작업 폴더 전체 checkout은 운영 절차로 사용하지 않는다.

## 4. 로컬 개발 절차

의존성과 빌드 결과는 `%LOCALAPPDATA%\moon-tech-runtime`에 유지한다. 루트에서 직접 `npm install`하지 않는다.

```powershell
.\scripts\run-local.ps1 install
.\scripts\run-local.ps1 test
.\scripts\run-local.ps1 build
.\scripts\run-local.ps1 serve
```

- `install`: Vault 동기화, 필요 시 `npm ci`, Source Note 플러그인 패키지 검증
- `test`: Quartz·프로젝트 200개 테스트, 플러그인 15개 테스트, validator
- `build`: `public/` 214개 파일을 AppData 런타임에 생성
- `serve`: AppData 런타임의 로컬 사이트 실행

로컬 빌드의 `content` Git 저장소 탐색 경고는 실행 사본에 `.git`을 복사하지 않아서 발생하며 현재 결과에는 영향을 주지 않는다.

## 5. 새 콘텐츠 발행

1. `_templates/`에서 목적에 맞는 템플릿을 선택한다.
2. 비공개 폴더에서 초안을 작성하고 검토가 끝난 문서만 `content/`로 옮긴다.
3. frontmatter와 `publish: true`를 확인한다.
4. 내부 링크와 출처를 확인한다.
5. `run-local.ps1 test`와 `run-local.ps1 build`를 통과시킨다.
6. 공개 화면을 확인한 뒤 커밋하고 `main`에 푸시한다.

일반 글은 문제, 적용 조건, 실행 방법, 한계와 출처가 분명해야 한다. 실제 수행 경력이 아닌 프로젝트는 공개 예제임을 제목과 본문에서 명시한다.

## 6. Source Note 변경 절차

Source Note를 추가하거나 수정할 때 다음 계약을 유지한다.

- `type: source-note`, `publish: true`와 필수 출처 필드를 작성한다.
- 원문 주장과 작성자 해석을 별도 필드와 화면으로 구분한다.
- 라이선스와 이용 범위에 따라 요약, 짧은 인용 또는 링크만 사용한다.
- 출처 URL은 통합 출처 카드에서 한 번만 표시한다.
- `원문 보기` CTA를 다시 추가하지 않는다.
- 상세 callout은 5개이며 1~4번은 접힘, 5번 변경 기록은 펼침이다.
- 오른쪽 목차, Graph, Backlinks를 숨기지 않는다.

검증 명령:

```powershell
.\scripts\run-local.ps1 test
```

validator 규칙을 바꿀 때는 `scripts/source-note-schema.mjs`, CLI validator와 `plugins/source-note-brief/src/schema.ts`의 역할이 어긋나지 않는지 확인한다.

## 7. UI 계약

- 상단: `Home / News / Service / About / Contact`
- 왼쪽 로고: `Moon's Tech`
- Explorer: `Topic`, 루트 `News / Service / About / Contact`
- Service 하위: `제조 / AI / 프로젝트`
- 푸터: `© moon's tech. All rights reserved.`
- Source Note: 단일 읽기 열과 오른쪽 목차·그래프·백링크
- 모바일: 가로 오버플로 없음, Topic 메뉴가 열리면 배경 스크롤 잠금

변경 후 최소 390px, 768px, 1440px, 라이트·다크 모드와 대표 Source Note 인쇄를 확인한다.

## 8. 배포와 확인

`main` push가 `.github/workflows/deploy.yml`을 실행한다.

```powershell
git push
gh run list --repo seihwanMoon/moon-tech --workflow deploy.yml --limit 3
$runId = gh run list --repo seihwanMoon/moon-tech --workflow deploy.yml --limit 1 --json databaseId --jq '.[0].databaseId'
gh run watch $runId --repo seihwanMoon/moon-tech --exit-status
```

Actions 성공 후 다음 주소를 확인한다.

- <https://seihwanmoon.github.io/moon-tech/>
- <https://seihwanmoon.github.io/moon-tech/source-notes/anthropic-effective-agents-youtube>
- <https://seihwanmoon.github.io/moon-tech/index.xml>
- <https://seihwanmoon.github.io/moon-tech/sitemap.xml>

배포 완료는 build와 deploy 작업 성공, 네 주소의 HTTP 200, 홈과 대표 Source Note 실제 화면 확인을 모두 만족해야 한다.

## 9. 비공개 전환과 롤백

- 문서 비공개: `publish: false`로 변경하고 재배포한다.
- 조사 원본: `content/` 밖의 비공개 폴더로 옮긴다.
- 코드·설정 롤백: `git revert <문제-커밋>` 후 `main`에 푸시한다.
- 이미 Git 이력에 공개된 민감 정보는 단순 삭제로 제거되지 않으므로 저장소 관리자 판단 아래 별도 이력 정리를 수행한다.

## 10. 알려진 비차단 사항

- 로컬 런타임 빌드에서 `.git` 부재 경고가 한 줄 표시될 수 있다.
- 최초 Pages 실행은 사이트 활성화 전에 시작되어 한 번 실패했지만 설정 후 재실행으로 해결됐다.
- 루트 `node_modules`는 의도적으로 없으며 삭제하거나 다시 만들 필요가 없다.

## 11. 다음 작업 후보

현재 필수 미완료 작업은 없다. 다음 작업은 필요할 때 별도 tasklist와 검증 기준을 먼저 작성한다.

- 실제 신규 콘텐츠 발행 주기 운영
- Source Note 유형 또는 validator 규칙 확장
- 접근성 회귀 자동화 확대
- 검색·Graph 사용 데이터를 근거로 탐색 구조 개선

## 12. 인계 완료 기준

- 요구사항, 개발 기록, 운영 가이드와 handoff 문서가 저장소에 있다.
- 전체 Tasklist가 완료됐다.
- 로컬 테스트와 프로덕션 빌드가 통과했다.
- GitHub Actions와 Pages 실제 화면 검증이 완료됐다.
- 작업 폴더와 `origin/main`이 동기화돼 있다.
