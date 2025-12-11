// src/components/Screen/Member/Cert/CertFlow.jsx
import { useState } from "react";

import ScreenCertSelect from "./ScreenCertSelect";
import ScreenUser from "./ScreenUser";
import ScreenWait from "./ScreenWait";
import { bankList } from "../../../../constants/bankList"; // 기존 bankList가 있는 위치에 맞춰 수정 필요

const CERT_STEPS = {
  STEP1: "CERT_SELECT",
  STEP2: "USER",
  STEP3: "WAIT",
};

// 데모용 Mock 데이터
const mockUser = {
  name: "홍길동",
  birth: "19900101",
  phone: "01012345678",
};

const CertFlow = ({ onComplete, onExit }) => {
  const [step, setStep] = useState(CERT_STEPS.STEP1);
  const [selectedBank, setSelectedBank] = useState(null);

  const handleSelectBank = (bankKey) => {
    setSelectedBank(bankList[bankKey]);
    setStep(CERT_STEPS.STEP2);
  };

  const handleStepWait = () => {
    setStep(CERT_STEPS.STEP3);
  };

  const handleFinishCert = () => {
    if (onComplete) onComplete(); // ex: App에서 WELCOME 화면 전환
  };

  const handleBack = () => {
    if (step === CERT_STEPS.STEP3) {
      setStep(CERT_STEPS.STEP2);
    } else if (step === CERT_STEPS.STEP2) {
      setStep(CERT_STEPS.STEP1);
    } else if (step === CERT_STEPS.STEP1) {
      if (onExit) onExit(); // ex: JOIN 화면으로 돌아가기
    }
  };

  return (
    <div className="cert_flow_root">
      <button type="button" className="btn_back" onClick={handleBack}>
        뒤로가기
      </button>

      {step === CERT_STEPS.STEP1 && (
        <ScreenCertSelect bankList={bankList} onSelectBank={handleSelectBank} />
      )}

      {step === CERT_STEPS.STEP2 && (
        <ScreenUser
          user={mockUser}
          selectedBank={selectedBank}
          onNext={handleStepWait}
        />
      )}

      {step === CERT_STEPS.STEP3 && (
        <ScreenWait selectedBank={selectedBank} onNext={handleFinishCert} />
      )}
    </div>
  );
};

export default CertFlow;
