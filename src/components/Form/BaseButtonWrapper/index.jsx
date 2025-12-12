import "./index.css";

const BaseButtonWrapper = ({ className = "", children }) => {
  return <div className={`btn_wrapper ${className}`.trim()}>{children}</div>;
};

export default BaseButtonWrapper;
