import "./index.css";

const Loading = ({ message = "화면을 불러오고 있습니다." }) => {
  return (
    <div className="loading_state" role="status" aria-live="polite">
      <div className="loading_spinner" />
      <p className="loading_message">{message}</p>
    </div>
  );
};

export default Loading;
