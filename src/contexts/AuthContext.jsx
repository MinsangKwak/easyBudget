import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AUTH_STORAGE_KEY = "demo-auth-state";

const DEFAULT_USERS = [
  {
    id: "user-gmail",
    email: "test@gmail.com",
    password: "password1234",
    displayName: "G-Mail 연동 계정",
    connectionType: "gmail",
  },
  {
    id: "user-test",
    email: "test@test.com",
    password: "password1234",
    displayName: "테스트 연동 계정",
    connectionType: "test",
  },
  {
    id: "user-bank",
    email: "kb@bank-cert.test",
    password: "",
    displayName: "홍길동",
    connectionType: "bankCert",
    bankName: "KB국민은행",
    phone: "010-1234-5678",
    birth: "1990-01-01",
  },
];

const buildDefaultState = () => ({
  users: DEFAULT_USERS,
  currentUserId: DEFAULT_USERS[0].id,
  lastSyncedAt: new Date().toISOString(),
});

const generateUserId = () => {
  const cryptoApi = typeof globalThis !== "undefined" ? globalThis.crypto : null;
  if (cryptoApi?.randomUUID) return cryptoApi.randomUUID();
  return `user-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const loadAuthState = () => {
  if (typeof sessionStorage === "undefined") return buildDefaultState();

  try {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return buildDefaultState();

    const parsed = JSON.parse(stored);
    if (!parsed.users?.length) return buildDefaultState();

    return parsed;
  } catch (error) {
    console.error("Failed to parse auth storage", error);
    return buildDefaultState();
  }
};

const formatPhone = (value = "") => {
  const digits = String(value).replace(/\D/g, "");
  if (digits.length < 10) return digits;
  const [, first, middle, last] = digits.match(/(\d{2,3})(\d{3,4})(\d{4})/) || [];
  return [first, middle, last].filter(Boolean).join("-");
};

const formatBirth = (value = "") => {
  const digits = String(value).replace(/\D/g, "").slice(0, 8);
  if (digits.length !== 8) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(loadAuthState);

  useEffect(() => {
    const nextState = { ...state, lastSyncedAt: new Date().toISOString() };
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));
    }
  }, [state]);

  const currentUser = useMemo(
    () => state.users.find((user) => user.id === state.currentUserId) ?? null,
    [state.currentUserId, state.users]
  );

  const upsertUser = (userPayload) => {
    setState((previous) => {
      const existingIndex = previous.users.findIndex(
        (user) =>
          (user.email && user.email.toLowerCase() === userPayload.email?.toLowerCase()) ||
          (user.connectionType === "bankCert" &&
            user.phone?.replace(/\D/g, "") === userPayload.phone?.replace(/\D/g, "") &&
            user.birth?.replace(/\D/g, "") === userPayload.birth?.replace(/\D/g, ""))
      );

      const nextUsers = [...previous.users];
      let resolvedUser = userPayload;

      if (existingIndex >= 0) {
        resolvedUser = { ...nextUsers[existingIndex], ...userPayload };
        nextUsers[existingIndex] = resolvedUser;
      } else {
        nextUsers.push(userPayload);
      }

      return {
        ...previous,
        users: nextUsers,
        currentUserId: resolvedUser.id,
      };
    });
  };

  const loginWithEmail = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const targetUser = state.users.find(
      (user) => user.email?.toLowerCase() === normalizedEmail
    );

    if (!targetUser) {
      throw new Error("ACCOUNT_NOT_FOUND");
    }

    if (targetUser.connectionType === "bankCert") {
      throw new Error("BANK_CERT_REQUIRED");
    }

    if (targetUser.password && targetUser.password !== password) {
      throw new Error("INVALID_PASSWORD");
    }

    setState((previous) => ({ ...previous, currentUserId: targetUser.id }));
    return targetUser;
  };

  const registerEmailUser = ({ email, password, connectionType = "email" }) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (state.users.some((user) => user.email?.toLowerCase() === normalizedEmail)) {
      throw new Error("DUPLICATE_ACCOUNT");
    }

    const newUser = {
      id: generateUserId(),
      email: normalizedEmail,
      password,
      displayName: normalizedEmail,
      connectionType,
    };

    upsertUser(newUser);
    return newUser;
  };

  const loginWithCertificate = ({ bankName, name, phone, birth }) => {
    const formattedPhone = formatPhone(phone);
    const formattedBirth = formatBirth(birth);

    const existingUser = state.users.find(
      (user) =>
        user.connectionType === "bankCert" &&
        user.phone?.replace(/\D/g, "") === formattedPhone.replace(/\D/g, "") &&
        user.birth?.replace(/\D/g, "") === formattedBirth.replace(/\D/g, "")
    );

    const resolvedUser =
      existingUser ??
      {
        id: generateUserId(),
        email: `${formattedPhone || "bank"}@${bankName || "bank"}.cert`,
        password: "",
        displayName: name || "금융인증서 사용자",
        connectionType: "bankCert",
        bankName,
        phone: formattedPhone,
        birth: formattedBirth,
      };

    upsertUser(resolvedUser);
    return resolvedUser;
  };

  const logout = () => {
    setState((previous) => ({ ...previous, currentUserId: null }));
  };

  const value = {
    users: state.users,
    currentUser,
    loginWithEmail,
    registerEmailUser,
    loginWithCertificate,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
