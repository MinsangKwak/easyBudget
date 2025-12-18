import "./index.css";

import { useEffect, useRef, useState } from "react";

import Screen from "../../../Layout/Screen";
import Title from "../../../Content/Title";
import Subtitle from "../../../Content/SubTitle";
import Inner from "../../../Content/Inner";
import BaseButton from "../../../Form/BaseButton";
import BaseButtonContainer from "../../../Form/BaseButtonContainer";
import ErrorMessage from "../../../Form/ErrorMessage";
import ScreenLoading from "../../Common/Loading";
import FormFieldInput from "../../../Form/FormFieldInput";
import FormFieldWrapper from "../../../Form/FormFieldWrapper";
import { useAuth } from "../../../../contexts/AuthContext";

const ScreenLogin = ({ onLoginSuccess, onClickSignUp }) => {
  const { loginWithEmail } = useAuth();
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
      try {
        loginWithEmail(email, password);
        onLoginSuccess?.();
      } catch (loginError) {
        if (loginError.message === "ACCOUNT_NOT_FOUND") {
          setError("가입된 이메일이 아닙니다. 회원가입을 진행해주세요.");
        } else if (loginError.message === "INVALID_PASSWORD") {
          setError("비밀번호가 일치하지 않습니다.");
        } else if (loginError.message === "BANK_CERT_REQUIRED") {
          setError("은행인증서 계정입니다. 금융인증서 로그인으로 진행해주세요.");
        } else {
          setError("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
      } finally {
        setIsLoading(false);
      }
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
              <BaseButton
                type="submit"
                size="md"
                style="solid__primary"
                disabled={isLoading}
              >
                로그인
              </BaseButton>
              <span className="spacer">또는</span>
              <BaseButton
                type="button"
                size="md"
                style="outline__black"
                onClick={handleClickSignUp}
                disabled={isLoading}
              >
                계정이 없으시다면 여기로 회원가입
              </BaseButton>
            </BaseButtonContainer>
          </form>
        )}
      </Inner>
    </Screen>
  );
};

export default ScreenLogin;
