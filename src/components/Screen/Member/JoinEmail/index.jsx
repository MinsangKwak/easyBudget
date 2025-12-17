import "./index.css";

import { useState } from "react";

import Screen from "../../../Layout/Screen";
import Title from "../../../Content/Title";
import Subtitle from "../../../Content/SubTitle";
import Inner from "../../../Content/Inner";
import Button from "../../../Form/Button";
import BaseButtonContainer from "../../../Form/BaseButtonContainer";
import ErrorMessage from "../../../Form/ErrorMessage";
import FormFieldInput from "../../../Form/FormFieldInput";
import FormFieldWrapper from "../../../Form/FormFieldWrapper";

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

  const handleGmailConnect = () => {
    setError("");
    onSignUpComplete?.();
  };

  return (
    <Screen className="screen_join__email">
      <Title>
        회원가입
      </Title>
      <Subtitle>
        일반 회원가입 / G-Mail연동
      </Subtitle>
      <Inner>
        <form className="form_email_join" onSubmit={handleSubmit}>
          <FormFieldWrapper>
            <FormFieldInput
              id="email"
              type="email"
              label="이메일"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <FormFieldInput
              id="password"
              type="password"
              label="비밀번호"
              placeholder="비밀번호 (8자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <FormFieldInput
              id="password_confirm"
              type="password"
              label="비밀번호 확인"
              placeholder="비밀번호를 한 번 더 입력해주세요"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </FormFieldWrapper>

          {error && <ErrorMessage aria-live="polite">{error}</ErrorMessage>}

          <BaseButtonContainer>
            <Button type="submit" variant="solid__primary" className="btn_email_join_submit">
              이메일로 가입하기
            </Button>
            <span className="spacer">또는</span>
            <Button
              type="button"
              variant="line__black"
              className="btn_email_join_submit"
              onClick={handleGmailConnect}
            >
              빠르게 GMAIL 연동하기
            </Button>
          </BaseButtonContainer>
        </form>
      </Inner>
    </Screen>
  );
};

export default ScreenJoinEmail;
