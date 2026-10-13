# HARANG

AI 컨설팅, 맞춤형 솔루션의 직접 설계·개발·구축, 안전성 검증과 운영 개선을 소개하는 HARANG 기업 홈페이지입니다.

HARANG은 기업의 AI 활용 전략을 함께 세우고 실제 업무에 쓰는 솔루션을 직접 구현하는 AX 컨설팅·개발 파트너를 지향합니다. AI 에이전트, 문서 자동화, 내부 업무 도구와 시스템 연동을 프로젝트별 합의 범위에서 구현하고, 필요한 운영 지원을 협의합니다.

- 운영 도메인: https://harang.xyz
- 문의: contact@harang.xyz
- 기술: HTML, CSS, JavaScript. 빌드와 외부 패키지가 필요하지 않습니다.

## 로컬 실행

Node.js 20 이상에서 다음 명령을 실행합니다.

```sh
npm run dev
```

미리보기 주소: http://127.0.0.1:4173

```sh
npm run check
```

## GitHub Pages 배포

저장소 Settings → Pages → Build and deployment → Source를 **GitHub Actions**로 설정합니다. `main` 브랜치에 변경을 올리면 `.github/workflows/pages.yml`이 검증 후 `public/` 폴더를 배포합니다.

Custom domain은 `harang.xyz`로 설정합니다. DNS는 아래처럼 연결합니다.

| 유형 | 호스트 | 값 |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | seoulking.github.io |

기존 이메일 전달용 MX와 SPF TXT 레코드는 유지합니다. DNS 검증과 인증서 발급이 완료되면 GitHub Pages의 **Enforce HTTPS**를 활성화합니다. GitHub Actions 방식에서는 도메인을 Pages 설정에서 관리하며 CNAME 파일이 필요하지 않습니다.

## 수정 안내

- `public/index.html`: 소개 문구, 섹션, 메일 문의 영역
- `public/styles.css`: 색상, 레이아웃, 반응형 스타일
- `public/app.js`: 데모 시나리오, 메뉴, 모달, 이메일 문의 동작
- `public/favicon.svg`: 브랜드 아이콘

데모는 준비된 가상 데이터를 사용합니다. 실제 AI 호출, 자동 발송, 문의 데이터베이스 저장을 수행하지 않습니다. 문의 영역은 Gmail 작성 화면, 기본 메일 앱, 이메일 주소 복사를 제공합니다. 받는 사람은 contact@harang.xyz이며, 사용자가 메일 서비스에서 직접 작성하고 발송합니다. 문의 메일 수신 여부는 도메인 이메일 전달 설정에서 별도로 확인해야 합니다.

웹폰트는 Google Fonts에서 불러오며, 불러오지 못하면 시스템 글꼴을 사용합니다. 분석 도구와 추적 쿠키는 포함하지 않습니다.

## 한국어 / 영어

상단 KOR / ENG 버튼으로 홈페이지 전체 언어를 전환할 수 있습니다. 소개, 서비스 상세창, 데모, 메일 문의 버튼과 정보 처리 안내에 적용됩니다. 언어를 바꿔도 진행 중인 데모 상태가 유지됩니다. 메일 문의 버튼은 현재 언어에 맞는 제목을 작성 화면에 채웁니다.

- 한국어 공유 주소: https://harang.xyz/?lang=ko
- 영어 공유 주소: https://harang.xyz/?lang=en

URL의 lang 값, 브라우저에 저장한 선택, 브라우저 기본 언어 순서로 표시 언어를 결정합니다. 지원하지 않는 브라우저 언어는 영어로 표시합니다. 선택한 언어는 브라우저 로컬 저장소의 harang.language에 보관하며, 저장이 제한된 환경에서도 언어 버튼은 동작합니다.

번역 문구는 public/i18n.js에서 관리합니다. npm run check는 양쪽 번역 키와 HTML 연결 여부도 검사합니다.
