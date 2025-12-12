import "./index.css";

const ProgressStatus = ({ src, alt = "", children }) => {
  return (
    <div className="progress_status">
      <span className="status_item">
        <img src={src} alt={alt} />
        {children}
      </span>

      <div className="status_background" aria-hidden="true">
        <div className="bg_spinner"></div>
      </div>
    </div>
  );
};

export default ProgressStatus;
