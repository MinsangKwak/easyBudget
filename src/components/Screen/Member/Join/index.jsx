import "./index.css";
import Screen from "../../../Layout/Screen";
import Title from "../../../Content/Title";
import Inner from "../../../Content/Inner";
import Button from "../../../Form/Button";

const ScreenJoin = ({ onClickCert, onClickEmail, onClickGoogle }) => {
  return (
    <Screen className="screen_join">
      <Title>어떤 방식으로 진행할까요?</Title>

      <Inner>
        <ul className="join_method_list">
          <li>
            <Button
              type="button"
              variant="solid__primary"
              onClick={onClickEmail}
            >
              일반 회원가입
            </Button>
          </li>

          <li>
            <Button
              type="button"
              variant="line__black"
              onClick={onClickGoogle}
            >
              Google 계정으로 가입하기
            </Button>
          </li>

          <li>
            <Button
              type="button"
              variant="line__primary"
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
