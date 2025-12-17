import "./index.css";
import Screen from "../../../Layout/Screen";
import Title from "../../../Content/Title";
import Subtitle from "../../../Content/SubTitle";
import Inner from "../../../Content/Inner";
import Button from "../../../Form/Button";
import { MdMailOutline } from "react-icons/md";
import { FaIdBadge } from "react-icons/fa";
import BaseButtonContainer from "../../../Form/BaseButtonContainer";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";
// import {LOTTIE_SOURCES} from "../../../../constants/lottieSources";

const ScreenJoin = ({ onClickCert, onClickEmail }) => {
  return (
    <Screen className="screen_join">
      
      {/* <div className="join_lottie">
        <DotLottieReact
          src={LOTTIE_SOURCES.intro}
          autoplay
          loop
        />
      </div> */}

      <div class="login_hero" aria-hidden="true">
        <div class="login_mark">
          <span class="lock"></span>
          <span class="pulse_ring"></span>
        </div>

        {/* <div class="login_badges">
          <span class="badge email"></span>
          <span class="badge shield"></span>
          <span class="badge check"></span>
        </div> */}
      </div>


      <Title>
        안녕하세요 :) <br />
        로그인 방식을 선택해 주세요.
      </Title>
      <Subtitle>
        원하시는 방식으로 로그인/회원가입을 진행해주세요.
      </Subtitle>
      <Inner>
        <BaseButtonContainer>
          <Button
            type="button"
            variant="solid__primary"
            onClick={onClickEmail}
          >
            <MdMailOutline aria-hidden="true" />
            이메일로 가입하기 / 빠르게 GMAIL 연동하기
          </Button>
          <Button
            type="button"
            variant="line__black"
            onClick={onClickCert}
          >
            <FaIdBadge aria-hidden="true" />
            금융인증서로 가입하기
          </Button>
        </BaseButtonContainer>
      </Inner>
    </Screen>
  );
};

export default ScreenJoin;
