# 브라우저 및 인쇄 QA

검증일: 2026-08-09  
브라우저: 설치된 Google Chrome을 사용하는 Playwright 자동 점검

## 화면과 경로

- 1440×1000: 홈, 일반 글, Source Note 4종
- 768×1024: Source Note
- 390×844: 홈, 모바일 Topic 오버레이, Source Note
- 인쇄: A4 Source Note PDF

## 통과 결과

- 모든 점검 경로에서 H1은 1개다.
- Source Note 4종에서 전용 요약 1개, callout 5개, 기본 접힘 4개가 확인됐다.
- Source Note 4종에서 TOC, Graph, Backlinks와 오른쪽 레일이 확인됐다.
- 상단은 `Home / News / Service / About / Contact`다.
- 왼쪽은 `Moon's Tech`, `Topic`, `News / Service / About / Contact`다.
- `Service` 하위는 `제조 / AI / 프로젝트`만 표시된다.
- 모바일 Topic 오버레이는 `aria-expanded=true`, 가시 상태이며 다시 닫을 수 있다.
- 모바일 Topic 오버레이가 열려 있을 때 문서 루트의 스크롤이 잠긴다(`overflow: hidden`).
- 검색 결과 8개를 찾았고 결과 문서로 이동했다.
- 라이트·다크 테마 전환과 저장 상태가 확인됐다.
- 390px, 768px, 1440px 모두 가로 오버플로가 없다.
- 키보드 포커스 윤곽이 표시된다.
- 콘솔 warning/error와 page error는 0개다.
- 푸터는 저작권 한 줄이며 링크는 0개다.

## 인쇄

- 헤더·양쪽 사이드바·전역 푸터는 인쇄에서 제외된다.
- callout 5개의 내용은 모두 펼쳐진다.
- PDF는 3페이지이며 `관련 글` 제목이 단독으로 페이지 끝에 남지 않는다.
- 산출물: `output/pdf/source-note-print.pdf`

## 증거 이미지

- `home-desktop-light.png`, `home-desktop-dark.png`
- `home-mobile-light.png`, `home-mobile-explorer-open.png`
- `source-note-desktop-light.png`, `source-note-desktop-dark.png`
- `source-note-tablet-light.png`, `source-note-mobile-light.png`
