# moon's tech

`moon's tech`는 AI·제조·코딩을 연결해 실무에 적용 가능한 시스템을 탐구하는 개인 지식 사이트입니다. Quartz v5와 Obsidian Vault를 한 저장소에서 함께 운영하고, `content/`만 공개 후보로 취급합니다.

- 저장소: <https://github.com/seihwanMoon/moon-tech>
- 공개 사이트: <https://seihwanMoon.github.io/moon-tech>
- 문의: `skimooon@naver.com`

## 프로젝트 문서

- [Handoff](HANDOFF.md)
- [개발 완료 기록](docs/project/development-summary.md)
- [확정 요구사항](docs/project/confirmed-requirements.md)
- [운영 가이드](docs/project/operations.md)
- [검증 기록](docs/verification/build-and-test.md)
- [전체 Tasklist](TASKLIST.md)

## Vault 원본과 로컬 런타임

Google Drive의 `G:\My Drive\Quartz5`가 Vault 원본이자 Git 작업 폴더입니다. 원본에는 Markdown, 설정, 템플릿, 비공개 조사 자료가 있으므로 `node_modules/`, Quartz 캐시, 생성된 `public/`을 저장하지 않습니다.

개발 실행 파일과 생성물은 Google Drive 밖의 Windows AppData에 둡니다.

```text
G:\My Drive\Quartz5                         # Vault 원본·Git 작업 폴더
%LOCALAPPDATA%\moon-tech-runtime\           # 동기화된 로컬 실행 사본
%LOCALAPPDATA%\moon-tech-runtime\node_modules\
%LOCALAPPDATA%\moon-tech-runtime\plugins\source-note-brief\node_modules\
%LOCALAPPDATA%\moon-tech-runtime\.quartz\  # Quartz 플러그인 캐시
%LOCALAPPDATA%\moon-tech-runtime\public\   # 로컬 빌드 결과
%LOCALAPPDATA%\moon-tech-npm-cache\         # npm 캐시
```

`run-local.ps1`은 실행할 때마다 Vault 파일을 로컬 런타임으로 동기화합니다. `node_modules`, `.quartz`, `public`은 동기화에서 제외되며, 의존성은 `package-lock.json`과 플러그인 lock의 해시가 바뀔 때만 `npm ci`로 다시 설치합니다. Source Note Brief는 매 실행마다 빌드와 패키지 검증을 수행합니다.

## 실행 명령

PowerShell에서 Vault 원본의 다음 명령을 사용합니다.

```powershell
.\scripts\run-local.ps1 sync     # 파일 동기화만
.\scripts\run-local.ps1 install  # 루트·플러그인 npm ci, 플러그인 빌드/검증, Quartz 플러그인 설치
.\scripts\run-local.ps1 plugins  # 위 준비 후 설정된 Quartz 플러그인 설치 확인
.\scripts\run-local.ps1 test     # Quartz 테스트, Source Note 테스트, Source Note validator
.\scripts\run-local.ps1 build    # 검증된 로컬 런타임에서 public/ 생성
.\scripts\run-local.ps1 serve    # 로컬 개발 서버
```

스크립트가 관리하는 런타임에서는 `npm` 명령을 직접 실행하지 않습니다. 꼭 직접 실행해야 한다면 먼저 다음처럼 AppData 런타임으로 이동합니다.

```powershell
Push-Location "$env:LOCALAPPDATA\moon-tech-runtime"
npm ci
npm test
npm run build
npm run serve
Pop-Location
```

루트 `package.json`의 `build`, `serve`, `plugin-install`은 저장소에 설치된 Quartz CLI와 npm 스크립트 PATH의 로컬 바이너리만 사용합니다. 운영 명령에서는 `npx`를 사용하지 않습니다.

## 원본·공개 경계

- `_inbox/`, `_sources/`, `_synthesis/`, `_templates/`, `_attachments-private/`는 개인 원본과 검토 자료이며 GitHub Pages에 공개하지 않습니다.
- `content/`의 문서만 `publish: true`일 때 공개합니다. 원문 전문과 라이선스가 불명확한 자료를 복제하지 않습니다.
- 로컬 `public/`은 재생성 가능한 산출물입니다. 원본 Vault와 Git에는 넣지 않고 Actions가 빌드 후 Pages artifact로 업로드합니다.

## 검증과 배포

권장 순서는 `test` → `build`입니다. `test`는 Quartz/validator 테스트, `plugins/source-note-brief` 테스트, 공개 Source Note frontmatter 검증을 실행합니다. `build`는 Source Note Brief `npm ci`·빌드·`verify:package`를 통과한 뒤 설정된 Quartz 플러그인을 설치하고 `public/`을 생성합니다.

GitHub Actions의 [deploy.yml](.github/workflows/deploy.yml)은 Ubuntu에서 루트와 Source Note Brief에 각각 `npm ci`를 수행하고, 플러그인 빌드·검증, Quartz 플러그인 설치, 전체 테스트와 Source Note validator를 거친 뒤 Pages artifact를 배포합니다. 기본 Pages 주소는 <https://seihwanMoon.github.io/moon-tech>입니다.

## 기술 요구사항

- Node.js: `.node-version`의 22.x
- npm: `package.json`의 `engines` 조건(10.9.2 이상)
- Windows PowerShell: `scripts/run-local.ps1`
