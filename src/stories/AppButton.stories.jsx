import BaseButton from "../components/Form/BaseButton";
import "../index.css";
import "../App.css";

const meta = {
  title: "Auth/Button",
  component: BaseButton,
  parameters: {
    layout: "centered",
  },
};

export default meta;

const Wrapper = (Story) => (
  <div style={{ width: "320px", display: "flex", flexDirection: "column", gap: "12px" }}>
    <Story />
  </div>
);

export const Variants = {
  name: "Application Buttons",
  decorators: [Wrapper],
  render: () => (
    <>
      <BaseButton>기본 버튼</BaseButton>
      <BaseButton style="solid__primary">프라이머리</BaseButton>
      <BaseButton style="line__primary">라인 프라이머리</BaseButton>
      <BaseButton style="line__black">라인 블랙</BaseButton>
      <BaseButton style="inline">인라인 버튼</BaseButton>
      <BaseButton style="captcha">캡챠 버튼</BaseButton>
      <BaseButton style="back">뒤로가기</BaseButton>
    </>
  ),
};
