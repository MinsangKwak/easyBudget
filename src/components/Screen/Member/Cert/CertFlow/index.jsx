import "./index.css";
import { useMemo, useState } from "react";
import ScreenCertSelect from "../ScreenCertSelect";
import ScreenUser from "../ScreenUser";
import ScreenWait from "../ScreenWait";
import { bankList } from "../../../../../constants/bankList";

const CERT_STEPS = {
  STEP1: "CERT_SELECT",
  STEP2: "USER",
  STEP3: "WAIT",
};

const VALID_USER = {
  name: "홍길동",
  birth: "1990-01-01",
  phone: "010-1234-5678",
};

const EMPTY_USER = {
  name: "",
  birth: "",
  phone: "",
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
  const [userInfo, setUserInfo] = useState(EMPTY_USER);
  const [validatedUser, setValidatedUser] = useState(null);
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaCode, setCaptchaCode] = useState(generateCaptchaCode);
  const [errorMessage, setErrorMessage] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);

  const requiresCaptcha = useMemo(() => attemptCount >= 4, [attemptCount]);

  const handleChangeUserField = (field, value) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
    setErrorMessage("");
  };

  const handleSelectBank = (bankKey) => {
    setSelectedBank(bankList[bankKey]);
    setCaptchaCode(generateCaptchaCode());
    setCaptchaValue("");
    setUserInfo(EMPTY_USER);
    setValidatedUser(null);
    setErrorMessage("");
    setAttemptCount(0);
    setStep(CERT_STEPS.STEP2);
  };

  const handleStepWait = () => {
    const normalizeDigits = (value) => value.replace(/\D/g, "");
    const normalizedUser = {
      name: userInfo.name.trim(),
      birth: normalizeDigits(userInfo.birth),
      phone: normalizeDigits(userInfo.phone),
    };

    const isUserValid =
      normalizedUser.name === VALID_USER.name &&
      normalizedUser.birth === normalizeDigits(VALID_USER.birth) &&
      normalizedUser.phone === normalizeDigits(VALID_USER.phone);

    if (!isUserValid) {
      setErrorMessage("입력하신 정보가 테스트 정보와 일치하지 않습니다.");
      setAttemptCount((prev) => {
        const next = prev + 1;

        if (next === 4) {
          setCaptchaCode(generateCaptchaCode());
          setCaptchaValue("");
        }

        return next;
      });
      return;
    }

    if (requiresCaptcha) {
      const isCaptchaValid = captchaValue.trim().toUpperCase() === captchaCode.toUpperCase();

      if (!isCaptchaValid) {
        setErrorMessage("보안문자를 정확히 입력해주세요.");
        setCaptchaCode(generateCaptchaCode());
        setCaptchaValue("");
        setAttemptCount((prev) => prev + 1);
        return;
      }
    }

    setErrorMessage("");
    setAttemptCount(0);
    setCaptchaValue("");
    setCaptchaCode(generateCaptchaCode());
    setValidatedUser({
      name: userInfo.name.trim(),
      birth: userInfo.birth.trim(),
      phone: userInfo.phone.trim(),
    });
    setStep(CERT_STEPS.STEP3);
  };

  const handleFinishCert = () => {
    onComplete?.({
      bank: selectedBank,
      user: validatedUser ?? userInfo,
    });
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
    <>
      {step === CERT_STEPS.STEP1 && (
        <ScreenCertSelect bankList={bankList} onSelectBank={handleSelectBank} />
      )}

      {step === CERT_STEPS.STEP2 && (
        <ScreenUser
          user={userInfo}
          selectedBank={selectedBank}
          captchaCode={captchaCode}
          captchaValue={captchaValue}
          showCaptcha={requiresCaptcha}
          errorMessage={errorMessage}
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
    </>
  );
};

export default CertFlow;
