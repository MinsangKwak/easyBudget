import "./index.css";

const Subtitle = ({ className = "", children }) => {
  return <p className={`sub_title ${className}`.trim()}>{children}</p>;
};

export default Subtitle;
