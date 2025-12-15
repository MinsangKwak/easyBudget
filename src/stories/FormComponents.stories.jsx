import { useState } from "react";
import BaseButton from "../components/Form/BaseButton";
import Button from "../components/Form/Button";
import BaseButtonWrapper from "../components/Form/BaseButtonWrapper";
import BaseButtonContainer from "../components/Form/BaseButtonContainer";
import FormFieldWrapper from "../components/Form/FormFieldWrapper";
import FormFieldInput from "../components/Form/FormFieldInput";
import FormCaptcha from "../components/Form/FormCaptcha";
import ErrorMessage from "../components/Form/ErrorMessage";

export default {
  title: "Components/Form",
};

export const Buttons = {
  name: "Buttons",
  render: () => (
    <BaseButtonContainer>
      <BaseButton className="btn_solid__primary">기본 버튼</BaseButton>
      <Button variant="line__black">라인 버튼</Button>
    </BaseButtonContainer>
  ),
};

export const ButtonLayouts = {
  name: "Button Wrappers",
  render: () => (
    <BaseButtonWrapper>
      <BaseButtonContainer>
        <Button variant="solid__primary">확인</Button>
        <Button variant="line__black">취소</Button>
      </BaseButtonContainer>
    </BaseButtonWrapper>
  ),
};

export const FormFields = {
  name: "Form Fields",
  render: () => {
    const [value, setValue] = useState("테스트 입력값");
    const [captcha, setCaptcha] = useState("");

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
        <FormFieldWrapper>
          <FormFieldInput
            id="sample"
            label="샘플"
            placeholder="값을 입력하세요"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </FormFieldWrapper>

        <FormCaptcha
          code="A1B2C3"
          value={captcha}
          onChange={setCaptcha}
          onRefresh={() => setCaptcha("")}
          onAudioClick={() => setCaptcha("오디오")}
        />

        <ErrorMessage>유효성 에러 메시지 예시</ErrorMessage>
      </div>
    );
  },
};
