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
    const { loginWithEmail, loginWithCertificate } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCertLoading, setIsCertLoading] = useState(false);
    const [certBankName, setCertBankName] = useState("KB국민은행");
    const [certName, setCertName] = useState("");
    const [certPhone, setCertPhone] = useState("");
    const [certBirth, setCertBirth] = useState("");
    const [certError, setCertError] = useState("");
    const loadingTimeoutRef = useRef(null);
    const certLoadingTimeoutRef = useRef(null);

    const resetError = () => setError("");
    const resetCertError = () => setCertError("");

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isLoading || isCertLoading) return;

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

            if (certLoadingTimeoutRef.current) {
                clearTimeout(certLoadingTimeoutRef.current);
            }
        };
    }, []);

    const handleCertificateSubmit = (event) => {
        event.preventDefault();

        if (isCertLoading || isLoading) return;

        const trimmedName = certName.trim();
        const phoneDigits = certPhone.replace(/\D/g, "");
        const birthDigits = certBirth.replace(/\D/g, "");

        if (!trimmedName) {
            setCertError("이름을 입력해주세요.");
            return;
        }

        if (phoneDigits.length < 10 || phoneDigits.length > 11) {
            setCertError("휴대폰 번호를 올바르게 입력해주세요.");
            return;
        }

        if (birthDigits.length !== 8) {
            setCertError("생년월일은 YYYYMMDD 형식으로 입력해주세요.");
            return;
        }

        resetCertError();
        setIsCertLoading(true);

        certLoadingTimeoutRef.current = setTimeout(() => {
            try {
                loginWithCertificate({
                    bankName: certBankName,
                    name: trimmedName,
                    phone: phoneDigits,
                    birth: birthDigits,
                });

                onLoginSuccess?.();
            } catch (certLoginError) {
                console.error(certLoginError);
                setCertError("금융인증서 로그인에 실패했습니다. 다시 시도해주세요.");
            } finally {
                setIsCertLoading(false);
            }
        }, 800);
    };

    const isBusy = isLoading || isCertLoading;

    return (
        <Screen className="screen_join__email">
            <Title>로그인</Title>
            <Subtitle>정보를 입력해주세요.</Subtitle>
            <Inner>
                {isBusy ? (
                    <ScreenLoading message={isLoading ? "로그인 중입니다." : "금융인증서 로그인 중입니다."} />
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
            <Title>은행 인증서 로그인</Title>
            <Subtitle>인증서를 선택 후 개인정보와 추가정보를 입력해주세요.</Subtitle>
            <Inner>
                <form className="form_email_join" onSubmit={handleCertificateSubmit}>
                    <label className="form_field__label" htmlFor="cert_bank">
                        인증서 선택
                    </label>
                    <select
                        id="cert_bank"
                        value={certBankName}
                        onChange={(e) => setCertBankName(e.target.value)}
                        disabled={isBusy}
                        className="cert_bank_select"
                    >
                        <option value="KB국민은행">KB국민은행</option>
                        <option value="신한은행">신한은행</option>
                        <option value="우리은행">우리은행</option>
                        <option value="농협은행">농협은행</option>
                    </select>

                    <FormFieldWrapper>
                        <FormFieldInput
                            id="cert_name"
                            type="text"
                            label="이름"
                            placeholder="홍길동"
                            value={certName}
                            onChange={(e) => setCertName(e.target.value)}
                            disabled={isBusy}
                        />
                        <FormFieldInput
                            id="cert_birth"
                            type="text"
                            label="생년월일"
                            placeholder="YYYYMMDD"
                            value={certBirth}
                            onChange={(e) => setCertBirth(e.target.value)}
                            disabled={isBusy}
                        />
                        <FormFieldInput
                            id="cert_phone"
                            type="text"
                            label="휴대폰번호"
                            placeholder="01012345678"
                            value={certPhone}
                            onChange={(e) => setCertPhone(e.target.value)}
                            disabled={isBusy}
                        />
                    </FormFieldWrapper>

                    {certError && <ErrorMessage aria-live="polite">{certError}</ErrorMessage>}

                    <BaseButtonContainer>
                        <BaseButton
                            type="submit"
                            size="md"
                            style="solid__primary"
                            disabled={isBusy}
                        >
                            금융인증서로 로그인
                        </BaseButton>
                    </BaseButtonContainer>
                </form>
            </Inner>
        </Screen>
    );
};

export default ScreenLogin;
