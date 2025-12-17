import "./index.css";

import { useState } from "react";

import Screen from "../../../Layout/Screen";
import Title from "../../../Content/Title";
import Subtitle from "../../../Content/SubTitle";
import Inner from "../../../Content/Inner";
import Button from "../../../Form/Button";
import BaseButtonContainer from "../../../Form/BaseButtonContainer";
import ErrorMessage from "../../../Form/ErrorMessage";

const ScreenLogin = ({ onSignUpComplete }) => {
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

  const handleGmailConnect = () => {
    setError("");
    onSignUpComplete?.();
  };

  return (
    <Screen className="screen_join__email">
      <Title>
        로그인
      </Title>
      <Subtitle>
        정보를 입력해주세요.
      </Subtitle>
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

          {error && <ErrorMessage aria-live="polite">{error}</ErrorMessage>}

          <BaseButtonContainer>
            <Button type="submit" variant="solid__primary" className="btn_email_join_submit">
              로그인
            </Button>
            <Button type="submit" variant="solid__primary" className="btn_email_join_submit">
              계정이 없으시다면 여기로 회원가입
            </Button>
          </BaseButtonContainer>
        </form>
      </Inner>
    </Screen>
  );
};

export default ScreenLogin;
