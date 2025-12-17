import { Suspense, lazy, useState } from "react";
import "./App.css";
import Loading from "./components/Common/Loading";
import { SCREEN_NAMES } from "./constants/screenNames";
import AppHeader from "./components/Layout/AppHeader";

const ScreenIntro = lazy(() => import("./components/Screen/Intro"));
const ScreenMain = lazy(() => import("./components/Screen/Main"));
const ScreenLogin = lazy(() => import("./components/Screen/Member/Login"));
const ScreenJoin = lazy(() => import("./components/Screen/Member/Join"));
const CertFlow = lazy(() => import("./components/Screen/Member/Cert/CertFlow"));
const ScreenJoinEmail = lazy(() => import("./components/Screen/Member/JoinEmail"));
const ScreenWelcome = lazy(() => import("./components/Screen/Common/Welcome"));

const App = () => {
  const [screen, setScreen] = useState(SCREEN_NAMES.MAIN);

  const handleGoLogin = () => setScreen(SCREEN_NAMES.LOGIN);
  const handleGoJoin = () => setScreen(SCREEN_NAMES.JOIN);
  const handleGoCertFlow = () => setScreen(SCREEN_NAMES.CERT_FLOW);
  const handleGoEmailFlow = () => setScreen(SCREEN_NAMES.EMAIL_FLOW);
  const handleFlowComplete = () => setScreen(SCREEN_NAMES.WELCOME);
  const handleWelcomeTimeout = () => setScreen(SCREEN_NAMES.MAIN);
  const handleLoginComplete = () => setScreen(SCREEN_NAMES.MAIN);

  const showBackButton = screen !== SCREEN_NAMES.MAIN;
  const showAuthAction = screen === SCREEN_NAMES.MAIN;

  const handlePrev = () => {
    if (screen === SCREEN_NAMES.LOGIN) {
      setScreen(SCREEN_NAMES.MAIN);
    } else if (screen === SCREEN_NAMES.JOIN) {
      setScreen(SCREEN_NAMES.LOGIN);
    } else if (screen === SCREEN_NAMES.EMAIL_FLOW) {
      setScreen(SCREEN_NAMES.JOIN);
    } else if (screen === SCREEN_NAMES.CERT_FLOW) {
      setScreen(SCREEN_NAMES.JOIN);
    } else if (screen === SCREEN_NAMES.WELCOME) {
      setScreen(SCREEN_NAMES.MAIN);
    } else if (screen === SCREEN_NAMES.INTRO) {
      setScreen(SCREEN_NAMES.MAIN);
    }
  };

  return (
    <main className="app">
      <AppHeader
        showBackButton={showBackButton}
        showAuthAction={showAuthAction}
        onAuthClick={handleGoLogin}
        onBack={handlePrev}
      />
      <Suspense fallback={<Loading />}>
        {screen === SCREEN_NAMES.INTRO && (
          <ScreenIntro onClickGoJoin={handleGoJoin} />
        )}

        {screen === SCREEN_NAMES.LOGIN && (
          <ScreenLogin
            onLoginSuccess={handleLoginComplete}
            onClickSignUp={handleGoJoin}
          />
        )}

        {screen === SCREEN_NAMES.JOIN && (
          <ScreenJoin
            onClickCert={handleGoCertFlow}
            onClickEmail={handleGoEmailFlow}
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

        {screen === SCREEN_NAMES.WELCOME && (
          <ScreenWelcome onTimeout={handleWelcomeTimeout} />
        )}

        {screen === SCREEN_NAMES.MAIN && <ScreenMain />}
      </Suspense>
    </main>
  );
};

export default App;
