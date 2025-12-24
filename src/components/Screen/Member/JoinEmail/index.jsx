import "./index.css";

import { useEffect, useRef, useState } from "react";

import Screen from "../../../Layout/Screen";
import Title from "../../../Content/Title";
import Subtitle from "../../../Content/SubTitle";
import Inner from "../../../Content/Inner";
import BaseButton from "../../../Form/BaseButton";
import BaseButtonContainer from "../../../Form/BaseButtonContainer";
import ErrorMessage from "../../../Form/ErrorMessage";
import FormFieldInput from "../../../Form/FormFieldInput";
import FormFieldWrapper from "../../../Form/FormFieldWrapper";
import { useAuth } from "../../../../contexts/AuthContext";
import ScreenLoading from "../../Common/Loading";

const ScreenJoinEmail = ({ onSignUpComplete }) => {
  const { registerEmailUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  const handleRegister = (payload, { duplicateMessage, genericMessage }) => {
    if (isSubmitting) return;
    setError("");
    setIsSubmitting(true);

    submitTimeoutRef.current = setTimeout(() => {
      try {
        registerEmailUser(payload);
        onSignUpComplete?.();
      } catch (registerError) {
        if (registerError.message === "DUPLICATE_ACCOUNT") {
          setError(duplicateMessage);
        } else {
          setError(genericMessage);
        }
      } finally {
        setIsSubmitting(false);
      }
    }, 800);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isSubmitting) return;

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

    handleRegister(
      { email, password, connectionType: "email" },
      {
        duplicateMessage: "이미 가입된 이메일입니다. 로그인해주세요.",
        genericMessage: "가입에 실패했습니다. 잠시 후 다시 시도해주세요.",
      },
    );
  };

  const handleGmailConnect = () => {
    if (isSubmitting) return;

    if (!email) {
      setError("G-Mail 연동을 위해 이메일을 입력해주세요.");
      return;
    }

    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setError("G-Mail 연동은 @gmail.com 주소로만 가능합니다.");
      return;
    }

    const nextPassword = password.length >= 8 ? password : "gmail-connect";

    handleRegister(
      { email, password: nextPassword, connectionType: "gmail" },
      {
        duplicateMessage: "이미 G-Mail로 가입된 계정입니다.",
        genericMessage: "G-Mail 연동에 실패했습니다. 잠시 후 다시 시도해주세요.",
      },
    );
  };

  if (isSubmitting) {
    return <ScreenLoading message="가입 처리 중입니다. 잠시만 기다려 주세요." />;
  }

  return (
    <Screen className="screen_join__email">
      <Title>회원가입</Title>
      <Subtitle>일반 회원가입 / G-Mail연동</Subtitle>
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
              disabled={isSubmitting}
            />

            <FormFieldInput
              id="password"
              type="password"
              label="비밀번호"
              placeholder="비밀번호 (8자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />

            <FormFieldInput
              id="password_confirm"
              type="password"
              label="비밀번호 확인"
              placeholder="비밀번호를 한 번 더 입력해주세요"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              disabled={isSubmitting}
            />
          </FormFieldWrapper>

          {error && <ErrorMessage aria-live="polite">{error}</ErrorMessage>}

          <BaseButtonContainer>
            <BaseButton
              type="submit"
              size="md"
              style="solid__primary"
              className="btn_email_join_submit"
              disabled={isSubmitting}
            >
              이메일로 가입하기
            </BaseButton>
            <span className="spacer">또는</span>
            <BaseButton
              type="button"
              size="md"
              style="line__black"
              className="btn_email_join_submit"
              onClick={handleGmailConnect}
              disabled={isSubmitting}
            >
              빠르게 GMAIL 연동하기
            </BaseButton>
          </BaseButtonContainer>
        </form>
      </Inner>
    </Screen>
  );
};

export default ScreenJoinEmail;
