import "./index.css";

import { useEffect, useRef, useState } from "react";

import Screen from "../../../Layout/Screen";
import Title from "../../../Content/Title";
import Subtitle from "../../../Content/SubTitle";
import Inner from "../../../Content/Inner";
import Button from "../../../Form/Button";
import BaseButtonContainer from "../../../Form/BaseButtonContainer";
import ErrorMessage from "../../../Form/ErrorMessage";
import ScreenLoading from "../../Common/Loading";
import FormFieldInput from "../../../Form/FormFieldInput";
import FormFieldWrapper from "../../../Form/FormFieldWrapper";

const ScreenLogin = ({ onLoginSuccess, onClickSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeoutRef = useRef(null);

  const resetError = () => setError("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isLoading) return;

    if (!email.includes("@")) {
      setError("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    setError("");
    setIsLoading(true);

    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess?.();
    }, 1000);
  };

  const handleClickSignUp = () => {
    resetError();
    onClickSignUp?.();
  };

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Screen className="screen_join__email">
      <Title>
        로그인
      </Title>
      <Subtitle>
        정보를 입력해주세요.
      </Subtitle>
      <Inner>
        {isLoading ? (
          <ScreenLoading message="로그인 중입니다." />
        ) : (
          <form className="form_email_join" onSubmit={handleSubmit}>
            <FormFieldWrapper>
              <FormFieldInput
                id="email"
                type="email"
                label="이메일"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <FormFieldInput
                id="password"
                type="password"
                label="비밀번호"
                placeholder="비밀번호 (8자 이상)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </FormFieldWrapper>

            {error && <ErrorMessage aria-live="polite">{error}</ErrorMessage>}

            <BaseButtonContainer>
              <Button
                type="submit"
                size="md"
                style="solid__primary"
                disabled={isLoading}
              >
                로그인
              </Button>
              <span className="spacer">또는</span>
              <Button
                type="button"
                size="md"
                style="outline__black"
                onClick={handleClickSignUp}
                disabled={isLoading}
              >
                계정이 없으시다면 여기로 회원가입
              </Button>
            </BaseButtonContainer>
          </form>
        )}
      </Inner>
    </Screen>
  );
};

export default ScreenLogin;
