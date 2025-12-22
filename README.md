# 쉬운 가계부

회원가입/로그인 경험과 지출·수입 요약을 빠르게 시연할 수 있는 React/Vite 데모입니다. 기본 진입은 **MAIN** 화면이며 상단 헤더의 "로그인" 버튼으로 **INTRO → (이메일/금융인증서 로그인) → JOIN → 인증/회원가입 플로우 → WELCOME → MAIN** 순서로 이동합니다. 로그인하면 헤더가 "마이프로필/로그아웃" 버튼으로 전환되어 현재 세션을 바로 확인할 수 있습니다.

## 화면 흐름 요약
- `src/App.jsx`에서 모든 화면 상태를 관리하며, 각 화면은 `Suspense`로 지연 로딩됩니다. 필요 시 메인에서 바로 로그인/회원가입 플로우로 진입하거나 다시 메인으로 복귀할 수 있습니다.
- 헤더는 로그인 여부에 따라 액션을 변경합니다. 비로그인 시 로그인 버튼만 노출되고, 로그인 후에는 마이프로필/로그아웃이 노출됩니다. 인트로에서는 로고 대신 뒤로가기 버튼만 표시되어 홈으로 돌아갈 수 있습니다.
- 로그인/가입 완료 시 `onLoginSuccess`·`onComplete` 콜백을 통해 MAIN 또는 WELCOME 화면으로 자연스럽게 이동합니다.

## 인증 및 계정 관리
- `AuthContext`(`src/contexts/AuthContext.jsx`)는 `/api/auth/default-users` 또는 `VITE_API_BASE_URL`이 지정된 경우 해당 베이스 URL에서 기본 계정 목록을 불러오고, 실패 시 내장된 샘플 계정으로 대체합니다. 상태는 `sessionStorage`에 저장해 새로고침 후에도 유지됩니다.
- 이메일/비밀번호 로그인(`loginWithEmail`), 금융인증서 로그인(`loginWithCertificate`), 이메일/G-Mail 가입(`registerEmailUser`)을 지원합니다. 금융인증서 로그인 시 휴대폰+생년월일 조합으로 기존 계정과 병합하여 동일 사용자로 취급합니다.
- 사용자 합치기 로직은 이메일·휴대폰/생년월일을 기준으로 기존 계정을 찾아 병합(`mergeUserIntoList`)하고, 제공된 필드(`profile`, `identity`, `agreements`, `security`, `meta`)를 보존합니다.
- 기본 샘플 계정(모두 비밀번호 `1234qwer`):
  - Gmail 연동만 된 계정: `test@gmail.com`
  - 일반 가입만 된 계정: `test@test.com`
  - 금융인증서만 된 계정: 이름 `홍길동`, 휴대폰 `010-1234-5678`, 생년월일 `19900101`
  - Gmail/일반/은행 인증이 모두 연결된 올인원 계정: `all@gmail.com` / `all@test.com`
- 메인 가계부 데이터는 `test@test.com` 또는 `test@gmail.com`으로 로그인했을 때만 실제 금액/내역을 노출하며, 그 외 계정이나 미로그인 시에는 모든 금액·카운트가 `??`로 마스킹됩니다.

## 화면별 주요 기능
### 인트로/헤더/프로필
- 인트로(`src/components/Screen/Intro`)에서 이메일/금융인증서 로그인 진입 또는 회원가입을 선택할 수 있습니다.
- 마이프로필 화면(`src/components/Screen/Member/Profile`)은 현재 세션의 이름, 이메일, 연동 타입, 은행, 연락처, 생년월일을 카드 형태로 보여주며, 로그인되지 않은 경우에는 안내 메시지를 표시합니다.

