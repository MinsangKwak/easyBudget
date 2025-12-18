import { Suspense, lazy, useState } from "react";
import "./App.css";
import { SCREEN_NAMES } from "./constants/screenNames";
import AppHeader from "./components/Layout/AppHeader";
import { useAuth } from "./contexts/AuthContext";

import ScreenLoading from "./components/Screen/Common/Loading";
const ScreenIntro = lazy(() => import("./components/Screen/Intro"));
const ScreenMain = lazy(() => import("./components/Screen/Main"));
const ScreenLogin = lazy(() => import("./components/Screen/Member/Login"));
const ScreenJoin = lazy(() => import("./components/Screen/Member/Join"));
const CertFlow = lazy(() => import("./components/Screen/Member/Cert/CertFlow"));
const ScreenJoinEmail = lazy(() => import("./components/Screen/Member/JoinEmail"));
const ScreenWelcome = lazy(() => import("./components/Screen/Common/Welcome"));
const ScreenProfile = lazy(() => import("./components/Screen/Member/Profile"));

const App = () => {
  const { currentUser, logout, loginWithCertificate } = useAuth();
  const [screen, setScreen] = useState(SCREEN_NAMES.MAIN);

  const handleGoLogin = () => setScreen(SCREEN_NAMES.LOGIN);
  const handleGoJoin = () => setScreen(SCREEN_NAMES.JOIN);
  const handleGoCertFlow = () => setScreen(SCREEN_NAMES.CERT_FLOW);
  const handleGoEmailFlow = () => setScreen(SCREEN_NAMES.EMAIL_FLOW);
  const handleFlowComplete = () => setScreen(SCREEN_NAMES.WELCOME);
  const handleWelcomeTimeout = () => setScreen(SCREEN_NAMES.MAIN);
  const handleLoginComplete = () => setScreen(SCREEN_NAMES.MAIN);
  const handleGoHome = () => setScreen(SCREEN_NAMES.MAIN);
  const handleGoProfile = () => setScreen(SCREEN_NAMES.PROFILE);

  const handleLogout = () => {
    logout();
    setScreen(SCREEN_NAMES.MAIN);
  };

  const handleCertComplete = ({ bank, user }) => {
    loginWithCertificate({
      bankName: bank?.name,
      name: user?.name,
      phone: user?.phone,
      birth: user?.birth,
    });
    handleFlowComplete();
  };

  return (
    <main className="app">
      <AppHeader
        isAuthenticated={!!currentUser}
        onLogoClick={handleGoHome}
        onLoginClick={handleGoLogin}
        onProfileClick={handleGoProfile}
        onLogoutClick={handleLogout}
      />
      <Suspense fallback={<ScreenLoading />}>
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
            onComplete={handleCertComplete}
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

        {screen === SCREEN_NAMES.PROFILE && (
          <ScreenProfile onGoHome={handleGoHome} />
        )}
      </Suspense>
    </main>
  );
};

export default App;
