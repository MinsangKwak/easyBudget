import "./index.css";
import BaseButton from "../../Form/BaseButton";
import Screen from "../../Layout/Screen";
import Title from "../../Content/Title";
import Inner from "../../Content/Inner";

import Subtitle from "../../Content/SubTitle";
// import LottieIcon from "../../Common/LottieIcon";
// import { LOTTIE_SOURCES } from "../../../constants/lottieSources";

const ScreenIntro = ({ onClickLoginEmail, onClickLoginCertificate, onClickGoJoin }) => {
  return (
    <Screen className="screen_main">
      {/* <div className="screen_visual">
        <LottieIcon
          src={LOTTIE_SOURCES.introPulse}
          ariaLabel="인증 안내 애니메이션"
        />
      </div> */}
      <Title>
        로그인 방식을
        <br />
        선택해주세요
      </Title>
      <Subtitle>시작하기 전에 로그인 방식을 먼저 선택해주세요.</Subtitle>
      <Inner>
        <p className="intro_text">원하시는 방식으로 로그인/회원가입을 진행해주세요.</p>
        <BaseButton
          type="button"
          style="solid__primary"
          className="btn_intro_action"
          onClick={onClickLoginEmail}
        >
          이메일로 로그인하기
        </BaseButton>
        <BaseButton
          type="button"
          style="outline__black"
          className="btn_intro_action"
          onClick={onClickLoginCertificate}
        >
          금융인증서로 로그인하기
        </BaseButton>
        <BaseButton
          type="button"
          style="line__black"
          className="btn_intro_action"
          onClick={onClickGoJoin}
        >
          아직 계정이 없으신가요? 회원가입
        </BaseButton>
      </Inner>
    </Screen>
  );
};

export default ScreenIntro;
