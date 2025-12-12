import "./index.css";
import Button from "../Button";

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
    if (onChange) {
      onChange({ target: { value: "" } });
    }

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
      <Button
        type="button"
        className="btn_inline btn_ghost form_field__clear"
        aria-label="입력 지우기"
        hidden={!showClear}
        onClick={handleClickClear}
      >
        입력 값 지우기
      </Button>
    </div>
  );
};

export default FormFieldInput;
