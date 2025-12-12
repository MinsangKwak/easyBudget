// 예시: src/components/Screen/Member/Cert/ScreenUser.jsx
import { useState } from "react";

// ⚠️ 아래 import 경로들은 실제 폴더 구조에 맞게 수정해서 사용하세요.
import Screen from "../../../Layout/Screen";
import Title from "../../../Content/Title";
import Inner from "../../../Content/Inner";
import ScreenInnerGrid from "../../../Layout/ScreenInnerGrid";

import BaseButton from "../../../Form/BaseButton";
import BaseButtonContainer from "../../../Form/BaseButtonContainer";
import BaseButtonWrapper from "../../../Form/BaseButtonWrapper";
import ErrorMessage from "../../../Form/ErrorMessage";
import FormFieldInput from "../../../Form/FormFieldInput";
import FormFieldWrapper from "../../../Form/FormFieldWrapper";
import FormCaptcha from "../../../Form/FormCaptcha";

const ScreenUser = ({ user, onNext }) => {
  // user 예시: { name: '홍길동', birth: '19900101', phone: '01012345678' }

  /* [1] 기본 입력값 상태 */
  const [nameInput, setNameInput] = useState("");
  const [birthInput, setBirthInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  const handleChangeName = (event) => {
    setNameInput(event.target.value);
  };

  const handleChangeBirth = (event) => {
    // 1) 숫자만 추출
    let digits = event.target.value.replace(/\D/g, ""); // "1993-01-01" → "19930101"

    // 2) 최대 8자리(YYYYMMDD)까지만 사용
    if (digits.length > 8) {
      digits = digits.slice(0, 8);
    }

    // 3) 길이에 따라 포맷팅
    let formatted = "";
    if (digits.length <= 4) {
      formatted = digits; // "1993"
    } else if (digits.length <= 6) {
      formatted = digits.slice(0, 4) + "-" + digits.slice(4); // "1993-01"
    } else {
      formatted =
        digits.slice(0, 4) + "-" + digits.slice(4, 6) + "-" + digits.slice(6); // "1993-01-01"
    }

    setBirthInput(formatted);
  };

  const handleChangePhone = (event) => {
    // 1) 숫자만 추출
    let digits = event.target.value.replace(/\D/g, ""); // "010-1234-5678" → "01012345678"

    // 2) 최대 11자리까지
    if (digits.length > 11) {
      digits = digits.slice(0, 11);
    }

    let formatted = "";
    if (digits.length <= 3) {
      formatted = digits; // "010"
    } else if (digits.length <= 7) {
      formatted = digits.slice(0, 3) + "-" + digits.slice(3); // "010-1234"
    } else {
      formatted =
        digits.slice(0, 3) +
        "-" +
        digits.slice(3, 7) +
        "-" +
        digits.slice(7); // "010-1234-5678"
    }

    setPhoneInput(formatted);
  };

  /* [2] 타이틀 상태 */
  const [current, setCurrent] = useState("name");

  const handleFocusName = () => {
    setCurrent("name");
  };
  const handleFocusBirth = () => {
    setCurrent("birth");
  };
  const handleFocusPhone = () => {
    setCurrent("phone");
  };

  /* [3] 에러 / 시도 횟수 / 캡챠 필요 여부 */
  const [hasError, setHasError] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const generateCaptchaCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";

    let result = "";

    for (let i = 0; i < 3; i++) {
      const idx = Math.floor(Math.random() * letters.length);
      result += letters[idx];
    }
    for (let i = 0; i < 2; i++) {
      const idx = Math.floor(Math.random() * digits.length);
      result += digits[idx];
    }

    return result;
  };

  /* [4] 캡챠 상태 */
  const [captchaCode, setCaptchaCode] = useState(() => generateCaptchaCode());
  const [captchaInput, setCaptchaInput] = useState("");

  // 시도 4번 이상이면 캡챠 필요
  const isCaptchaRequired = attemptCount >= 4;

  const handleClickCaptchaRefresh = () => {
    setCaptchaCode(generateCaptchaCode());
    setCaptchaInput("");
  };

  const validateUserFields = () => {
    const normalizedBirth = birthInput.replace(/-/g, ""); // 1990-01-01 → 19900101
    const normalizedPhone = phoneInput.replace(/-/g, ""); // 010-1234-5678 → 01012345678

    const isNameValid = nameInput === user.name;
    const isBirthValid = normalizedBirth === user.birth;
    const isPhoneValid = normalizedPhone === user.phone;

    return isNameValid && isBirthValid && isPhoneValid;
  };

  const validateCaptcha = () => {
    const normalizedInput = captchaInput.trim().toUpperCase();
    return normalizedInput === captchaCode;
  };

  const handleClickAuthRequest = () => {
    console.log("인증요청 버튼 클릭");

    const isUserValid = validateUserFields();

    // 1) 사용자 정보가 틀린 경우
    if (!isUserValid) {
      setHasError(true);
      setCurrent("error");
      setAttemptCount((prev) => prev + 1); // 틀릴 때만 카운트 증가
      return;
    }

    // 2) 사용자 정보는 맞지만, 캡챠가 필요한 상태인 경우
    if (isCaptchaRequired) {
      const isCaptchaValid = validateCaptcha();

      if (!isCaptchaValid) {
        setHasError(true);
        setCurrent("error");
        return;
      }
    }

    // 3) 모두 통과
    setHasError(false);
    setCurrent("confirm");
    setAttemptCount(0);
    setCaptchaInput("");
    setCaptchaCode(generateCaptchaCode());

    onNext?.(); // WAIT 화면으로 이동
  };

  // 현재 step에 따라 타이틀 문구 계산
  let titleContent;
  if (current === "name") {
    titleContent = (
      <>
        <span className="text_primary">이름</span>을 입력해주세요
      </>
    );
  } else if (current === "birth") {
    titleContent = (
      <>
        <span className="text_primary">생년월일</span>을 입력해주세요
      </>
    );
  } else if (current === "phone") {
    titleContent = (
      <>
        <span className="text_primary">휴대폰번호</span>를 입력해주세요
      </>
    );
  } else if (current === "error") {
    titleContent = (
      <>
        <span className="text_primary">본인정보</span>를 확인해주세요
      </>
    );
  } else {
    // 기본 방어값
    titleContent = (
      <>
        <span className="text_primary">이름</span>을 입력해주세요
      </>
    );
  }

  return (
    <Screen className="screen_user">
      <Title>{titleContent}</Title>

      <Inner>
        <ScreenInnerGrid
          top={
            <FormFieldWrapper>
              {/* 1) 이름 */}
              <FormFieldInput
                id="user_name"
                label="이름"
                type="text"
                minLength={2}
                maxLength={20}
                placeholder="홍길동"
                value={nameInput}
                onChange={handleChangeName}
                onFocus={handleFocusName}
              />

              {/* 2) 생년월일 */}
              <FormFieldInput
                id="user_birth"
                label="생년월일"
                type="text"
                minLength={10}
                maxLength={10}
                inputMode="numeric"
                placeholder="YYYY-MM-DD"
                value={birthInput}
                onChange={handleChangeBirth}
                onFocus={handleFocusBirth}
              />

              {/* 3) 휴대폰번호 */}
              <FormFieldInput
                id="user_phone"
                label="휴대폰번호"
                type="text"
                minLength={13}
                maxLength={14}
                inputMode="numeric"
                placeholder="010-1234-5678"
                value={phoneInput}
                onChange={handleChangePhone}
                onFocus={handleFocusPhone}
              />

              {hasError && (
                <ErrorMessage className="error_user">
                  오타가 없는지 확인해주세요
                </ErrorMessage>
              )}

              {/* 캡챠: 4회 이상 틀렸을 때만 노출 */}
              {isCaptchaRequired && (
                <FormCaptcha
                  code={captchaCode}
                  value={captchaInput}
                  onChange={setCaptchaInput}
                  onRefresh={handleClickCaptchaRefresh}
                  // onAudioClick={...} // 나중에 추가 가능
                />
              )}
            </FormFieldWrapper>
          }
          bottom={
            <BaseButtonWrapper className="btn_wrapper_submit__auth">
              <BaseButtonContainer>
                <BaseButton
                  className="btn_solid__primary btn_submit__auth_request"
                  onClick={handleClickAuthRequest}
                >
                  인증 요청
                </BaseButton>
              </BaseButtonContainer>
            </BaseButtonWrapper>
          }
        />
      </Inner>
    </Screen>
  );
};

export default ScreenUser;
