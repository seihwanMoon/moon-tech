# 빌드 및 자동 검증 기록

검증일: 2026-08-09  
환경: Windows, Node.js 22, AppData 분리 런타임

## 결과

| 검증                     | 결과                                           |
| ------------------------ | ---------------------------------------------- |
| Quartz 및 저장소 테스트  | 200/200 통과, 46 suites                        |
| Source Note Brief 테스트 | 15/15 통과                                     |
| Source Note validator    | Markdown 22개, Source Note 4개, 오류 0, 경고 0 |
| Quartz 프로덕션 빌드     | 입력 22개, 출력 214개, 종료 코드 0             |
| 루트 `node_modules`      | 없음                                           |

## GitHub Pages 배포

| 항목          | 확인 결과                                                                                            |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| 기준 커밋     | `6e124c7f1fc532b15bcc094400b936cd3ca512f7`                                                           |
| Actions 실행  | [31301971347](https://github.com/seihwanMoon/moon-tech/actions/runs/31301971347), attempt 2, success |
| Pages 방식    | GitHub Actions workflow, HTTPS enforced                                                              |
| 공개 주소     | `https://seihwanmoon.github.io/moon-tech/`, HTTP 200                                                 |
| Source Note   | `source-notes/anthropic-effective-agents-youtube`, HTTP 200                                          |
| 피드·사이트맵 | `index.xml`, `sitemap.xml`, 각각 HTTP 200                                                            |
| 확인 시각     | 2026-08-09 16:51:25 +09:00                                                                           |

최초 Actions 실행은 Pages를 활성화하기 전에 시작되어 설정 단계에서 실패했다. 저장소 Pages를 `workflow` 방식으로 활성화한 뒤 같은 실행을 재시도했고, build와 deploy 작업이 모두 성공했다.

## 실행 명령

```powershell
.\scripts\run-local.ps1 test
.\scripts\run-local.ps1 build
```

빌드 중 표시되는 `content`용 Git 저장소 탐색 경고는 현재 작업 트리의 공개 결과에 영향을 주지 않았고, 빌드는 종료 코드 0으로 완료됐다. GitHub Actions에서는 저장소 checkout 후 같은 검증을 다시 수행한다.
