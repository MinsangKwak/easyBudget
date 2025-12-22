import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const AUTH_STORAGE_KEY = "demo-auth-state";
const DEFAULT_USERS_ENDPOINT = "/api/auth/default-users";
const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || "").replace(/\/$/, "");

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
                    password: "1234qwer",
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
                    password: "1234qwer",
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
                    password: "1234qwer",
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
    currentUserId: null,
    lastSyncedAt: new Date().toISOString(),
});

const resolveDefaultUsersUrl = () =>
    API_BASE_URL ? `${API_BASE_URL}${DEFAULT_USERS_ENDPOINT}` : DEFAULT_USERS_ENDPOINT;

const fetchDefaultUsersFromApi = async () => {
    if (typeof fetch === "undefined") return DEFAULT_USERS;

    try {
        const response = await fetch(resolveDefaultUsersUrl());
        if (!response.ok) {
            throw new Error(`Failed to fetch default users (${response.status})`);
        }

        const payload = await response.json();
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.users)) return payload.users;

        console.warn("Unexpected default users payload shape", payload);
        return DEFAULT_USERS;
    } catch (error) {
        console.error("Failed to load default users from API", error);
        return DEFAULT_USERS;
    }
};

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

const normalizeEmail = (value = "") => String(value).trim().toLowerCase();

const normalizePhoneDigits = (value = "") => String(value).replace(/\D/g, "");

const collectUserEmails = (user = {}) => {
    const emails = [];
    if (user.profile?.email) emails.push(normalizeEmail(user.profile.email));
    if (user.email) emails.push(normalizeEmail(user.email));

    const providers = user.auth?.providers ?? {};
    Object.values(providers).forEach((provider) => {
        if (provider?.email) emails.push(normalizeEmail(provider.email));
    });

    return emails.filter(Boolean);
};

const buildPhoneBirthKey = (user = {}) => {
    const phone = user.profile?.phone ?? user.auth?.providers?.bankCert?.phone ?? user.phone ?? "";
    const birth = user.profile?.birth ?? user.auth?.providers?.bankCert?.birth ?? user.birth ?? "";
    const normalizedPhone = normalizePhoneDigits(phone);
    const normalizedBirth = String(birth).replace(/\D/g, "");

    if (!normalizedPhone || !normalizedBirth) return null;
    return `${normalizedPhone}_${normalizedBirth}`;
};

const normalizeUserShape = (user) => {
    if (!user) return null;

    const providers = user.auth?.providers ?? {};
    const primaryProvider = user.auth?.primaryProvider ?? user.connectionType ?? "local";
    const primaryProviderData = providers[primaryProvider] ?? {};
    const bankProvider = providers.bankCert ?? {};
    const gmailProvider = providers.gmail ?? {};
    const localProvider = providers.local ?? {};
    const profile = user.profile ?? {};

    const normalizedEmail =
        profile.email ??
        primaryProviderData.email ??
        gmailProvider.email ??
        localProvider.email ??
        user.email ??
        null;

    const normalizedName =
        profile.name ?? primaryProviderData.displayName ?? user.displayName ?? primaryProvider;

    const normalizedPhone =
        profile.phone ?? bankProvider.phone ?? primaryProviderData.phone ?? user.phone ?? null;

    const normalizedBirth =
        profile.birth ?? bankProvider.birth ?? primaryProviderData.birth ?? user.birth ?? null;

    const normalizedBankName =
        bankProvider.bankName ?? primaryProviderData.bankName ?? user.bankName ?? null;

    return {
        ...user,
        email: normalizedEmail,
        displayName: normalizedName,
        phone: normalizedPhone,
        birth: normalizedBirth,
        bankName: normalizedBankName,
        connectionType: primaryProvider,
    };
};

const mergeUserRecords = (baseUser = {}, incomingUser = {}) => ({
    ...baseUser,
    ...incomingUser,
    auth: {
        primaryProvider: incomingUser?.auth?.primaryProvider ?? baseUser?.auth?.primaryProvider,
        providers: {
            ...(baseUser.auth?.providers ?? {}),
            ...(incomingUser.auth?.providers ?? {}),
        },
    },
    profile: { ...(baseUser.profile ?? {}), ...(incomingUser.profile ?? {}) },
    identity: { ...(baseUser.identity ?? {}), ...(incomingUser.identity ?? {}) },
    agreements: { ...(baseUser.agreements ?? {}), ...(incomingUser.agreements ?? {}) },
    security: { ...(baseUser.security ?? {}), ...(incomingUser.security ?? {}) },
    meta: { ...(baseUser.meta ?? {}), ...(incomingUser.meta ?? {}) },
});

