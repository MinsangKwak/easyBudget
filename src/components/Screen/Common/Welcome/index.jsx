import "./index.css";
import { useEffect, useState } from "react";
import Screen from "../../../Layout/Screen";
import Title from "../../../Content/Title";
import Subtitle from "../../../Content/SubTitle";
import Inner from "../../../Content/Inner";
import BaseButton from "../../../Form/BaseButton";
import BaseButtonContainer from "../../../Form/BaseButtonContainer";

import IconLock from "../../../Common/IconLock";

const ScreenWelcome = ({ onTimeout }) => {
  const INITIAL_SECONDS = 2;
  const [seconds, setSeconds] = useState(INITIAL_SECONDS);

  useEffect(() => {
    setSeconds(INITIAL_SECONDS);

    const intervalId = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const timeoutId = setTimeout(() => {
      onTimeout?.();
    }, INITIAL_SECONDS * 1000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [onTimeout]);

  return (
    <Screen className="screen_welcome">
      <Title>가입을 환영합니다.</Title>
      <Subtitle>잠시만 기다려 주세요.</Subtitle>
      <Inner>
        <IconLock />
        <p className="welcome_message">{seconds}초 후 메인 페이지로 이동합니다.</p>
        <BaseButtonContainer>
          <BaseButton type="button" size="md" style="solid__primary" onClick={onTimeout}>
            메인으로 이동
          </BaseButton>
        </BaseButtonContainer>
      </Inner>
    </Screen>
  );
};

export default ScreenWelcome;
