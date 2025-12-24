import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import "./App.css";
import { SCREEN_NAMES } from "./constants/screenNames";
import AppHeader from "./components/Layout/AppHeader";
import { useAuth } from "./contexts/AuthContext";
import { useMainState } from "./components/Main/hooks/useMainState";

import ScreenLoading from "./components/Screen/Common/Loading";
const ScreenIntro = lazy(() => import("./components/Screen/Intro"));
const ScreenMain = lazy(() => import("./components/Screen/Main"));
const ScreenSpend = lazy(() => import("./components/Screen/Spend"));
const ScreenLogin = lazy(() => import("./components/Screen/Member/Login"));
const ScreenJoin = lazy(() => import("./components/Screen/Member/Join"));
const CertFlow = lazy(() => import("./components/Screen/Member/Cert/CertFlow"));
const ScreenJoinEmail = lazy(() => import("./components/Screen/Member/JoinEmail"));
const ScreenWelcome = lazy(() => import("./components/Screen/Common/Welcome"));
const ScreenProfile = lazy(() => import("./components/Screen/Member/Profile"));

const App = () => {
  const { currentUser, logout, deleteAccount, loginWithCertificate } = useAuth();
  const [screen, setScreen] = useState(SCREEN_NAMES.MAIN);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const isLinkedAccount = useMemo(() => {
    if (!currentUser) return false;

    const defaultLinkedEmails = ["test@test.com", "test@gmail.com"];
    const normalizedEmail = currentUser?.email?.toLowerCase?.() || "";
    if (defaultLinkedEmails.includes(normalizedEmail)) {
      return true;
    }

    if (typeof sessionStorage === "undefined") {
      return false;
    }

    const storedSignupId = sessionStorage.getItem("demo-signup-complete");
    return storedSignupId === currentUser.id;
  }, [currentUser]);

  const ensureLinkedAccount = () => {
    if (!isLinkedAccount) {
      setIsSignUpModalOpen(true);
      return false;
    }
    return true;
  };

  const mainState = useMainState({ isLinkedAccount, ensureLinkedAccount, currentUser });

  useEffect(() => {
    const hasOpenSheet =
      mainState.sheetState.isOpen || mainState.isAddSheetOpen || mainState.isSeedSheetOpen;
    document.documentElement.classList.toggle("is_sheet_open", hasOpenSheet);

    return () => document.documentElement.classList.remove("is_sheet_open");
  }, [mainState.isAddSheetOpen, mainState.isSeedSheetOpen, mainState.sheetState.isOpen]);

  const sectionIds = {
    paymentMethods: "section-payment-methods",
    categorySpend: "section-category-spend",
  };

  const handleGoLogin = () => setScreen(SCREEN_NAMES.INTRO);
  const handleGoLoginEmail = () => setScreen(SCREEN_NAMES.LOGIN);
  const handleGoLoginCertificate = () => setScreen(SCREEN_NAMES.LOGIN_CERTIFICATE);
  const handleGoJoin = () => setScreen(SCREEN_NAMES.JOIN);
  const handleGoCertFlow = () => setScreen(SCREEN_NAMES.CERT_FLOW);
  const handleGoEmailFlow = () => setScreen(SCREEN_NAMES.EMAIL_FLOW);
  const handleFlowComplete = () => setScreen(SCREEN_NAMES.WELCOME);
  const handleWelcomeTimeout = () => setScreen(SCREEN_NAMES.MAIN);
  const handleLoginComplete = () => setScreen(SCREEN_NAMES.MAIN);
  const handleGoHome = () => setScreen(SCREEN_NAMES.MAIN);
  const handleGoSpendManagement = () => handleProtectedNavigation(SCREEN_NAMES.SPEND);

  const handleLogout = () => {
    logout();
    setScreen(SCREEN_NAMES.MAIN);
    setIsMenuOpen(false);
  };
  const handleGoProfile = () => {
    setScreen(SCREEN_NAMES.PROFILE);
    setIsMenuOpen(false);
  };

  const handleDeleteAccount = () => {
    deleteAccount();
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

  const handleCloseMenu = () => setIsMenuOpen(false);
  const handleToggleMenu = () => setIsMenuOpen((previous) => !previous);
  const handleNavigate = (callback) => {
    callback?.();
    handleCloseMenu();
  };

  const showBackButton = screen === SCREEN_NAMES.INTRO;

  const handleProtectedNavigation = (nextScreen) => {
    if (!ensureLinkedAccount()) {
      setScreen(SCREEN_NAMES.MAIN);
      return;
    }

    setScreen(nextScreen);
  };

  const menuItems = [
    {
      key: "spend-management",
      label: "지출 관리",
      onClick: () => handleNavigate(() => handleProtectedNavigation(SCREEN_NAMES.SPEND)),
    },
  ];

  return (
    <main className="app">
      <AppHeader
        isAuthenticated={!!currentUser}
        onLogoClick={handleGoHome}
        onToggleMenu={handleToggleMenu}
        onCloseMenu={handleCloseMenu}
        isMenuOpen={isMenuOpen}
        menuItems={menuItems}
        showBackButton={showBackButton}
        onBackClick={handleGoHome}
        onClickLogin={handleGoLogin}
        onClickSignUp={handleGoJoin}
        onClickLogout={handleLogout}
        onClickMyPage={handleGoProfile}
      />
      <Suspense fallback={<ScreenLoading />}>
        {screen === SCREEN_NAMES.INTRO && (
          <ScreenIntro
            onClickLoginEmail={handleGoLoginEmail}
            onClickLoginCertificate={handleGoLoginCertificate}
            onClickGoJoin={handleGoJoin}
          />
        )}

        {screen === SCREEN_NAMES.LOGIN && (
          <ScreenLogin
            mode="email"
            onLoginSuccess={handleLoginComplete}
            onClickSignUp={handleGoJoin}
            onClickBack={handleGoLogin}
            onClickSwitchToCertificate={handleGoLoginCertificate}
          />
        )}

        {screen === SCREEN_NAMES.LOGIN_CERTIFICATE && (
          <ScreenLogin
            mode="certificate"
            onLoginSuccess={handleLoginComplete}
            onClickSignUp={handleGoJoin}
            onClickBack={handleGoLogin}
            onClickSwitchToEmail={handleGoLoginEmail}
          />
        )}

        {screen === SCREEN_NAMES.JOIN && (
          <ScreenJoin onClickCert={handleGoCertFlow} onClickEmail={handleGoEmailFlow} />
        )}

        {screen === SCREEN_NAMES.CERT_FLOW && (
          <CertFlow onComplete={handleCertComplete} onExit={() => setScreen(SCREEN_NAMES.JOIN)} />
        )}

        {screen === SCREEN_NAMES.EMAIL_FLOW && (
          <ScreenJoinEmail onSignUpComplete={handleFlowComplete} />
        )}

        {screen === SCREEN_NAMES.WELCOME && <ScreenWelcome onTimeout={handleWelcomeTimeout} />}

        {screen === SCREEN_NAMES.MAIN && (
          <ScreenMain
            onRequestSignUp={handleGoJoin}
            isLinkedAccount={isLinkedAccount}
            isSignUpModalOpen={isSignUpModalOpen}
            onCloseSignUpModal={() => setIsSignUpModalOpen(false)}
            onGoCategorySpend={handleGoSpendManagement}
            mainState={mainState}
            sectionIds={sectionIds}
          />
        )}

        {screen === SCREEN_NAMES.SPEND && (
          <ScreenSpend
            onRequestSignUp={handleGoJoin}
            isLinkedAccount={isLinkedAccount}
            isSignUpModalOpen={isSignUpModalOpen}
            onCloseSignUpModal={() => setIsSignUpModalOpen(false)}
            mainState={mainState}
            sectionIds={sectionIds}
          />
        )}

        {screen === SCREEN_NAMES.PROFILE && (
          <ScreenProfile onGoHome={handleGoHome} onDeleteAccount={handleDeleteAccount} />
        )}
      </Suspense>
    </main>
  );
};

export default App;
