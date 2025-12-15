import { useState } from "react";
import FormFieldInput from "../components/Form/FormFieldInput";
import "../index.css";
import "../App.css";

const meta = {
  title: "Auth/FormFieldInput",
  component: FormFieldInput,
  parameters: {
    layout: "centered",
  },
};

export default meta;

const Decorator = (Story) => (
  <div style={{ width: "360px" }}>
    <Story />
  </div>
);

export const TextField = {
  decorators: [Decorator],
  render: () => {
    const [value, setValue] = useState("인증번호를 입력하세요");

    return (
      <FormFieldInput
        id="storybook-input"
        label="인증번호"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="숫자 6자리를 입력"
        maxLength={6}
        inputMode="numeric"
      />
    );
  },
};
