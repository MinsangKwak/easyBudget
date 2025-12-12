import "./index.css";
import LottieIcon from "../LottieIcon";
import { LOTTIE_SOURCES } from "../../../constants/lottieSources";

const Loading = ({ message = "화면을 불러오고 있습니다." }) => {
  return (
    <div className="loading_state" role="status" aria-live="polite">
      <LottieIcon
        className="loading_lottie"
        src={LOTTIE_SOURCES.loaderOrbit}
        ariaLabel="로딩 중"
        size={128}
      />
      <p className="loading_message">{message}</p>
    </div>
  );
};

export default Loading;
