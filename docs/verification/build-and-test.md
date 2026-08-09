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

## 실행 명령

```powershell
.\scripts\run-local.ps1 test
.\scripts\run-local.ps1 build
```

빌드 중 표시되는 `content`용 Git 저장소 탐색 경고는 현재 작업 트리의 공개 결과에 영향을 주지 않았고, 빌드는 종료 코드 0으로 완료됐다. GitHub Actions에서는 저장소 checkout 후 같은 검증을 다시 수행한다.
