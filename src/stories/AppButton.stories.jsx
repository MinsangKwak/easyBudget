import Button from "../components/Form/Button";
import BaseButton from "../components/Form/BaseButton";
import "../index.css";
import "../App.css";

const meta = {
  title: "Auth/Button",
  component: Button,
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
      <Button variant="solid__primary">프라이머리</Button>
      <Button variant="line__primary">라인 프라이머리</Button>
      <Button variant="line__black">라인 블랙</Button>
      <Button className="btn_inline">인라인 버튼</Button>
      <Button className="btn_captcha">캡챠 버튼</Button>
      <Button className="btn_back">뒤로가기</Button>
    </>
  ),
};
