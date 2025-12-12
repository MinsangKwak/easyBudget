import "./index.css";
import { useState } from "react";
import Screen from "../../../Layout/Screen";
import Title from "../../../Content/Title";
import Inner from "../../../Content/Inner";
import Button from "../../../Form/Button";
import ErrorMessage from "../../../Form/ErrorMessage";
import LottieIcon from "../../../Common/LottieIcon";
import { LOTTIE_SOURCES } from "../../../../constants/lottieSources";

const ScreenJoinEmail = ({ onSignUpComplete }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.includes("@")) {
      setError("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setError("");
    onSignUpComplete?.();
  };

  return (
    <Screen className="screen_email_join">
      <div className="screen_visual">
        <LottieIcon
          src={LOTTIE_SOURCES.emailWave}
          ariaLabel="이메일 가입 애니메이션"
          size={152}
        />
      </div>
      <Title>이메일로 회원가입</Title>

      <Inner>
        <form className="form_email_join" onSubmit={handleSubmit}>
          <div className="form_field input_wrapper">
            <div className="input_container">
              <label htmlFor="email" className="form_label">
                이메일
              </label>
              <input
                id="email"
                type="email"
                className="form_field__input"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form_field input_wrapper">
            <div className="input_container">
              <label htmlFor="password" className="form_label">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                className="form_field__input"
                placeholder="비밀번호 (8자 이상)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form_field input_wrapper">
            <div className="input_container">
              <label htmlFor="password_confirm" className="form_label">
                비밀번호 확인
              </label>
              <input
                id="password_confirm"
                type="password"
                className="form_field__input"
                placeholder="비밀번호를 한 번 더 입력해주세요"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
          </div>

          {error && <ErrorMessage aria-live="polite">{error}</ErrorMessage>}

          <div className="btn_container">
            <Button type="submit" variant="solid__primary" className="btn_email_join_submit">
              이메일로 가입하기
            </Button>
          </div>
        </form>
      </Inner>
    </Screen>
  );
};

export default ScreenJoinEmail;
