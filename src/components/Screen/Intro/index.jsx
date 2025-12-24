import "./index.css";
import BaseButton from "../../Form/BaseButton";
import BaseButtonContainer from "../../Form/BaseButtonContainer";
import Screen from "../../Layout/Screen";
import Title from "../../Content/Title";
import Inner from "../../Content/Inner";

import Subtitle from "../../Content/SubTitle";

import IconLock from "../../../components/Common/IconLock";
const ScreenIntro = ({ onClickLoginEmail, onClickLoginCertificate, onClickGoJoin }) => {
  return (
    <Screen className="screen_intro">
      <Title>시작하기</Title>
      <Subtitle>로그인 방식을 먼저 선택해주세요.</Subtitle>
      <Inner>
        <IconLock />
        <BaseButtonContainer>
          <BaseButton
            type="button"
            size="md"
            style="solid__primary"
            className="btn_intro_action"
            onClick={onClickLoginEmail}
          >
            이메일로 로그인하기
          </BaseButton>
          <BaseButton
            type="button"
            size="md"
            style="outline__black"
            className="btn_intro_action"
            onClick={onClickLoginCertificate}
          >
            금융인증서로 로그인하기
          </BaseButton>
          <span className="spacer">또는</span>
          <BaseButton
            type="button"
            size="md"
            style="line__black"
            className="btn_intro_action"
            onClick={onClickGoJoin}
          >
            아직 계정이 없으신가요? 회원가입
          </BaseButton>
        </BaseButtonContainer>
      </Inner>
    </Screen>
  );
};

export default ScreenIntro;
