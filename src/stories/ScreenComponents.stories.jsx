import { useMemo, useState } from "react";
import ScreenIntro from "../components/Screen/Intro";
import ScreenMain from "../components/Screen/Main";
import ScreenSpend from "../components/Screen/Spend";
import ScreenCategory from "../components/Screen/Category";
import ScreenProfile from "../components/Screen/Member/Profile";
import ScreenLogin from "../components/Screen/Member/Login";
import ScreenJoin from "../components/Screen/Member/Join";
import ScreenJoinEmail from "../components/Screen/Member/JoinEmail";
import CertFlow from "../components/Screen/Member/Cert/CertFlow";
import ScreenCertSelect from "../components/Screen/Member/Cert/ScreenCertSelect";
import ScreenUser from "../components/Screen/Member/Cert/ScreenUser";
import ScreenWait from "../components/Screen/Member/Cert/ScreenWait";
import ScreenWelcome from "../components/Screen/Common/Welcome";
import { useMainState } from "../components/Main/hooks/useMainState";
import { bankList } from "../constants/bankList";

export default {
  title: "Components/Screens",
};

const useDemoMainState = () => {
  const mainState = useMainState({
    isLinkedAccount: true,
    ensureLinkedAccount: () => true,
  });

  const sectionIds = useMemo(
    () => ({
      paymentMethods: "story-payment-methods",
      categorySpend: "story-category-spend",
    }),
    [],
  );

  return { mainState, sectionIds };
};

export const Intro = {
  name: "Intro",
  render: () => (
    <ScreenIntro
      onClickGoJoin={() => {}}
      onClickLoginEmail={() => {}}
      onClickLoginCertificate={() => {}}
    />
  ),
};

export const Login = {
  name: "Login",
  render: () => (
    <ScreenLogin
      onLoginSuccess={() => {}}
      onClickSignUp={() => {}}
      onClickBack={() => {}}
      onClickSwitchToCertificate={() => {}}
    />
  ),
};

export const LoginWithCertificate = {
  name: "Login (Certificate)",
  render: () => (
    <ScreenLogin
      mode="certificate"
      onLoginSuccess={() => {}}
      onClickSignUp={() => {}}
      onClickBack={() => {}}
      onClickSwitchToEmail={() => {}}
    />
  ),
};

export const Main = {
  name: "Main",
  render: () => {
    const Story = () => {
      const { mainState } = useDemoMainState();

      return (
        <ScreenMain
          onRequestSignUp={() => {}}
          isLinkedAccount
          isSignUpModalOpen={false}
          onCloseSignUpModal={() => {}}
          mainState={mainState}
        />
      );
    };

    return <Story />;
  },
};

export const Spend = {
  name: "Spend",
  render: () => {
    const Story = () => {
      const { mainState, sectionIds } = useDemoMainState();

      return (
        <ScreenSpend
          onRequestSignUp={() => {}}
          isLinkedAccount
          isSignUpModalOpen={false}
          onCloseSignUpModal={() => {}}
          mainState={mainState}
          sectionIds={sectionIds}
        />
      );
    };

    return <Story />;
  },
};

export const Category = {
  name: "Category",
  render: () => {
    const Story = () => {
      const { mainState, sectionIds } = useDemoMainState();

      return (
        <ScreenCategory
          onRequestSignUp={() => {}}
          isLinkedAccount
          isSignUpModalOpen={false}
          onCloseSignUpModal={() => {}}
          mainState={mainState}
          sectionIds={sectionIds}
        />
      );
    };

    return <Story />;
  },
};

export const Join = {
  name: "Join",
  render: () => <ScreenJoin onClickCert={() => {}} onClickEmail={() => {}} />,
};

export const JoinEmail = {
  name: "JoinEmail",
  render: () => <ScreenJoinEmail onSignUpComplete={() => {}} />,
};

export const Profile = {
  name: "Profile",
  render: () => <ScreenProfile onGoHome={() => {}} onDeleteAccount={() => {}} />,
};

export const CertificateFlow = {
  name: "CertFlow",
  render: () => <CertFlow onComplete={() => {}} onExit={() => {}} />,
};

export const CertificateSelect = {
  name: "ScreenCertSelect",
  render: () => <ScreenCertSelect bankList={bankList} onSelectBank={() => {}} />,
};

export const CertificateUserForm = {
  name: "ScreenUser",
  render: () => {
    const [user, setUser] = useState({ name: "", birth: "", phone: "" });
    const [captcha, setCaptcha] = useState("");
    const selectedBank = bankList.woori;

    return (
      <ScreenUser
        user={user}
        selectedBank={selectedBank}
        captchaCode="ABC123"
        captchaValue={captcha}
        showCaptcha
        errorMessage="입력값을 확인해주세요"
        onChangeField={(field, value) => setUser((prev) => ({ ...prev, [field]: value }))}
        onChangeCaptcha={setCaptcha}
        onRefreshCaptcha={() => setCaptcha("")}
        onNext={() => {}}
        onPrev={() => {}}
      />
    );
  },
};

export const CertificateWait = {
  name: "ScreenWait",
  render: () => <ScreenWait selectedBank={bankList.kb} onNext={() => {}} />,
};

export const Welcome = {
  name: "Welcome",
  render: () => <ScreenWelcome onTimeout={() => {}} />,
};
