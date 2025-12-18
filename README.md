# Auth Flow Demo (React + Vite)

회원가입 경험을 빠르게 시연하기 위한 간단한 React/Vite 프로젝트입니다. 기본 진입은 **MAIN** 화면이며 상단 헤더의 "로그인 / 회원가입" 버튼을 눌러 **INTRO → JOIN → 가입 플로우(금융인증서, 일반 이메일) → WELCOME → MAIN** 순서로 이동합니다.

## 주요 기능

- **화면 전환 상태 관리**: `src/App.jsx`에서 화면 상태를 관리하며, 메인에서 바로 로그인/회원가입 플로우로 진입할 수 있습니다.
- **동적 헤더**: 메인 화면에서는 로고와 "로그인 / 회원가입" 버튼을 좌우에 배치하고, 이후 화면에서는 "뒤로가기" 버튼으로 한 단계 전으로 이동할 수 있습니다.(`src/components/Layout/AppHeader`)
- **Storybook 전체 커버리지**: `src/components` 아래 모든 UI 요소(공통, 레이아웃, 콘텐츠, 폼, 화면)를 Storybook 스토리로 등록해 독립적으로 확인할 수 있습니다.(`src/stories/*Components.stories.jsx`)
- **금융인증서 가입 플로우 복원**:
  - 은행 선택 → 본인 정보 입력/수정 + 캡차 입력 → 은행 앱 인증 대기 → 완료 순서로 진행됩니다.
  - 은행을 다시 선택하면 사용자 입력과 캡차가 초기화되어 깨끗한 상태로 재시작합니다.
  - 본인 정보 입력 화면의 “이전으로” 버튼과 상단 뒤로가기 버튼으로 이전 단계로 안전하게 이동할 수 있습니다.
- **지연 로딩(Suspense)**: 주요 화면 컴포넌트를 지연 로딩하여 초기 번들 크기를 줄입니다.
- **로그인 경험**: 이메일/비밀번호 형식을 검증하고, 요청 처리 중에는 `ScreenLoading`으로 상태를 명확히 보여준 뒤 정상적으로 메인으로 복귀합니다.(`src/components/Screen/Member/Login`)

## 폴더 구조 하이라이트

- `src/components/Screen/Member/Cert/CertFlow`: 금융인증서 가입 3단계(은행 선택, 사용자 정보, 인증 대기) 흐름 관리
- `src/components/Screen/Member/Join*`: 가입 방식 선택, 이메일 가입 화면
- `src/components/Screen/Common/Welcome`: 가입 완료 후 메인으로 이동을 안내하는 화면
- `src/constants`: 화면 이름(`screenNames.js`), 은행 정보(`bankList.js`) 등 상수 정의

## Storybook 사용 안내

- 개발 서버와 별도로 Storybook을 실행하려면 `npm run storybook`을 사용합니다.
- 등록된 주요 스토리:
  - `src/stories/CommonComponents.stories.jsx`: 로딩 인디케이터, Lottie 아이콘
  - `src/stories/LayoutComponents.stories.jsx`: 화면 레이아웃, 상단 헤더, 내부 그리드
  - `src/stories/ContentComponents.stories.jsx`: 타이틀, 리스트, 진행 상태 표시 등 콘텐츠 구성 요소
  - `src/stories/FormComponents.stories.jsx`: 버튼 레이아웃, 입력 필드, 캡차, 에러 메시지 등 폼 요소
  - `src/stories/ScreenComponents.stories.jsx`: 인트로/메인/가입/금융인증/환영 화면 등 전체 플로우 스크린

## 실행 방법

```bash
npm install   # 최초 1회 설치
npm run dev   # 개발 서버 실행 (기본: http://localhost:5173)
npm run build # 프로덕션 번들 빌드
```

## 금융인증서 플로우 동작 요약

1. **은행 선택**: `bankList`의 은행 중 하나를 선택하면 다음 단계로 이동하며 입력값과 캡차가 초기화됩니다.
2. **본인 정보 입력**: 이름/생년월일/휴대폰 번호를 수정할 수 있고, 캡차 새로고침 시 코드와 입력값이 재생성됩니다.
3. **인증 대기**: 은행 앱에서 인증을 완료한 뒤 “인증 완료”를 누르면 상위 플로우가 완료되고 환영 화면으로 이동합니다.

## 현재 상태

- 금융인증서 플로우의 단계 이동, 뒤로가기, 캡차 초기화 로직을 정상 동작하도록 복구했습니다.
- 인트로 이후 화면에서 자동으로 노출되는 상단 뒤로가기 버튼을 추가해 화면 전환 동선이 명확합니다.
- 로그인/회원가입 플로우에서 잘못된 이메일/비밀번호 입력 시 에러 메시지를 안내하고, 정상 로그인 시 로딩 화면 이후 메인으로 이동합니다.
- Storybook에 모든 UI 컴포넌트를 등록하여 개발/디자인 확인이 용이합니다.(`npm run storybook`)
