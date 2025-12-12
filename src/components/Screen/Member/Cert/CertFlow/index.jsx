import "./index.css";
import { useState } from "react";
import ScreenCertSelect from "../ScreenCertSelect";
import ScreenUser from "../ScreenUser";
import ScreenWait from "../ScreenWait";
import { bankList } from "../../../../../constants/bankList";
import Button from "../../../../Form/Button";

const CERT_STEPS = {
  STEP1: "CERT_SELECT",
  STEP2: "USER",
  STEP3: "WAIT",
};

const mockUser = {
  name: "홍길동",
  birth: "19900101",
  phone: "01012345678",
};

const generateCaptchaCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";

  return Array.from({ length: 6 })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
};

const CertFlow = ({ onComplete, onExit }) => {
  const [step, setStep] = useState(CERT_STEPS.STEP1);
  const [selectedBank, setSelectedBank] = useState(null);
  const [userInfo, setUserInfo] = useState(mockUser);
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaCode, setCaptchaCode] = useState(generateCaptchaCode);

  const handleChangeUserField = (field, value) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectBank = (bankKey) => {
    setSelectedBank(bankList[bankKey]);
    setCaptchaCode(generateCaptchaCode());
    setCaptchaValue("");
    setUserInfo(mockUser);
    setStep(CERT_STEPS.STEP2);
  };

  const handleStepWait = () => {
    setStep(CERT_STEPS.STEP3);
  };

  const handleFinishCert = () => {
    onComplete?.();
  };

  const handleBack = () => {
    if (step === CERT_STEPS.STEP3) {
      setStep(CERT_STEPS.STEP2);
    } else if (step === CERT_STEPS.STEP2) {
      setStep(CERT_STEPS.STEP1);
    } else if (step === CERT_STEPS.STEP1) {
      onExit?.();
    }
  };

  const handleRefreshCaptcha = () => {
    setCaptchaCode(generateCaptchaCode());
    setCaptchaValue("");
  };

  return (
    <div className="cert_flow_root">
      <div className="cert_flow__header">
        <Button type="button" className="btn_back" onClick={handleBack}>
          뒤로가기
        </Button>
      </div>

      {step === CERT_STEPS.STEP1 && (
        <ScreenCertSelect bankList={bankList} onSelectBank={handleSelectBank} />
      )}

      {step === CERT_STEPS.STEP2 && (
        <ScreenUser
          user={userInfo}
          selectedBank={selectedBank}
          captchaCode={captchaCode}
          captchaValue={captchaValue}
          onChangeField={handleChangeUserField}
          onChangeCaptcha={setCaptchaValue}
          onRefreshCaptcha={handleRefreshCaptcha}
          onNext={handleStepWait}
          onPrev={() => setStep(CERT_STEPS.STEP1)}
        />
      )}

      {step === CERT_STEPS.STEP3 && (
        <ScreenWait selectedBank={selectedBank} onNext={handleFinishCert} />
      )}
    </div>
  );
};

export default CertFlow;
