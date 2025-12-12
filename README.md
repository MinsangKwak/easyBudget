# Auth Flow Demo (React + Vite)

회원가입 경험을 빠르게 시연하기 위한 간단한 React/Vite 프로젝트입니다. INTRO → JOIN → 각 가입 플로우(금융인증서, 일반 이메일, Google) → WELCOME → MAIN 순서로 화면이 전환됩니다.

## 주요 기능

- **화면 전환 상태 관리**: `src/App.jsx`에서 화면 상태를 관리하며, 가입 완료 시 환영 화면과 메인 화면으로 이동합니다.
- **금융인증서 가입 플로우 복원**:
  - 은행 선택 → 본인 정보 입력/수정 + 캡차 입력 → 은행 앱 인증 대기 → 완료 순서로 진행됩니다.
  - 은행을 다시 선택하면 사용자 입력과 캡차가 초기화되어 깨끗한 상태로 재시작합니다.
  - 본인 정보 입력 화면의 “이전으로” 버튼과 상단 뒤로가기 버튼으로 이전 단계로 안전하게 이동할 수 있습니다.
- **지연 로딩(Suspense)**: 주요 화면 컴포넌트를 지연 로딩하여 초기 번들 크기를 줄입니다.

## 폴더 구조 하이라이트

- `src/components/Screen/Member/Cert/CertFlow`: 금융인증서 가입 3단계(은행 선택, 사용자 정보, 인증 대기) 흐름 관리
- `src/components/Screen/Member/Join*`: 가입 방식 선택, 이메일/Google 가입 화면
- `src/components/Screen/Common/Welcome`: 가입 완료 후 메인으로 이동을 안내하는 화면
- `src/constants`: 화면 이름(`screenNames.js`), 은행 정보(`bankList.js`) 등 상수 정의

## 실행 방법

```bash
npm install   # 최초 1회 설치
npm run dev   # 개발 서버 실행 (기본: http://localhost:5173)
npm run build # 프로덕션 번들 빌드
```

## GitHub Pages 배포 가이드

GitHub Actions 워크플로를 추가해 `main` 브랜치 푸시 시 자동으로 GitHub Pages에 배포하도록 설정했습니다. Pages 빌드 환경의 `GITHUB_REPOSITORY` 값을 이용해 Vite `base` 경로가 자동으로 `/저장소명/`으로 맞춰집니다.

1. GitHub 저장소에서 **Settings → Pages**로 이동해 **Source**를 “GitHub Actions”로 설정합니다.
2. `main` 브랜치로 코드를 푸시하면 자동으로 빌드 및 배포가 진행됩니다. 수동으로 실행하려면 Actions 탭에서 “Deploy to GitHub Pages” 워크플로를 선택해 **Run workflow**를 눌러 실행할 수 있습니다.
3. 배포가 완료되면 워크플로 출력의 `page_url` 또는 `https://<GitHubID>.github.io/<repo>/` 주소로 접속합니다.
4. 로컬에서 배포 결과를 확인하려면 아래 명령으로 프로덕션 번들을 생성한 뒤 `dist/`를 `npm run preview`로 확인할 수 있습니다.

   ```bash
   npm run build
   npm run preview
   ```

## 금융인증서 플로우 동작 요약

1. **은행 선택**: `bankList`의 은행 중 하나를 선택하면 다음 단계로 이동하며 입력값과 캡차가 초기화됩니다.
2. **본인 정보 입력**: 이름/생년월일/휴대폰 번호를 수정할 수 있고, 캡차 새로고침 시 코드와 입력값이 재생성됩니다.
3. **인증 대기**: 은행 앱에서 인증을 완료한 뒤 “인증 완료”를 누르면 상위 플로우가 완료되고 환영 화면으로 이동합니다.

## 현재 상태

- 금융인증서 플로우의 단계 이동, 뒤로가기, 캡차 초기화 로직을 정상 동작하도록 복구했습니다.
- README를 프로젝트 흐름 기준으로 갱신했습니다.
