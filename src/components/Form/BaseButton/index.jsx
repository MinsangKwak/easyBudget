import "./index.css";

const SIZE_CLASSNAMES = {
  sm: "btn_sm",
  md: "btn_md",
};

const normalizeStyles = (style) => {
  const styleList = Array.isArray(style) ? style : style ? [style] : [];

  return styleList
    .flatMap((value) => value.split(" ").filter(Boolean))
    .map((value) => (value.startsWith("btn_") ? value : `btn_${value}`));
};

const BaseButton = ({
  type = "button",
  style = "",
  size,
  className = "",
  onClick,
  children,
  ...rest
}) => {
  const sizeClassName = size ? SIZE_CLASSNAMES[size] ?? `btn_${size}` : "";
  const styleClassNames = normalizeStyles(style);
  const composedClassName = ["btn", sizeClassName, ...styleClassNames, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={composedClassName}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default BaseButton;
