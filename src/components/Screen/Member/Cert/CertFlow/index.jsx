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
