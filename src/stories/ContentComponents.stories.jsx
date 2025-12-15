import Title from "../components/Content/Title";
import Inner from "../components/Content/Inner";
import List from "../components/Content/List";
import ProgressStatus from "../components/Content/ProgressStatus";
import { bankList } from "../constants/bankList";

export default {
  title: "Components/Content",
};

export const SectionTitle = {
  name: "Title",
  render: () => <Title>콘텐츠 타이틀</Title>,
};

export const InnerBox = {
  name: "Inner",
  render: () => (
    <Inner>
      <p>여백이 포함된 콘텐츠 박스입니다.</p>
    </Inner>
  ),
};

export const SimpleList = {
  name: "List",
  render: () => (
    <List
      items={["첫 번째", "두 번째", "세 번째"]}
      renderItem={(item) => <span>{item}</span>}
    />
  ),
};

export const StatusWithLogo = {
  name: "ProgressStatus",
  render: () => (
    <ProgressStatus src={bankList.woori.logoSrc} alt="우리은행 로고">
      우리은행 인증 진행중
    </ProgressStatus>
  ),
};
