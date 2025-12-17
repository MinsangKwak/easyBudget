import "./index.css";
import Button from "../Button";
import { IoRefreshCircleOutline } from "react-icons/io5";
import { HiMiniSpeakerWave } from "react-icons/hi2";


import FormFieldInput from "../FormFieldInput";

const FormCaptcha = ({
  code,
  value,
  onChange,
  onRefresh,
  onAudioClick,
}) => {
  const handleChange = (event) => {
    onChange?.(event.target.value);
  };

  const handleRefresh = () => {
    onRefresh?.();
  };

  const handleAudio = () => {
    onAudioClick?.();
  };

  return (
    <div className="form_captcha">
      <div className="form_captcha__box">
        <span className="captcha_code" data-initial-code={code}>
          {code}
        </span>

        <Button
          type="button"
          className="btn_captcha"
          data-captcha-refresh
          onClick={handleRefresh}
        >
        <IoRefreshCircleOutline />

          새로고침
        </Button>

        <Button
          type="button"
          className="btn_captcha"
          data-captcha-audio
          onClick={handleAudio}
        >
            <HiMiniSpeakerWave />

          음성듣기
        </Button>
      </div>

      <FormFieldInput
        id="captcha"
        label="보안문자"
        type="text"
        maxLength={6}
        placeholder=""
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default FormCaptcha;
