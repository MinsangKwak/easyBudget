import "./index.css";
import { FiChevronDown } from "react-icons/fi";

const BaseSelectBox = ({
    id,
    label,
    options = [],
    value,
    onChange,
    placeholder,
    disabled = false,
    className = "",
    labelClassName = "",
    ...rest
}) => {
    return (
        <label className={`base_select ${className}`} htmlFor={id}>
            {/* {label && <span className={`base_select__label ${labelClassName}`}>{label}</span>} */}
            <span className="base_select__control">
                <select
                    id={id}
                    className="base_select__field"
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    {...rest}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.key} value={option.key}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <FiChevronDown className="base_select__icon" aria-hidden="true" />
            </span>
        </label>
    );
};

export default BaseSelectBox;
