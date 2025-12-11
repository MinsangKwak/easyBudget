// components/Screen/Member/Cert/ScreenWait.jsx

import Screen from "../../../Layout/Screen";
import Title from "../../../Content/Title";
import Inner from "../../../Content/Inner";
import ScreenInnerGrid from "../../../Layout/ScreenInnerGrid";

import BaseButton from "../../../Form/BaseButton";
import BaseButtonContainer from "../../../Form/BaseButtonContainer";
import ProgressStatus from "../../../Content/ProgressStatus";

const ScreenWait = ({ selectedBank, onNext }) => {
  console.log("ScreenWait selectedBank = ", selectedBank);

  // selectedBank 예시:
  // { type: 'woori', name: '우리', logoSrc: '../assets/img/logo/bank/logo__woori.png' }
  // label 또는 name 필드 명칭에 따라 바꿔야 할 수 있음
  const bankName = selectedBank?.label || selectedBank?.name || "선택하신";
  const bankLogoSrc = selectedBank?.logoSrc;

  return (
    <Screen className="screen_certificate__wait">
      <Title>
        {bankName}은행 앱에서 인증 후 <br />
        <span className="text_primary">인증완료</span>를 눌러주세요
      </Title>

      <p className="content_description">인증요청 알림을 확인해주세요</p>

      <Inner>
        <ScreenInnerGrid
          top={
            <ProgressStatus
              src={bankLogoSrc}
              alt={`${bankName}은행 아이콘`}
            />
          }
          bottom={
            <BaseButtonContainer>
              <BaseButton
                className="btn_solid__primary btn_wait__complete"
                onClick={onNext}
              >
                인증 완료
              </BaseButton>

              <BaseButton
                className="btn_line__black btn_cert__ask_auth"
                data-modal-target="auth_help"
              >
                <span className="btn_text">인증이 잘 안되시나요?</span>
              </BaseButton>
            </BaseButtonContainer>
          }
        />
      </Inner>
    </Screen>
  );
};

export default ScreenWait;
