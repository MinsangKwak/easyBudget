import { Suspense, lazy, useState } from "react";
import "./App.css";
import Loading from "./components/Common/Loading";
import Button from "./components/Form/Button";
import { SCREEN_NAMES } from "./constants/screenNames";

const ScreenIntro = lazy(() => import("./components/Screen/Intro"));
const ScreenMain = lazy(() => import("./components/Screen/Main"));
const ScreenJoin = lazy(() => import("./components/Screen/Member/Join"));
const CertFlow = lazy(() => import("./components/Screen/Member/Cert/CertFlow"));
const ScreenJoinEmail = lazy(() => import("./components/Screen/Member/JoinEmail"));
const ScreenJoinGoogle = lazy(() => import("./components/Screen/Member/JoinGoogle"));
const ScreenWelcome = lazy(() => import("./components/Screen/Common/Welcome"));

const App = () => {
  const [screen, setScreen] = useState(SCREEN_NAMES.INTRO);

  const handleGoJoin = () => setScreen(SCREEN_NAMES.JOIN);
  const handleGoCertFlow = () => setScreen(SCREEN_NAMES.CERT_FLOW);
  const handleGoEmailFlow = () => setScreen(SCREEN_NAMES.EMAIL_FLOW);
  const handleGoGoogleFlow = () => setScreen(SCREEN_NAMES.GOOGLE_FLOW);
  const handleFlowComplete = () => setScreen(SCREEN_NAMES.WELCOME);
  const handleWelcomeTimeout = () => setScreen(SCREEN_NAMES.MAIN);

  const showBackButton =
    screen === SCREEN_NAMES.JOIN ||
    screen === SCREEN_NAMES.EMAIL_FLOW ||
    screen === SCREEN_NAMES.GOOGLE_FLOW;

  const handlePrev = () => {
    if (screen === SCREEN_NAMES.JOIN) {
      setScreen(SCREEN_NAMES.INTRO);
    } else if (
      screen === SCREEN_NAMES.EMAIL_FLOW ||
      screen === SCREEN_NAMES.GOOGLE_FLOW
    ) {
      setScreen(SCREEN_NAMES.JOIN);
    }
  };

  return (
    <div className="app_root">
      <Suspense fallback={<Loading />}>
        {showBackButton && (
          <div className="app_nav">
            <Button type="button" className="btn_back" onClick={handlePrev}>
              뒤로가기
            </Button>
          </div>
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

        {screen === SCREEN_NAMES.EMAIL_FLOW && (
          <ScreenJoinEmail onSignUpComplete={handleFlowComplete} />
        )}

        {screen === SCREEN_NAMES.GOOGLE_FLOW && (
          <ScreenJoinGoogle onSignUpComplete={handleFlowComplete} />
        )}

        {screen === SCREEN_NAMES.WELCOME && (
          <ScreenWelcome onTimeout={handleWelcomeTimeout} />
        )}

        {screen === SCREEN_NAMES.MAIN && <ScreenMain />}
      </Suspense>
    </div>
  );
};

export default App;
