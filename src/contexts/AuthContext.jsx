import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AUTH_STORAGE_KEY = "demo-auth-state";

// const DEFAULT_USERS = [
//     {
//         id: "user-gmail",
//         email: "test@gmail.com",
//         password: "password1234",
//         displayName: "G-Mail 연동 계정",
//         connectionType: "gmail",
//     },
//     {
//         id: "user-test",
//         email: "test@test.com",
//         password: "password1234",
//         displayName: "테스트 연동 계정",
//         connectionType: "test",
//     },
//     {
//         id: "user-bank",
//         email: "kb@bank-cert.test",
//         password: "password1234",
//         connectionType: "bankCert",
//         displayName: "홍길동",
//         bankName: "KB국민은행",
//         phone: "010-1234-5678",
//         birth: "1990-01-01",
//     },
// ];
const DEFAULT_USERS = [
    // 1) Gmail 연동만 된 계정 (최소 정보)
    {
        id: "user-gmail-only",
        auth: {
            primaryProvider: "gmail",
            providers: {
                gmail: {
                    providerUserId: "gmail-sub-1001",
                    email: "test@gmail.com",
                    emailVerified: true,
                    pictureUrl: "https://example.com/profile-gmail.png",
                    connectedAt: "2025-12-18T00:00:00Z",
                },
            },
        },

        profile: {
            email: "test@gmail.com",
            name: null, // 가입 보강 단계에서 입력 받는 케이스
            phone: null,
            birth: null,
        },

        identity: {
            identityVerified: false,
            ci: null,
            di: null,
            method: null,
            verifiedAt: null,
        },

        agreements: {
            termsRequired: { agreed: true, agreedAt: "2025-12-18T00:00:00Z", version: "v1" },
            privacyRequired: { agreed: true, agreedAt: "2025-12-18T00:00:00Z", version: "v1" },
            marketingOptIn: { agreed: false, agreedAt: null, version: "v1" },
        },

        security: {
            twoFactorEnabled: false,
            lastLoginIp: "127.0.0.1",
            lastUserAgent: "Chrome-Test",
            failedLoginCount: 0,
        },

        meta: {
            status: "active", // active | suspended | deleted
            role: "user",
            createdAt: "2025-12-18T00:00:00Z",
            lastLoginAt: "2025-12-18T00:00:00Z",
        },
    },

    // 2) 일반 회원가입(Local)만 된 계정
    {
        id: "user-local-only",
        auth: {
            primaryProvider: "local",
            providers: {
                local: {
                    email: "test@test.com",
                    passwordHash: "$2b$10$dummy_local_hash",
                    emailVerified: false,
                    connectedAt: "2025-12-18T00:00:00Z",
                },
            },
        },

        profile: {
            email: "test@test.com",
            name: "테스트 사용자",
            phone: "010-2222-3333",
            birth: "1995-05-05",
        },

        identity: {
            identityVerified: false,
            ci: null,
            di: null,
            method: null,
            verifiedAt: null,
        },

        agreements: {
            termsRequired: { agreed: true, agreedAt: "2025-12-18T00:00:00Z", version: "v1" },
            privacyRequired: { agreed: true, agreedAt: "2025-12-18T00:00:00Z", version: "v1" },
            marketingOptIn: { agreed: true, agreedAt: "2025-12-18T00:00:00Z", version: "v1" },
        },

        security: {
            twoFactorEnabled: false,
            lastLoginIp: "127.0.0.1",
            lastUserAgent: "Chrome-Test",
            failedLoginCount: 1,
        },

        meta: {
            status: "active",
            role: "user",
            createdAt: "2025-12-18T00:00:00Z",
            lastLoginAt: "2025-12-18T00:00:00Z",
        },
    },

    // 3) 은행 인증서(bankCert)만 된 계정
    {
        id: "user-bankcert-only",
        auth: {
            primaryProvider: "bankCert",
            providers: {
                bankCert: {
                    bankName: "KB국민은행",
                    certSubject: "CN=홍길동, OU=TEST, O=KB, C=KR",
                    certSerial: "00A1B2C3D4",
                    connectedAt: "2025-12-18T00:00:00Z",
                },
            },
        },

        profile: {
            email: null, // 은행 인증으로는 이메일이 없을 수 있음
            name: "홍길동",
            phone: "010-1234-5678",
            birth: "1990-01-01",
        },

        identity: {
            identityVerified: true,
            ci: "CI_DUMMY_BANK_1001",
            di: "DI_DUMMY_BANK_1001",
            method: "bankCert",
            verifiedAt: "2025-12-18T00:00:00Z",
        },

        agreements: {
            termsRequired: { agreed: true, agreedAt: "2025-12-18T00:00:00Z", version: "v1" },
            privacyRequired: { agreed: true, agreedAt: "2025-12-18T00:00:00Z", version: "v1" },
            marketingOptIn: { agreed: false, agreedAt: null, version: "v1" },
        },

        security: {
            twoFactorEnabled: true, // 인증서 계정은 2FA처럼 취급 테스트 가능
            lastLoginIp: "127.0.0.1",
            lastUserAgent: "Chrome-Test",
            failedLoginCount: 0,
        },

        meta: {
            status: "active",
            role: "user",
            createdAt: "2025-12-18T00:00:00Z",
            lastLoginAt: "2025-12-18T00:00:00Z",
        },
    },

    // 4) 다 있는 계정 (gmail + local + bankCert 모두 연결된 “올인원”)
    {
        id: "user-all-linked",
        auth: {
            primaryProvider: "gmail", // 대표 로그인 수단
            providers: {
                gmail: {
                    providerUserId: "gmail-sub-2001",
                    email: "all@gmail.com",
                    emailVerified: true,
                    pictureUrl: "https://example.com/profile-all.png",
                    connectedAt: "2025-12-18T00:00:00Z",
                },
                local: {
                    email: "all@test.com",
                    passwordHash: "$2b$10$dummy_all_hash",
                    emailVerified: true,
                    connectedAt: "2025-12-18T00:00:00Z",
                },
                bankCert: {
                    bankName: "KB국민은행",
                    certSubject: "CN=올인원, OU=TEST, O=KB, C=KR",
                    certSerial: "00FFEE1122",
                    connectedAt: "2025-12-18T00:00:00Z",
                },
            },
        },

        profile: {
            // 통일된 “대표 연락처/실명”을 여기로 모음
            email: "all@gmail.com",
            name: "올인원",
            phone: "010-9999-0000",
            birth: "1992-02-02",
        },

        identity: {
            identityVerified: true,
            ci: "CI_DUMMY_ALL_2001",
            di: "DI_DUMMY_ALL_2001",
            method: "bankCert", // 실제 본인확인은 bankCert로 했다고 가정
            verifiedAt: "2025-12-18T00:00:00Z",
        },

        agreements: {
            termsRequired: { agreed: true, agreedAt: "2025-12-18T00:00:00Z", version: "v1" },
            privacyRequired: { agreed: true, agreedAt: "2025-12-18T00:00:00Z", version: "v1" },
            marketingOptIn: { agreed: true, agreedAt: "2025-12-18T00:00:00Z", version: "v1" },
        },

        security: {
            twoFactorEnabled: true,
            lastLoginIp: "127.0.0.1",
            lastUserAgent: "Chrome-Test",
            failedLoginCount: 0,
        },

        meta: {
            status: "active",
            role: "admin", // 올인원은 테스트 편하게 admin으로 두는 것도 좋음
            createdAt: "2025-12-18T00:00:00Z",
            lastLoginAt: "2025-12-18T00:00:00Z",
        },
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
        [state.currentUserId, state.users],
    );

    const upsertUser = (userPayload) => {
        setState((previous) => {
            const existingIndex = previous.users.findIndex(
                (user) =>
                    (user.email && user.email.toLowerCase() === userPayload.email?.toLowerCase()) ||
                    (user.connectionType === "bankCert" &&
                        user.phone?.replace(/\D/g, "") === userPayload.phone?.replace(/\D/g, "") &&
                        user.birth?.replace(/\D/g, "") === userPayload.birth?.replace(/\D/g, "")),
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
            (user) => user.email?.toLowerCase() === normalizedEmail,
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
                user.birth?.replace(/\D/g, "") === formattedBirth.replace(/\D/g, ""),
        );

        const resolvedUser = existingUser ?? {
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