const findExistingUserIndex = (userList = [], userPayload) => {
    const payloadEmails = collectUserEmails(userPayload);
    const payloadPhoneBirth = buildPhoneBirthKey(userPayload);

    return userList.findIndex((user) => {
        if (userPayload.id && user.id === userPayload.id) return true;

        const userEmails = collectUserEmails(user);
        if (payloadEmails.some((email) => userEmails.includes(email))) return true;

        const userPhoneBirth = buildPhoneBirthKey(user);
        return Boolean(
            payloadPhoneBirth && userPhoneBirth && payloadPhoneBirth === userPhoneBirth,
        );
    });
};

const mergeUserIntoList = (users = [], userPayload) => {
    const nextUsers = [...users];
    let resolvedUser = userPayload;

    const existingIndex = findExistingUserIndex(nextUsers, userPayload);
    if (existingIndex >= 0) {
        resolvedUser = mergeUserRecords(nextUsers[existingIndex], userPayload);
        nextUsers[existingIndex] = resolvedUser;
    } else {
        resolvedUser = mergeUserRecords(userPayload.id ? {} : { id: generateUserId() }, userPayload);
        nextUsers.push(resolvedUser);
    }

    return { nextUsers, resolvedUser };
};

const mergeUsersIntoList = (users = [], incomingUsers = []) => {
    let nextUsers = [...users];
    incomingUsers.forEach((incomingUser) => {
        const mergeResult = mergeUserIntoList(nextUsers, incomingUser);
        nextUsers = mergeResult.nextUsers;
    });
    return nextUsers;
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [state, setState] = useState(loadAuthState);
    const shouldPersistRef = useRef(true);

    useEffect(() => {
        let isCancelled = false;

        const hydrateDefaultUsers = async () => {
            const apiUsers = await fetchDefaultUsersFromApi();
            if (isCancelled || !apiUsers?.length) return;

            setState((previous) => {
                const nextUsers = mergeUsersIntoList(previous.users, apiUsers);
                return {
                    ...previous,
                    users: nextUsers,
                    lastSyncedAt: new Date().toISOString(),
                };
            });
        };

        hydrateDefaultUsers();

        return () => {
            isCancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!shouldPersistRef.current) {
            shouldPersistRef.current = true;
            return;
        }

        const nextState = { ...state, lastSyncedAt: new Date().toISOString() };
        if (typeof sessionStorage !== "undefined") {
            sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));
        }
    }, [state]);

    const currentUser = useMemo(() => {
        const found = state.users.find((user) => user.id === state.currentUserId) ?? null;
        return normalizeUserShape(found);
    }, [state.currentUserId, state.users]);

    const upsertUser = (userPayload) => {
        let resolvedUser = userPayload;

        setState((previous) => {
            const mergeResult = mergeUserIntoList(previous.users, userPayload);
            resolvedUser = mergeResult.resolvedUser;

            return {
                ...previous,
                users: mergeResult.nextUsers,
                currentUserId: resolvedUser.id ?? previous.currentUserId,
            };
        });

        return resolvedUser;
    };

    const loginWithEmail = (email, password) => {
        const normalizedEmail = normalizeEmail(email);
        let matchedUser = null;
        let matchedProvider = null;

        state.users.some((user) => {
            const providers = user.auth?.providers ?? {};
            const entries = Object.entries(providers).filter(([providerName]) =>
                ["local", "gmail"].includes(providerName),
            );

            for (const [providerName, providerData] of entries) {
                if (normalizeEmail(providerData.email) === normalizedEmail) {
                    matchedUser = user;
                    matchedProvider = { providerName, providerData };
                    return true;
                }
            }

            if (normalizeEmail(user.profile?.email) === normalizedEmail) {
                const primary = user.auth?.primaryProvider ?? "local";
                matchedUser = user;
                matchedProvider = { providerName: primary, providerData: providers[primary] ?? {} };
                return true;
            }

            return false;
        });

        if (!matchedUser) {
            throw new Error("ACCOUNT_NOT_FOUND");
        }

        if (matchedProvider?.providerName === "bankCert") {
            throw new Error("BANK_CERT_REQUIRED");
        }

        const providerData = matchedProvider?.providerData ?? {};
        const storedPassword = providerData.password ?? providerData.passwordHash;
        const isPasswordValid = storedPassword ? storedPassword === password : true;

        if (!isPasswordValid) {
            throw new Error("INVALID_PASSWORD");
        }

        setState((previous) => ({ ...previous, currentUserId: matchedUser.id }));
        return normalizeUserShape(matchedUser);
    };

    const registerEmailUser = ({ email, password, connectionType = "email" }) => {
        const normalizedEmail = normalizeEmail(email);
        const isDuplicated = state.users.some((user) =>
            collectUserEmails(user).includes(normalizedEmail),
        );

        if (isDuplicated) {
            throw new Error("DUPLICATE_ACCOUNT");
        }

        const now = new Date().toISOString();
        const providerType = connectionType === "gmail" ? "gmail" : "local";
        const newUserId = generateUserId();

        const providerPayload =
            providerType === "gmail"
                ? {
                      providerUserId: `gmail-${newUserId}`,
                      email: normalizedEmail,
                      emailVerified: true,
                      password,
                      connectedAt: now,
                  }
                : {
                      email: normalizedEmail,
                      password,
                      emailVerified: false,
                      connectedAt: now,
                  };

        const newUser = {
            id: newUserId,
            auth: {
                primaryProvider: providerType,
                providers: {
                    [providerType]: providerPayload,
                },
            },
            profile: {
                email: normalizedEmail,
                name: null,
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
                termsRequired: { agreed: true, agreedAt: now, version: "v1" },
                privacyRequired: { agreed: true, agreedAt: now, version: "v1" },
                marketingOptIn: { agreed: false, agreedAt: null, version: "v1" },
            },
            security: {
                twoFactorEnabled: false,
                lastLoginIp: "127.0.0.1",
                lastUserAgent: "web",
                failedLoginCount: 0,
            },
            meta: {
                status: "active",
                role: "user",
                createdAt: now,
                lastLoginAt: now,
            },
        };

        const savedUser = upsertUser(newUser);
        return normalizeUserShape(savedUser);
    };

    const loginWithCertificate = ({ bankName, name, phone, birth }) => {
        const formattedPhone = formatPhone(phone);
        const formattedBirth = formatBirth(birth);

        const normalizedPhoneBirth = `${normalizePhoneDigits(formattedPhone)}_${formattedBirth.replace(/\D/g, "")}`;
        const existingUser = state.users.find((user) => {
            const userPhoneBirth = buildPhoneBirthKey(user);
            return userPhoneBirth === normalizedPhoneBirth;
        });

        const now = new Date().toISOString();

        const resolvedUser = existingUser ?? {
            id: generateUserId(),
            auth: {
                primaryProvider: "bankCert",
                providers: {
                    bankCert: {
                        bankName: bankName || "은행 공동서비스",
                        phone: formattedPhone,
                        birth: formattedBirth,
                        certSubject: `CN=${name || "금융인증서 사용자"}, O=BANK, C=KR`,
                        certSerial: `${Date.now().toString(16)}`,
                        connectedAt: now,
                    },
                },
            },
            profile: {
                name: name || "금융인증서 사용자",
                phone: formattedPhone,
                birth: formattedBirth,
                email: null,
            },
            identity: {
                identityVerified: true,
                ci: `CI_${normalizePhoneDigits(formattedPhone) || "UNKNOWN"}`,
                di: `DI_${formattedBirth.replace(/\D/g, "") || "UNKNOWN"}`,
                method: "bankCert",
                verifiedAt: now,
            },
            agreements: {
                termsRequired: { agreed: true, agreedAt: now, version: "v1" },
                privacyRequired: { agreed: true, agreedAt: now, version: "v1" },
                marketingOptIn: { agreed: false, agreedAt: null, version: "v1" },
            },
            security: {
                twoFactorEnabled: true,
                lastLoginIp: "127.0.0.1",
                lastUserAgent: "web",
                failedLoginCount: 0,
            },
            meta: {
                status: "active",
                role: "user",
                createdAt: now,
                lastLoginAt: now,
            },
        };

        const savedUser = upsertUser(resolvedUser);
        return normalizeUserShape(savedUser);
    };

    const logout = () => {
        setState((previous) => ({ ...previous, currentUserId: null }));
    };

    const deleteAccount = () => {
        if (typeof sessionStorage !== "undefined") {
            sessionStorage.removeItem(AUTH_STORAGE_KEY);
        }

        shouldPersistRef.current = false;
        setState(buildDefaultState());
    };

    const value = {
        users: state.users,
        currentUser,
        loginWithEmail,
        registerEmailUser,
        loginWithCertificate,
        logout,
        deleteAccount,
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
