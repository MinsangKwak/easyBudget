// FormCaptcha.jsx
// import FormFieldInput from "./FormFieldInput";
import FormFieldInput from "./FormFieldInput";
// 🔥 실제 파일 경로에 맞게 수정해야 함

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

        <button
          type="button"
          className="btn_captcha btn_captcha__refresh"
          data-captcha-refresh
          onClick={handleRefresh}
        >
          새로고침
        </button>

        <button
          type="button"
          className="btn_captcha btn_captcha__audio"
          data-captcha-audio
          onClick={handleAudio}
        >
          음성듣기
        </button>
      </div>

      {/* 기존 프로젝트의 입력 UI를 그대로 활용 */}
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
