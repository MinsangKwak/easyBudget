import "./index.css";
import Screen from "../../../../Layout/Screen";
import Title from "../../../../Content/Title";
import Inner from "../../../../Content/Inner";
import BaseList from "../../../../Content/List";
import BaseButton from "../../../../Form/BaseButton";
import LottieIcon from "../../../../Common/LottieIcon";
import { LOTTIE_SOURCES } from "../../../../../constants/lottieSources";

const ScreenCertSelect = ({ bankList, onSelectBank }) => {
  return (
    <Screen className="screen_cert">
      <div className="screen_visual">
        <LottieIcon
          src={LOTTIE_SOURCES.certShield}
          ariaLabel="인증서 선택 애니메이션"
          size={150}
        />
      </div>
      <Title>
        회원가입에 사용할 <br />
        인증서를 선택해주세요
      </Title>

      <Inner>
        <BaseList
          className="list_cert"
          items={Object.entries(bankList)}
          renderItem={([key, item]) => (
            <BaseButton
              className={`btn_bank btn_bank__${item.bankType}`}
              onClick={() => onSelectBank(key)}
            >
              {item.label}은행 인증서
            </BaseButton>
          )}
        />
      </Inner>
    </Screen>
  );
};

export default ScreenCertSelect;
