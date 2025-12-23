import Title from "../components/Content/Title";
import "../index.css";
import "../App.css";

const meta = {
  title: "Auth/Title",
  component: Title,
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const Default = {
  render: () => (
    <div style={{ width: "360px" }}>
      <Title>인증 절차를 시작합니다</Title>
      <p
        style={{
          marginTop: "12px",
          fontSize: "var(--font-size-lg)",
          color: "var(--color-text-muted-400)",
        }}
      >
        기본 타이틀 스타일을 Storybook에서 확인하세요.
      </p>
    </div>
  ),
};
