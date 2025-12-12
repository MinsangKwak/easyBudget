import "./index.css";
import Screen from "../../Layout/Screen";
import Title from "../../Content/Title";
import Inner from "../../Content/Inner";
import LottieIcon from "../../Common/LottieIcon";
import { LOTTIE_SOURCES } from "../../../constants/lottieSources";

const ScreenMain = () => {
  return (
    <Screen>
      <div className="screen_visual">
        <LottieIcon
          src={LOTTIE_SOURCES.socialOrbit}
          ariaLabel="메인 대시보드 애니메이션"
          size={150}
        />
      </div>
      <Title>메인페이지 입니다.</Title>
      <Inner>
        <p className="main_body">대시보드 콘텐츠를 이곳에 배치하세요.</p>
      </Inner>
    </Screen>
  );
};

export default ScreenMain;
