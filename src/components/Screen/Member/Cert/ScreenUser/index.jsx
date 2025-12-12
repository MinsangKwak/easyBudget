import "./index.css";
import Screen from "../../../../Layout/Screen";
import Title from "../../../../Content/Title";
import Inner from "../../../../Content/Inner";
import ScreenInnerGrid from "../../../../Layout/ScreenInnerGrid";
import FormFieldWrapper from "../../../../Form/FormFieldWrapper";
import FormFieldInput from "../../../../Form/FormFieldInput";
import FormCaptcha from "../../../../Form/FormCaptcha";
import BaseButtonContainer from "../../../../Form/BaseButtonContainer";
import BaseButton from "../../../../Form/BaseButton";

const ScreenUser = ({
  user,
  selectedBank,
  captchaCode,
  captchaValue,
  onChangeField,
  onChangeCaptcha,
  onRefreshCaptcha,
  onNext,
  onPrev,
}) => {
  return (
    <Screen className="screen_certificate__user">
      <Title>인증서 본인확인</Title>

      <Inner>
        <p className="content_description">
          금융인증서 발급을 위해 본인 정보를 확인해주세요.
        </p>

        <ScreenInnerGrid
          top={
            <div className="form_fields">
              <FormFieldWrapper>
                <FormFieldInput
                  id="user_name"
                  label="이름"
                  value={user.name}
                  onChange={(event) => onChangeField("name", event.target.value)}
                />
              </FormFieldWrapper>

              <FormFieldWrapper>
                <FormFieldInput
                  id="user_birth"
                  label="생년월일"
                  value={user.birth}
                  onChange={(event) => onChangeField("birth", event.target.value)}
                />
              </FormFieldWrapper>

              <FormFieldWrapper>
                <FormFieldInput
                  id="user_phone"
                  label="휴대폰 번호"
                  value={user.phone}
                  onChange={(event) => onChangeField("phone", event.target.value)}
                />
              </FormFieldWrapper>

              <FormCaptcha
                code={captchaCode}
                value={captchaValue}
                onChange={onChangeCaptcha}
                onRefresh={onRefreshCaptcha}
                onAudioClick={() => {}}
              />
            </div>
          }
          bottom={
            <BaseButtonContainer>
              <BaseButton className="btn_solid__primary" onClick={onNext}>
                휴대폰 번호로 인증하기
              </BaseButton>

              <BaseButton
                className="btn_line__black btn_cert__back"
                onClick={onPrev}
              >
                이전으로
              </BaseButton>
            </BaseButtonContainer>
          }
        />

        <div className="selected_bank">
          <span className="bank_badge">{selectedBank?.label}</span>
          <span className="bank_name">{selectedBank?.name} 인증서</span>
        </div>
      </Inner>
    </Screen>
  );
};

export default ScreenUser;
