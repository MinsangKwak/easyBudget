// components/Base/FormFieldInput.jsx

// props
// - id, label, value, onChange, onFocus
// - type, minLength, maxLength, inputMode, placeholder
// - wrapperClassName: 기본 "form_field input_wrapper"
const FormFieldInput = ({
  id,
  label,
  value,
  onChange,
  onFocus,
  type = "text",
  minLength,
  maxLength,
  inputMode,
  placeholder,
  wrapperClassName = "form_field input_wrapper",
}) => {
  const showClear = !!value && value.length > 0;

  const handleClickClear = () => {
    // 기존처럼 event 형태 흉내내서 전달
    if (onChange) {
      onChange({ target: { value: "" } });
    }

    // 포커스 다시 input으로
    const inputEl = document.getElementById(id);
    if (inputEl) {
      inputEl.focus();
    }
  };

  return (
    <div className={wrapperClassName}>
      <div className="input_container">
        <label htmlFor={id} className="form_label">
          {label}
        </label>
        <input
          id={id}
          type={type}
          className="form_field__input"
          minLength={minLength}
          maxLength={maxLength}
          inputMode={inputMode}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
        />
      </div>
      <button
        type="button"
        className="form_field__clear"
        aria-label="입력 지우기"
        hidden={!showClear}
        onClick={handleClickClear}
      >
        입력 값 지우기
      </button>
    </div>
  );
};

export default FormFieldInput;
