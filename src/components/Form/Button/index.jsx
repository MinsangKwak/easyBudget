import BaseButton from "../BaseButton";
import "../BaseButton/index.css";

const Button = ({ style = "", size, className = "", children, ...props }) => {
  return (
    <BaseButton style={style} size={size} className={className} {...props}>
      {children}
    </BaseButton>
  );
};

export default Button;
