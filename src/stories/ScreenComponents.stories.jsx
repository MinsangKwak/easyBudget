import { useState } from "react";
import ScreenIntro from "../components/Screen/Intro";
import ScreenMain from "../components/Screen/Main";
import ScreenLogin from "../components/Screen/Member/Login";
import ScreenJoin from "../components/Screen/Member/Join";
import ScreenJoinEmail from "../components/Screen/Member/JoinEmail";
import CertFlow from "../components/Screen/Member/Cert/CertFlow";
import ScreenCertSelect from "../components/Screen/Member/Cert/ScreenCertSelect";
import ScreenUser from "../components/Screen/Member/Cert/ScreenUser";
import ScreenWait from "../components/Screen/Member/Cert/ScreenWait";
import ScreenWelcome from "../components/Screen/Common/Welcome";
import { bankList } from "../constants/bankList";

export default {
  title: "Components/Screens",
};

export const Intro = {
  name: "Intro",
  render: () => <ScreenIntro onClickGoJoin={() => {}} />,
};

export const Login = {
  name: "Login",
  render: () => (
    <ScreenLogin onLoginSuccess={() => {}} onClickSignUp={() => {}} />
  ),
};

export const Main = {
  name: "Main",
  render: () => <ScreenMain />, 
};

export const Join = {
  name: "Join",
  render: () => (
    <ScreenJoin onClickCert={() => {}} onClickEmail={() => {}} />
  ),
};

export const JoinEmail = {
  name: "JoinEmail",
  render: () => <ScreenJoinEmail onSignUpComplete={() => {}} />,
};

export const CertificateFlow = {
  name: "CertFlow",
  render: () => <CertFlow onComplete={() => {}} onExit={() => {}} />,
};

export const CertificateSelect = {
  name: "ScreenCertSelect",
  render: () => (
    <ScreenCertSelect bankList={bankList} onSelectBank={() => {}} />
  ),
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
