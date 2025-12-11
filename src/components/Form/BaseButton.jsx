// BaseButton.jsx
const BaseButton = ({
  type = "button",
  className = "",
  onClick,
  children,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`btn ${className}`.trim()}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default BaseButton;
