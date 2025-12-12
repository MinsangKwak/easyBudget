import "./index.css";

const Inner = ({ className = "", children }) => {
  return <div className={`content_inner ${className}`.trim()}>{children}</div>;
};

export default Inner;
