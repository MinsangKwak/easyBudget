import Screen from "../components/Layout/Screen";
import ScreenInnerGrid from "../components/Layout/ScreenInnerGrid";
import AppHeader from "../components/Layout/AppHeader";
import Title from "../components/Content/Title";
import Inner from "../components/Content/Inner";
import BaseButton from "../components/Form/BaseButton";

export default {
  title: "Components/Layout",
};

export const BasicScreen = {
  name: "Screen",
  render: () => (
    <Screen>
      <Title>레이아웃 스크린</Title>
      <Inner>
        <p>기본 스크린 레이아웃을 보여주는 스토리입니다.</p>
      </Inner>
    </Screen>
  ),
};

export const ScreenWithInnerGrid = {
  name: "ScreenInnerGrid",
  render: () => (
    <Screen>
        <ScreenInnerGrid
          top={<p>상단 콘텐츠</p>}
          bottom={<BaseButton style="solid__primary">하단 버튼</BaseButton>}
        />
      </Screen>
  ),
};

export const AppHeaderWithBackButton = {
  name: "AppHeader",
  render: () => <AppHeader showBackButton onBackClick={() => {}} />,
};

export const AppHeaderWithAuthAction = {
  name: "AppHeader (Main)",
  render: () => (
    <AppHeader
      isAuthenticated={false}
      onLogoClick={() => {}}
      onLoginClick={() => {}}
    />
  ),
};
