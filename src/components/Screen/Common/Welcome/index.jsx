import "./index.css";
import { useState, useEffect } from "react";
import Screen from "../../../Layout/Screen";
import Title from "../../../Content/Title";
import Inner from "../../../Content/Inner";

const ScreenWelcome = ({ onTimeout }) => {
  const [seconds, setSeconds] = useState(2);

  useEffect(() => {
    if (seconds <= 0) {
      onTimeout?.();
      return;
    }

    const timerId = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [seconds, onTimeout]);

  return (
    <Screen className="screen_welcome">
      <Title>가입을 환영합니다.</Title>
      <Inner>
        <p className="welcome_message">
          {seconds}초 후 메인 페이지로 이동합니다.
        </p>
      </Inner>
    </Screen>
  );
};

export default ScreenWelcome;
