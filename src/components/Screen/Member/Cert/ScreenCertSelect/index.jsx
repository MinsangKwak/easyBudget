import "./index.css";
import Screen from "../../../../Layout/Screen";
import Title from "../../../../Content/Title";
import Subtitle from "../../../../Content/SubTitle";
import Inner from "../../../../Content/Inner";
import BaseList from "../../../../Content/List";
import BaseButton from "../../../../Form/BaseButton";

const ScreenCertSelect = ({ bankList, onSelectBank }) => {
  return (
    <Screen className="screen_cert">
      <Title>
        회원가입에 사용할 <br />
        인증서를 선택해주세요
      </Title>
      <Subtitle>회원가입 방식을 선택해 주세요.</Subtitle>
      <Inner>
        <BaseList
          className="list_cert"
          items={Object.entries(bankList)}
          renderItem={([key, item]) => (
            <BaseButton
              style={["bank", `bank__${item.bankType}`]}
              onClick={() => onSelectBank(key)}
            >
              <img src={item.logoSrc} />
              {item.label} 인증서
            </BaseButton>
          )}
        />
      </Inner>
    </Screen>
  );
};

export default ScreenCertSelect;
