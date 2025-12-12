import "./index.css";
import Button from "../Button";
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
          className="btn_inline btn_captcha btn_captcha__refresh"
          data-captcha-refresh
          onClick={handleRefresh}
        >
          새로고침
        </Button>

        <Button
          type="button"
          className="btn_inline btn_captcha btn_captcha__audio"
          data-captcha-audio
          onClick={handleAudio}
        >
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