### 로그인 및 가입 플로우
- 로그인 화면(`src/components/Screen/Member/Login`)은 이메일/비밀번호 또는 금융인증서 모드를 지원합니다. 이메일 형식·비밀번호 길이 검증, 잘못된 계정/비밀번호/은행인증 전용 계정 에러 문구, 로딩 상태를 제공합니다.
- 회원가입 선택 화면(`src/components/Screen/Member/Join`)에서 일반 회원가입 또는 금융인증서 가입을 고를 수 있습니다.
- 이메일/G-Mail 가입(`src/components/Screen/Member/JoinEmail`)은 이메일/비밀번호 확인 필수 입력과 중복 이메일 검증을 포함하며, `@gmail.com` 주소일 때 G-Mail 연동 흐름으로도 가입할 수 있습니다.
- 금융인증서 가입 플로우(`src/components/Screen/Member/Cert/CertFlow`)는 **은행 선택 → 사용자 정보 입력 + (4회 이상 실패 시) 캡차 → 은행 앱 인증 대기** 순서로 진행되며, 단계 이동 시 입력값과 캡차가 초기화됩니다. 완료 시 `loginWithCertificate`로 바로 로그인되어 WELCOME 화면으로 이동합니다.
- WELCOME 화면(`src/components/Screen/Common/Welcome`)은 일정 시간 후 메인으로 자동 이동하도록 안내합니다.

### 메인 가계부 데모
- 보고서 섹션(`ReportSection`)은 이번 달 수입/지출 합계와 정기/변동 지출(예정·완료) 현황을 보여주며, 편집 모드에서 예산 값을 바로 수정할 수 있습니다.
- 카테고리 섹션(`CategorySection`)은 지출 카테고리를 도넛 차트와 리스트로 노출합니다. 편집 모드에서 카테고리 금액을 직접 입력할 수 있고, 각 행의 화살표 버튼으로 해당 카테고리의 상세 내역 시트를 엽니다. 차트와 리스트의 색상 도트가 동일한 톤으로 맞춰져 있습니다.
- 지출수단 섹션(`PaymentMethodsSection`)은 카드·현금 등 결제 그룹별 합계를 보여주고, 항목 클릭 시 해당 수단의 거래 내역 시트를 엽니다.
- 마이데이터 추가 시트(`AddDataSheet`)에서 수입/지출, 카테고리, 결제수단, 정기/변동, 예정/완료, 금액, 날짜를 입력해 즉시 데이터에 반영할 수 있습니다.
- 비연동 계정은 수정/추가/상세 보기 액션을 시도할 때 회원가입 유도 모달(`AuthRequiredModal`)이 열리며, 지표·내역은 `??`로 마스킹됩니다.
- 내역 시트(`TransactionSheet`)는 카테고리·지출수단별 거래 리스트를 하단 시트로 보여주며, 시트가 열릴 때 문서 루트에 `is_sheet_open` 클래스를 적용해 배경 스크롤을 차단합니다.

## Storybook 사용 안내
- 개발 서버와 별도로 Storybook을 실행하려면 `npm run storybook`을 사용합니다.
- CI나 빠른 헬스체크를 위해서는 `npm run storybook -- --ci --smoke-test`로 번들/프리뷰 구성을 확인할 수 있습니다.
- `src/stories/*Components.stories.jsx`에서 공통/레이아웃/콘텐츠/폼/전체 화면 컴포넌트를 모두 확인할 수 있습니다.

## 실행 방법

```bash
npm install   # 최초 1회 설치
npm run dev   # 개발 서버 실행 (기본: http://localhost:5173)
npm run build # 프로덕션 번들 빌드
```

## 환경 변수
- `VITE_API_BASE_URL`: 기본 사용자 목록 API가 있을 경우 베이스 URL로 사용됩니다. 설정하지 않으면 `/api/auth/default-users`를 직접 호출합니다.
- `VITE_GOOGLE_CLIENT_ID`: Google One Tap을 사용하는 가입/로그인을 위해 필요한 클라이언트 ID입니다(`ScreenJoinGoogle`).
