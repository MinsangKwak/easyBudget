import "./index.css";
import Screen from "../../../Layout/Screen";
import Title from "../../../Content/Title";
import Subtitle from "../../../Content/SubTitle";
import Inner from "../../../Content/Inner";
import Button from "../../../Form/Button";
import { MdMailOutline } from "react-icons/md";
import { FaIdBadge } from "react-icons/fa";
import BaseButtonContainer from "../../../Form/BaseButtonContainer";
import { FaLock, FaEnvelope, FaIdCard } from "react-icons/fa";

const ScreenJoin = ({ onClickCert, onClickEmail }) => {
  return (
    <Screen className="screen_join">
      <Title>
        안녕하세요 <br/>
        신규 가입을 환영합니다.
      </Title>
      <Subtitle>
        로그인 방식을 선택해 주세요.
      </Subtitle>
      <Inner>
        <div className="login_hero login_hero--triple" aria-hidden="true">
          <FaEnvelope className="login_hero__side left" />
          <FaLock className="login_hero__icon" />
          <FaIdCard className="login_hero__side right" />
        </div>
        <BaseButtonContainer>
          <Button
            type="button"
            variant="solid__primary"
            onClick={onClickEmail}
          >
            <MdMailOutline aria-hidden="true" />
            일반 회원가입 / GMAIL 연동
          </Button>
          <Button
            type="button"
            variant="line__black"
            onClick={onClickCert}
          >
            <FaIdBadge aria-hidden="true" />
            사용하는 금융인증서로 가입
          </Button>
        </BaseButtonContainer>
      </Inner>
    </Screen>
  );
};

export default ScreenJoin;
