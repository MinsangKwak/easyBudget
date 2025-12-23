import React from "react";
import "../src/index.css";
import "../src/App.css";
import { AuthContext } from "../src/contexts/AuthContext.jsx";

/** Storybook 전용 Mock Auth 값 */
const mockAuthValue = {
    users: [],
    currentUser: null,
    loginWithEmail: () => {},
    registerEmailUser: () => {},
    loginWithCertificate: () => {},
    logout: () => {},
    deleteAccount: () => {},
};

/** Storybook 전용 Provider */
const MockAuthProvider = ({ children }) =>
    React.createElement(AuthContext.Provider, { value: mockAuthValue }, children);

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        a11y: { test: "todo" },
    },
    decorators: [
        (Story) => React.createElement(MockAuthProvider, null, React.createElement(Story)),
    ],
};

export default preview;
