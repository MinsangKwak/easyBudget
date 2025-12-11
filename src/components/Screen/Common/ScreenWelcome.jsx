// ScreenWelcome.jsx
import { useState, useEffect } from "react";

const ScreenWelcome = ({ onTimeout }) => {
  const [seconds, setSeconds] = useState(2);

  useEffect(() => {
    if (seconds <= 0) {
      onTimeout && onTimeout();
      return;
    }

    const timerId = setTimeout(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [seconds, onTimeout]);

  return (
    <section className="screen screen_welcome">
      <h2>가입을 환영합니다.</h2>
      <p>{seconds}초 후 메인 페이지로 이동합니다.</p>
    </section>
  );
};

export default ScreenWelcome;
