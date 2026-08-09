# moon's tech 운영 가이드

최종 갱신: 2026-08-09

## 운영 경계

- Vault와 Git 작업 원본은 `G:\My Drive\Quartz5`다.
- 공개 후보는 `content/`뿐이며 모든 공개 문서는 `publish: true`여야 한다.
- `_inbox/`, `_sources/`, `_synthesis/`, `_templates/`, `_attachments-private/`는 비공개다.
- 루트에는 `node_modules/`, `.quartz/`, `public/`을 만들지 않는다.
- 실행 의존성과 빌드 결과는 `%LOCALAPPDATA%\moon-tech-runtime`에 둔다.

## 로컬 실행

```powershell
.\scripts\run-local.ps1 test
.\scripts\run-local.ps1 build
.\scripts\run-local.ps1 serve
```

검증 순서는 `test` 다음 `build`다. `serve`는 AppData 런타임의 결과를 사용한다.

## 새 글 발행

1. `_templates/`에서 문서 유형에 맞는 템플릿을 복사한다.
2. 초안은 비공개 폴더에서 작성하고 검토가 끝난 문서만 `content/`로 옮긴다.
3. 필수 frontmatter와 `publish: true`를 확인한다.
4. Source Note는 원문 주장, moon's tech 해석, 이용 범위와 위치 정보를 구분한다.
5. `run-local.ps1 test`와 `run-local.ps1 build`가 모두 성공한 뒤 커밋한다.

## 비공개 전환

긴급 비공개는 해당 문서의 `publish`를 `false`로 바꾼 뒤 재배포한다. 원문과 조사 자료는 `content/` 밖의 비공개 폴더로 이동한다. Git 기록에 이미 공개된 민감 정보는 단순 삭제만으로 제거되지 않으므로 저장소 관리자 판단 아래 별도 이력 정리가 필요하다.

## 배포

`main`에 푸시하면 `.github/workflows/deploy.yml`이 다음 순서로 실행된다.

1. 루트와 Source Note 플러그인 의존성 설치
2. 플러그인 패키지 빌드·검증
3. 타입·포맷·단위 테스트와 Source Note validator
4. Quartz 프로덕션 빌드
5. Pages artifact 업로드와 배포

배포 후 홈, Source Note, `index.xml`, `sitemap.xml`의 HTTP 200과 실제 화면을 확인한다.

## 롤백

1. 마지막 정상 커밋을 확인한다.
2. 공개 이력을 보존하는 `git revert <문제-커밋>`을 사용한다.
3. 되돌림 커밋을 `main`에 푸시한다.
4. Actions와 Pages 응답을 다시 확인한다.

작업 폴더 전체를 되돌리는 `git reset --hard`는 운영 절차로 사용하지 않는다.
