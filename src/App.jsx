// src/App.jsx
import { useState } from "react";

// 경로는 네 프로젝트 구조에 맞게 수정하면 돼
import ScreenIntro from "./components/Screen/Intro/ScreenIntro";
import ScreenMain from "./components/Screen/Main/ScreenMain";
import ScreenJoin from "./components/Screen/Member/ScreenJoin";
import CertFlow from "./components/Screen/Member/Cert/CertFlow";
import ScreenJoinEmail from "./components/Screen/Member/ScreenJoinEmail";
import ScreenJoinGoogle from "./components/Screen/Member/ScreenJoinGoogle";
import ScreenWelcome from "./components/Screen/Common/ScreenWelcome";
import { SCREEN_NAMES } from "./constants/screenNames";

const App = () => {
  const [screen, setScreen] = useState(SCREEN_NAMES.INTRO);

  // INTRO → JOIN
  const handleGoJoin = () => setScreen(SCREEN_NAMES.JOIN);

  // JOIN → 각 플로우
  const handleGoCertFlow = () => setScreen(SCREEN_NAMES.CERT_FLOW);
  const handleGoEmailFlow = () => setScreen(SCREEN_NAMES.EMAIL_JOIN);
  const handleGoGoogleFlow = () => setScreen(SCREEN_NAMES.GOOGLE_JOIN);

  // 플로우 종료 → WELCOME
  const handleFlowComplete = () => setScreen(SCREEN_NAMES.WELCOME);

  // WELCOME → MAIN
  const handleWelcomeTimeout = () => setScreen(SCREEN_NAMES.MAIN);

  // 상단 뒤로가기: INTRO/JOIN 수준만 관리
  const showBackButton =
    screen === SCREEN_NAMES.JOIN ||
    screen === SCREEN_NAMES.EMAIL_JOIN ||
    screen === SCREEN_NAMES.GOOGLE_JOIN;

  const handlePrev = () => {
    if (screen === SCREEN_NAMES.JOIN) {
      setScreen(SCREEN_NAMES.INTRO);
    } else if (
      screen === SCREEN_NAMES.EMAIL_JOIN ||
      screen === SCREEN_NAMES.GOOGLE_JOIN
    ) {
      setScreen(SCREEN_NAMES.JOIN);
    }
  };

  return (
    <div className="app_root">
      {showBackButton && (
        <button type="button" id="prevHandler" onClick={handlePrev}>
          뒤로가기
        </button>
      )}

      {screen === SCREEN_NAMES.INTRO && (
        <ScreenIntro onClickGoJoin={handleGoJoin} />
      )}

      {screen === SCREEN_NAMES.JOIN && (
        <ScreenJoin
          onClickCert={handleGoCertFlow}
          onClickEmail={handleGoEmailFlow}
          onClickGoogle={handleGoGoogleFlow}
        />
      )}

      {screen === SCREEN_NAMES.CERT_FLOW && (
        <CertFlow
          onComplete={handleFlowComplete}
          onExit={() => setScreen(SCREEN_NAMES.JOIN)}
        />
      )}

      {screen === SCREEN_NAMES.EMAIL_JOIN && (
        <ScreenJoinEmail onSignUpComplete={handleFlowComplete} />
      )}

      {screen === SCREEN_NAMES.GOOGLE_JOIN && (
        <ScreenJoinGoogle onSignUpComplete={handleFlowComplete} />
      )}

      {screen === SCREEN_NAMES.WELCOME && (
        <ScreenWelcome onTimeout={handleWelcomeTimeout} />
      )}

      {screen === SCREEN_NAMES.MAIN && <ScreenMain />}
    </div>
  );
};

export default App;
