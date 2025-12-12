import "./index.css";
import Button from "../../Form/Button";
import Screen from "../../Layout/Screen";
import Title from "../../Content/Title";
import Inner from "../../Content/Inner";
import LottieIcon from "../../Common/LottieIcon";
import { LOTTIE_SOURCES } from "../../../constants/lottieSources";

const ScreenIntro = ({ onClickGoJoin }) => {
  return (
    <Screen className="screen_main">
      <div className="screen_visual">
        <LottieIcon
          src={LOTTIE_SOURCES.introPulse}
          ariaLabel="인증 안내 애니메이션"
        />
      </div>
      <Title>환영합니다.</Title>
      <Inner>
        <p className="intro_text">
          원하시는 방식으로 로그인/회원가입을 진행해주세요.
        </p>
        <Button
          type="button"
          variant="solid__primary"
          onClick={onClickGoJoin}
        >
          회원가입 / 로그인 하러가기
        </Button>
      </Inner>
    </Screen>
  );
};

export default ScreenIntro;
