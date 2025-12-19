import "./index.css";
import Screen from "../../../../Layout/Screen";
import Title from "../../../../Content/Title";
import Subtitle from "../../../../Content/SubTitle";
import Inner from "../../../../Content/Inner";
import ScreenInnerGrid from "../../../../Layout/ScreenInnerGrid";
import BaseButton from "../../../../Form/BaseButton";
import BaseButtonContainer from "../../../../Form/BaseButtonContainer";
import ProgressStatus from "../../../../Content/ProgressStatus";

const ScreenWait = ({ selectedBank, onNext }) => {
    const bankName = selectedBank?.label || selectedBank?.name || "선택하신";
    const bankLogoSrc = selectedBank?.logoSrc;
    return (
        <Screen className="screen_certificate__wait">
            <Title>
                {bankName}은행 앱에서 인증 후 <br />
                <span>
                    <span className="text_primary">인증완료</span>를 눌러주세요
                </span>
            </Title>
            <Subtitle>인증요청 알림을 확인해주세요</Subtitle>
            <Inner>
                <ScreenInnerGrid
                    top={<ProgressStatus src={bankLogoSrc} alt={`${bankName}은행 아이콘`} />}
                    bottom={
                        <BaseButtonContainer>
                            <BaseButton size="md" style="solid__primary" onClick={onNext}>
                                인증 완료
                            </BaseButton>
                            <span className="spacer">또는</span>
                            <BaseButton
                                size="md"
                                style="outline__grey"
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
