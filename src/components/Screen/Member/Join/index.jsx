import "./index.css";
import Screen from "../../../Layout/Screen";
import Title from "../../../Content/Title";
import Inner from "../../../Content/Inner";
import Button from "../../../Form/Button";
// import LottieIcon from "../../../Common/LottieIcon";
// import { LOTTIE_SOURCES } from "../../../../constants/lottieSources";

const ScreenJoin = ({ onClickCert, onClickEmail }) => {
  return (
    <Screen className="screen_join">
      {/* <div className="screen_visual">
        <LottieIcon
          src={LOTTIE_SOURCES.joinGlow}
          ariaLabel="가입 방식 선택 애니메이션"
        />
      </div> */}
      <Title>로그인 방식을 <br/>선택해 주세요.</Title>

      <Inner>
        <ul className="list">
          <li>
            <Button
              type="button"
              variant="solid__primary"
              onClick={onClickEmail}
            >
              이메일로 가입하기
            </Button>
          </li>

          <li>
            <Button
              type="button"
              variant="line__black"
              onClick={onClickCert}
            >
              금융인증서로 가입하기
            </Button>
          </li>
        </ul>
      </Inner>
    </Screen>
  );
};

export default ScreenJoin;
