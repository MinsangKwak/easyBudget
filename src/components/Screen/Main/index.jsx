import "./index.css";
import Screen from "../../Layout/Screen";
import Title from "../../Content/Title";
import Inner from "../../Content/Inner";

const ScreenMain = () => {
  return (
    <Screen>
      <Title>메인페이지 입니다.</Title>
      <Inner>
        <p className="main_body">대시보드 콘텐츠를 이곳에 배치하세요.</p>
      </Inner>
    </Screen>
  );
};

export default ScreenMain;
