import "./index.css";
import BaseButton from "../BaseButton";
import { IoIosCloseCircleOutline } from "react-icons/io";

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
  disabled = false,
}) => {
  const showClear = !!value && value.length > 0 && !disabled;

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
      <label htmlFor={id} className="form_label">
        {label}
      </label>
      <div className="input_container">
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
          disabled={disabled}
        />
        <BaseButton
          type="button"
          style={["inline", "ghost"]}
          className="form_field__clear"
          aria-label="입력 지우기"
          hidden={!showClear}
          onClick={handleClickClear}
          disabled={disabled}
        >
          <IoIosCloseCircleOutline aria-hidden="true" />
        </BaseButton>
      </div>
    </div>
  );
};

export default FormFieldInput;
