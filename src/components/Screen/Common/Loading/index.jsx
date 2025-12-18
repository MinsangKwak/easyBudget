import "./index.css";
import Screen from "../../../Layout/Screen";
import Title from "../../../Content/Title";
import Subtitle from "../../../Content/SubTitle";
import Inner from "../../../Content/Inner";

import IconLock from "../../../Common/IconLock";

const ScreenLoading = ({ message = "화면을 불러오고 있습니다." }) => {
  return (
    <Screen className="screen_loading">
      <Title>화면을 불러오고 있습니다.</Title>
      <Subtitle>
        잠시만 기다려 주세요.
      </Subtitle>
      <Inner>
        <IconLock />
        <div className="loading_state" role="status" aria-live="polite">
          <p className="loading_message">{message}</p>
        </div>
      </Inner>
    </Screen>
  );
};

export default ScreenLoading;
