import BaseButton from "../BaseButton";
import "../BaseButton/index.css";

const Button = ({ variant = "", className = "", children, ...props }) => {
  const variantClass = variant ? `btn_${variant}` : "";
  return (
    <BaseButton className={`${variantClass} ${className}`.trim()} {...props}>
      {children}
    </BaseButton>
  );
};

export default Button;
