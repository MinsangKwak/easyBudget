import "./index.css";

const Title = ({ className = "", children }) => {
  return (
    <h2 className={`content_title ${className}`.trim()}>
      <span className="title_inner">{children}</span>
    </h2>
  );
};

export default Title;
