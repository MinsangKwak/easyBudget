import "./index.css";

import Screen from "../../Layout/Screen";
import Title from "../../Content/Title";
import Subtitle from "../../Content/SubTitle";
import Inner from "../../Content/Inner";

import BaseButton from "../../Form/BaseButton";
import BaseButtonContainer from "../../Form/BaseButtonContainer";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiEdit3, FiX, FiChevronDown } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";

/* =========================
 * utils
 * ========================= */

const clampValue = (value, minimum, maximum) => {
    return Math.min(maximum, Math.max(minimum, value));
};

const roundValue = (value) => Math.round(value);

const parseNumberSafely = (rawValue) => {
    const parsedValue = Number(
        String(rawValue ?? "")
            .replaceAll(",", "")
            .trim(),
    );
    return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const formatKoreanWon = (value) => {
    const sign = value < 0 ? "-" : "";
    const absoluteValue = Math.abs(roundValue(value));
    return `${sign}${absoluteValue.toLocaleString("ko-KR")}원`;
};

const formatKoreanWonShort = (value) => {
    const sign = value < 0 ? "-" : "";
    const absoluteValue = Math.abs(roundValue(value));

    if (absoluteValue >= 100000000) return `${sign}${Math.round(absoluteValue / 100000000)}억`;
    if (absoluteValue >= 10000) return `${sign}${Math.round(absoluteValue / 10000)}만`;
    return `${sign}${absoluteValue.toLocaleString("ko-KR")}`;
};

const slugifyKey = (value, fallback = "item") => {
    const base = String(value || "").trim().toLowerCase();
    if (!base) return fallback;
    return base.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || fallback;
};

/* =========================
 * RAF loop (donut 살짝 숨쉬기)
 * ========================= */

function useRequestAnimationFrameLoop(isEnabled, onFrame) {
    const animationFrameIdRef = useRef(0);
    const lastTimestampRef = useRef(0);

    useEffect(() => {
        if (!isEnabled) return;

        lastTimestampRef.current = performance.now();

        const onAnimationFrame = (currentTimestamp) => {
            const deltaTimeInSeconds = Math.min(
                0.05,
                (currentTimestamp - lastTimestampRef.current) / 1000,
            );

            lastTimestampRef.current = currentTimestamp;
            onFrame(deltaTimeInSeconds, currentTimestamp);

            animationFrameIdRef.current = requestAnimationFrame(onAnimationFrame);
        };

        animationFrameIdRef.current = requestAnimationFrame(onAnimationFrame);

        return () => cancelAnimationFrame(animationFrameIdRef.current);
    }, [isEnabled, onFrame]);
}

/* =========================
 * default data
 * ========================= */

const CATEGORY_OPTIONS = [
    { key: "cat_food", label: "식비·외식비", defaultTone: "primary" },
    { key: "cat_loan", label: "대출", defaultTone: "dark" },
    { key: "cat_ins", label: "보험", defaultTone: "soft" },
    { key: "cat_house", label: "주거·관리", defaultTone: "soft" },
    { key: "cat_misc", label: "결제·소통", defaultTone: "soft" },
];

const PAYMENT_GROUP_META = {
    card: { key: "card", label: "카드지출" },
    cash: { key: "cash", label: "현금지출" },
};

const DEFAULT_INCOME_ENTRIES = [
    { id: "income-salary", label: "급여", amount: 3200000 },
    { id: "income-side", label: "기타 수입", amount: 580000 },
];

const DEFAULT_SPEND_ENTRIES = [
    {
        id: "cat_food_shinhan",
        categoryKey: "cat_food",
        categoryLabel: "식비·외식비",
        amount: 360000,
        paymentKey: "card_shinhan",
        paymentLabel: "신한카드",
        paymentLogo: "S",
        paymentGroupKey: "card",
        paymentGroupLabel: "카드지출",
        spendType: "variable",
        status: "paid",
        dateLabel: "10/18",
    },
    {
        id: "cat_food_hyundai",
        categoryKey: "cat_food",
        categoryLabel: "식비·외식비",
        amount: 300000,
        paymentKey: "card_hyundai",
        paymentLabel: "현대카드",
        paymentLogo: "H",
        paymentGroupKey: "card",
        paymentGroupLabel: "카드지출",
        spendType: "variable",
        status: "planned",
        dateLabel: "10/22",
    },
    {
        id: "cat_loan_hyundai",
        categoryKey: "cat_loan",
        categoryLabel: "대출",
        amount: 550000,
        paymentKey: "card_hyundai",
        paymentLabel: "현대카드",
        paymentLogo: "H",
        paymentGroupKey: "card",
        paymentGroupLabel: "카드지출",
        spendType: "regular",
        status: "planned",
        dateLabel: "10/25",
    },
    {
        id: "cat_ins_kb",
        categoryKey: "cat_ins",
        categoryLabel: "보험",
        amount: 200000,
        paymentKey: "card_kb",
        paymentLabel: "KB국민카드",
        paymentLogo: "K",
        paymentGroupKey: "card",
        paymentGroupLabel: "카드지출",
        spendType: "regular",
        status: "paid",
        dateLabel: "10/08",
    },
    {
        id: "cat_house_cash",
        categoryKey: "cat_house",
        categoryLabel: "주거·관리",
        amount: 140000,
        paymentKey: "cash",
        paymentLabel: "현금",
        paymentLogo: "₩",
        paymentGroupKey: "cash",
        paymentGroupLabel: "현금지출",
        spendType: "regular",
        status: "paid",
        dateLabel: "10/03",
    },
    {
        id: "cat_misc_card",
        categoryKey: "cat_misc",
        categoryLabel: "결제·소통",
        amount: 45000,
        paymentKey: "card_other",
        paymentLabel: "우리카드",
        paymentLogo: "W",
        paymentGroupKey: "card",
        paymentGroupLabel: "카드지출",
        spendType: "variable",
        status: "paid",
        dateLabel: "10/02",
    },
];

/* =========================
 * ScreenMain (Mobile)
 * ========================= */

export default function ScreenMain({ onRequestSignUp }) {
    const { currentUser } = useAuth();
    const isLinkedAccount = ["test@test.com", "test@gmail.com"].includes(
        currentUser?.email?.toLowerCase?.() || "",
    );

    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    /* ---------- month ---------- */
    const [monthLabel] = useState("10월");

    const [incomeEntries, setIncomeEntries] = useState(DEFAULT_INCOME_ENTRIES);
    const [spendEntries, setSpendEntries] = useState(DEFAULT_SPEND_ENTRIES);
    const [planBudget, setPlanBudget] = useState({
        incomeBudget: 3780000,
        spendBudget: 3500000,
        variableBudget: 1270000,
    });
    const [budgetInputs, setBudgetInputs] = useState({
        incomeBudget: "3780000",
        spendBudget: "3500000",
        variableBudget: "1270000",
    });

    /* ---------- 편집 입력 (문자열) ---------- */
    const [categoryAmountInput, setCategoryAmountInput] = useState({});
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [newEntryDraft, setNewEntryDraft] = useState({
        entryType: "spend",
        paymentLabel: "",
        paymentLogo: "",
        paymentKey: "",
        amount: "",
        categoryKey: CATEGORY_OPTIONS[0].key,
        paymentGroupKey: "card",
        spendType: "variable",
        status: "paid",
        dateLabel: "",
    });

    const ensureLinkedAccount = () => {
        if (!isLinkedAccount) {
            setIsSignUpModalOpen(true);
            return false;
        }
        return true;
    };

    useEffect(() => {
        setBudgetInputs({
            incomeBudget: String(planBudget.incomeBudget),
            spendBudget: String(planBudget.spendBudget),
            variableBudget: String(planBudget.variableBudget),
        });
    }, [planBudget]);

    const incomeTotal = useMemo(
        () => incomeEntries.reduce((acc, entry) => acc + Math.max(0, entry.amount), 0),
        [incomeEntries],
    );

    const spendTotal = useMemo(
        () => spendEntries.reduce((acc, entry) => acc + Math.max(0, entry.amount), 0),
        [spendEntries],
    );

    const categorySummaries = useMemo(() => {
        const map = new Map();
        spendEntries.forEach((entry) => {
            const current = map.get(entry.categoryKey) ?? {
                key: entry.categoryKey,
                label:
                    CATEGORY_OPTIONS.find((option) => option.key === entry.categoryKey)?.label ||
                    entry.categoryLabel,
                amount: 0,
                entries: [],
            };
            current.amount += Math.max(0, entry.amount);
            current.entries.push(entry);
            map.set(entry.categoryKey, current);
        });

        const total = Array.from(map.values()).reduce((acc, category) => acc + category.amount, 0);
        const ordered = CATEGORY_OPTIONS.map((option, index) => {
            const summary = map.get(option.key) ?? {
                key: option.key,
                label: option.label,
                amount: 0,
                entries: [],
            };
            const percent = total > 0 ? Math.round((summary.amount / total) * 100) : 0;
            return {
                ...summary,
                percent,
                tone: option.defaultTone || (index === 0 ? "primary" : "soft"),
            };
        });

        return ordered;
    }, [spendEntries]);

    const categoryTotal = useMemo(
        () => categorySummaries.reduce((acc, category) => acc + category.amount, 0),
        [categorySummaries],
    );

    useEffect(() => {
        const next = {};
        categorySummaries.forEach((c) => {
            next[c.key] = String(c.amount);
        });
        setCategoryAmountInput(next);
    }, [categorySummaries]);

    const categorySegments = useMemo(() => {
        return categorySummaries.map((c) => ({
            key: c.key,
            label: c.label,
            value: c.amount,
            tone: c.tone,
        }));
    }, [categorySummaries]);

    const handleClickSignUp = () => {
        setIsSignUpModalOpen(false);
        onRequestSignUp?.();
    };

    const maskText = "??";

    const formatMaskedKoreanWon = (value) =>
        isLinkedAccount ? formatKoreanWon(value) : maskText;

    const formatMaskedCount = (value) => (isLinkedAccount ? value : maskText);

    const formatMaskedPercent = (value) =>
        isLinkedAccount ? `${value}%` : maskText;

    const displayCategorySegments = useMemo(() => {
        if (isLinkedAccount) return categorySegments;
        return categorySegments.map((segment) => ({ ...segment, value: 0 }));
    }, [categorySegments, isLinkedAccount]);

    const paymentGroups = useMemo(() => {
        const groupMap = new Map();

        spendEntries.forEach((entry) => {
            const groupKey = entry.paymentGroupKey || "other";
            const groupMeta = PAYMENT_GROUP_META[groupKey];
            const groupLabel = groupMeta?.label || entry.paymentGroupLabel || "기타 지출수단";

            if (!groupMap.has(groupKey)) {
                groupMap.set(groupKey, {
                    key: groupKey,
                    label: groupLabel,
                    total: 0,
                    items: new Map(),
                });
            }

            const group = groupMap.get(groupKey);
            const existingItem =
                group.items.get(entry.paymentKey) || {
                    key: entry.paymentKey,
                    label: entry.paymentLabel || entry.paymentKey,
                    logoText: entry.paymentLogo || entry.paymentLabel?.[0] || "•",
                    amount: 0,
                };

            existingItem.amount += Math.max(0, entry.amount);
            group.items.set(entry.paymentKey, existingItem);
            group.total += Math.max(0, entry.amount);
        });

        return Array.from(groupMap.values()).map((group) => ({
            ...group,
            items: Array.from(group.items.values()),
        }));
    }, [spendEntries]);

    const buildSpendStats = (targetType) => {
        const targetEntries = spendEntries.filter((entry) => entry.spendType === targetType);
        const plannedEntries = targetEntries.filter((entry) => entry.status === "planned");
        const paidEntries = targetEntries.filter((entry) => entry.status !== "planned");

        const plannedAmount = plannedEntries.reduce(
            (acc, entry) => acc + Math.max(0, entry.amount),
            0,
        );
        const paidAmount = paidEntries.reduce((acc, entry) => acc + Math.max(0, entry.amount), 0);

        return {
            plannedAmount,
            paidAmount,
            plannedCount: plannedEntries.length,
            paidCount: paidEntries.length,
        };
    };

    const regularStats = useMemo(() => buildSpendStats("regular"), [spendEntries]);
    const variableStats = useMemo(() => buildSpendStats("variable"), [spendEntries]);

    const report = useMemo(() => {
        return {
            incomeTotal,
            incomeHint: planBudget.incomeBudget,
            spendTotal,
            spendHint: planBudget.spendBudget,
            regularPlanned: regularStats.plannedAmount,
            regularPaid: regularStats.paidAmount,
            regularCountPlanned: regularStats.plannedCount,
            regularCountPaid: regularStats.paidCount,
            variablePlanned: variableStats.plannedAmount,
            variablePaid: variableStats.paidAmount,
            variableHint: planBudget.variableBudget,
        };
    }, [incomeTotal, planBudget, regularStats, spendTotal, variableStats]);

    /* ---------- 바텀시트(내역 드릴다운) ---------- */
    const [sheetState, setSheetState] = useState({
        isOpen: false,
        title: "",
        items: [],
    });

    const openSheet = ({ title, items }) => {
        setSheetState({ isOpen: true, title, items });
        document.documentElement.classList.add("is_sheet_open");
    };

    const closeSheet = () => {
        setSheetState((prev) => ({ ...prev, isOpen: false }));
        document.documentElement.classList.remove("is_sheet_open");
    };

    /* ---------- animation time (도넛 숨쉬기) ---------- */
    const [animationTime, setAnimationTime] = useState(0);
    useRequestAnimationFrameLoop(!isEditMode, (dt) => {
        setAnimationTime((t) => t + dt);
    });

    /* =========================
     * handlers
     * ========================= */

    const resolveCategoryLabel = (categoryKey) =>
        CATEGORY_OPTIONS.find((option) => option.key === categoryKey)?.label || "카테고리";

    const buildSheetItems = (entries) =>
        entries.map((entry) => ({
            id: entry.id,
            title: entry.paymentLabel || resolveCategoryLabel(entry.categoryKey),
            amount: entry.amount,
            date: entry.dateLabel || monthLabel,
            sub: `${resolveCategoryLabel(entry.categoryKey)} · ${
                entry.spendType === "regular" ? "정기" : "변동"
            }${entry.status === "planned" ? " 예정" : ""}`,
        }));

    const handleClickPaymentItem = (itemKey, label) => {
        if (!ensureLinkedAccount()) return;
        const items = spendEntries.filter((entry) => entry.paymentKey === itemKey);
        openSheet({ title: `${label} 내역`, items: buildSheetItems(items) });
    };

    const handleClickCategoryRow = (categoryKey, label) => {
        if (!ensureLinkedAccount()) return;
        const items = spendEntries.filter((entry) => entry.categoryKey === categoryKey);
        openSheet({ title: `${label} 내역`, items: buildSheetItems(items) });
    };

    const handleToggleEditMode = () => {
        if (!ensureLinkedAccount()) return;
        setIsEditMode((v) => !v);
    };

    const handleClickAddMyData = () => {
        if (!ensureLinkedAccount()) return;
        setIsAddFormOpen((prev) => !prev);
    };

    const commitCategoryAmount = (categoryKey) => {
        const raw = categoryAmountInput[categoryKey];
        const parsed = clampValue(parseNumberSafely(raw), 0, 20000000);

        setSpendEntries((prev) => {
            const entriesForCategory = prev.filter((entry) => entry.categoryKey === categoryKey);
            if (!entriesForCategory.length) return prev;

            const [primary] = entriesForCategory;
            const totalCurrent = entriesForCategory.reduce(
                (acc, entry) => acc + Math.max(0, entry.amount),
                0,
            );
            const delta = parsed - totalCurrent;
            const nextPrimaryAmount = Math.max(0, (primary.amount || 0) + delta);

            return prev.map((entry) => {
                if (entry.categoryKey !== categoryKey) return entry;
                if (entry.id === primary.id) return { ...entry, amount: nextPrimaryAmount };
                return entry;
            });
        });

        setCategoryAmountInput((prev) => ({ ...prev, [categoryKey]: String(parsed) }));
    };

    const handleEnterCommit = (event, categoryKey) => {
        if (event.key !== "Enter") return;
        event.currentTarget.blur();
        commitCategoryAmount(categoryKey);
    };

    const commitBudgetInput = (key) => {
        const parsed = clampValue(parseNumberSafely(budgetInputs[key]), 0, 5000000000);
        setPlanBudget((prev) => ({ ...prev, [key]: parsed }));
        setBudgetInputs((prev) => ({ ...prev, [key]: String(parsed) }));
    };

    const handleSubmitMyData = (event) => {
        event?.preventDefault?.();
        if (!ensureLinkedAccount()) return;

        const parsedAmount = clampValue(parseNumberSafely(newEntryDraft.amount), 0, 20000000);
        if (!parsedAmount) return;

        if (newEntryDraft.entryType === "income") {
            const label = newEntryDraft.paymentLabel?.trim() || "추가 수입";
            const nextIncome = {
                id: `income-${Date.now()}`,
                label,
                amount: parsedAmount,
            };
            setIncomeEntries((prev) => [...prev, nextIncome]);
        } else {
            const categoryLabel = resolveCategoryLabel(newEntryDraft.categoryKey);
            const paymentLabel = newEntryDraft.paymentLabel?.trim() || "새 지출수단";
            const paymentKey =
                newEntryDraft.paymentKey ||
                `${newEntryDraft.paymentGroupKey}-${slugifyKey(paymentLabel, "payment")}`;
            const paymentLogo =
                (newEntryDraft.paymentLogo || paymentLabel[0] || "•").toUpperCase().slice(0, 1);

            const nextEntry = {
                id: `entry-${Date.now()}`,
                categoryKey: newEntryDraft.categoryKey,
                categoryLabel,
                amount: parsedAmount,
                paymentKey,
                paymentLabel,
                paymentLogo,
                paymentGroupKey: newEntryDraft.paymentGroupKey,
                paymentGroupLabel:
                    PAYMENT_GROUP_META[newEntryDraft.paymentGroupKey]?.label || "지출수단",
                spendType: newEntryDraft.spendType,
                status: newEntryDraft.status,
                dateLabel: newEntryDraft.dateLabel || monthLabel,
            };

            setSpendEntries((prev) => [...prev, nextEntry]);
        }

        setNewEntryDraft((prev) => ({
            ...prev,
            paymentLabel: "",
            paymentLogo: "",
            paymentKey: "",
            amount: "",
            dateLabel: "",
        }));
        setIsAddFormOpen(false);
    };

    return (
        <Screen className="screen_main mobile_budget">
            <Title>쉬운 가계부,</Title>
            <Subtitle>마이데이터를 연결하면 자동으로 지출/수입을 분류해요.</Subtitle>
            <p className="description">내 입맛에 맞게 카테고리를 재분류할 수 있어요.</p>

            <Inner>
                <div className="stack">
                    {/* ======================
                     * 1) REPORT (첫 화면)
                     * ====================== */}
                    <section className="card report" aria-label="리포트">
                        <div className="report_head">
                            <div className="report_title">리포트</div>

                            <button type="button" className="month_btn" aria-label="월 선택">
                                <span className="month_btn__label">{monthLabel}</span>
                                <FiChevronDown />
                            </button>
                        </div>

                        <div className="report_kpi">
                            <div className="kpi_box kpi_income">
                                <div className="kpi_label_row">
                                    <div className="kpi_label">총 수입</div>
                                    {isLinkedAccount && (
                                        <BaseButton
                                            type="button"
                                            size="sm"
                                            style={
                                                isEditMode
                                                    ? "btn_solid__primary"
                                                    : "btn_outline__grey"
                                            }
                                            className="kpi_edit_btn"
                                            onClick={handleToggleEditMode}
                                            aria-label="예산 편집"
                                            title="예산 편집"
                                        >
                                            <FiEdit3 />
                                        </BaseButton>
                                    )}
                                </div>
                                <div className="kpi_value">
                                    {formatMaskedKoreanWon(report.incomeTotal)}
                                </div>
                                <div className="kpi_hint muted">
                                    예산{" "}
                                    {isEditMode ? (
                                        <input
                                            className="inline_input"
                                            inputMode="numeric"
                                            value={budgetInputs.incomeBudget}
                                            onChange={(e) =>
                                                setBudgetInputs((prev) => ({
                                                    ...prev,
                                                    incomeBudget: e.target.value,
                                                }))
                                            }
                                            onBlur={() => commitBudgetInput("incomeBudget")}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.currentTarget.blur();
                                                    commitBudgetInput("incomeBudget");
                                                }
                                            }}
                                            aria-label="총 수입 예산 수정"
                                        />
                                    ) : (
                                        formatMaskedKoreanWon(report.incomeHint)
                                    )}
                                </div>
                            </div>

                            <div className="kpi_box kpi_spend">
                                <div className="kpi_label_row">
                                    <div className="kpi_label">총 지출</div>
                                    {isLinkedAccount && (
                                        <BaseButton
                                            type="button"
                                            size="sm"
                                            style={
                                                isEditMode
                                                    ? "btn_solid__primary"
                                                    : "btn_outline__grey"
                                            }
                                            className="kpi_edit_btn"
                                            onClick={handleToggleEditMode}
                                            aria-label="예산 편집"
                                            title="예산 편집"
                                        >
                                            <FiEdit3 />
                                        </BaseButton>
                                    )}
                                </div>
                                <div className="kpi_value">
                                    {formatMaskedKoreanWon(report.spendTotal)}
                                </div>
                                <div className="kpi_hint muted">
                                    예산{" "}
                                    {isEditMode ? (
                                        <input
                                            className="inline_input"
                                            inputMode="numeric"
                                            value={budgetInputs.spendBudget}
                                            onChange={(e) =>
                                                setBudgetInputs((prev) => ({
                                                    ...prev,
                                                    spendBudget: e.target.value,
                                                }))
                                            }
                                            onBlur={() => commitBudgetInput("spendBudget")}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.currentTarget.blur();
                                                    commitBudgetInput("spendBudget");
                                                }
                                            }}
                                            aria-label="총 지출 예산 수정"
                                        />
                                    ) : (
                                        formatMaskedKoreanWon(report.spendHint)
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="report_blocks">
                            <div className="report_block">
                                <div className="block_head">
                                    <div className="block_title">정기지출</div>
                                    <div className="block_badges">
                                        <span className="badge">
                                            지출 예정 {formatMaskedCount(report.regularCountPlanned)}
                                            건
                                        </span>
                                        <span className="badge">
                                            지출 완료 {formatMaskedCount(report.regularCountPaid)}건
                                        </span>
                                    </div>
                                </div>

                                <div className="block_rows">
                                    <div className="row">
                                        <span className="row_label muted">지출 예정</span>
                                        <b className="row_value">
                                            {formatMaskedKoreanWon(report.regularPlanned)}
                                        </b>
                                    </div>
                                    <div className="row">
                                        <span className="row_label muted">지출 완료</span>
                                        <b className="row_value">
                                            {formatMaskedKoreanWon(report.regularPaid)}
                                        </b>
                                    </div>
                                </div>
                            </div>

                            <div className="report_block">
                                <div className="block_head">
                                    <div className="block_title">변동지출</div>
                                </div>

                                <div className="block_rows">
                                    <div className="row">
                                        <span className="row_label muted">지출 예산</span>
                                        <b className="row_value">
                                            {formatMaskedKoreanWon(report.variablePlanned)}
                                        </b>
                                    </div>
                                    <div className="row">
                                        <span className="row_label muted">지출</span>
                                        <b className="row_value">
                                            {formatMaskedKoreanWon(report.variablePaid)}
                                        </b>
                                    </div>
                                    <div className="row row_hint">
                                        <span className="row_label muted">예상</span>
                                        <b className="row_value muted">
                                            {formatMaskedKoreanWon(report.variableHint)}
                                        </b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ======================
                     * 2) PAYMENT METHODS
                     * ====================== */}
                    <section className="card pay" aria-label="지출 수단">
                        <div className="panel_head">
                            <div className="panel_title">지출수단</div>
                            <div className="panel_value">
                                {formatMaskedKoreanWon(report.spendTotal)}
                            </div>
                        </div>

                        <div className="pay_groups">
                            {paymentGroups.map((group) => (
                                <div key={group.key} className="pay_group">
                                    <div className="pay_group__head">
                                        <div className="pay_group__title">{group.label}</div>
                                        <div className="pay_group__total">
                                            {formatMaskedKoreanWon(group.total)}
                                        </div>
                                    </div>

                                    <ul className="list">
                                        {group.items.map((item) => (
                                            <li key={item.key} className="list_row">
                                                <div className="list_left">
                                                    <span className="avatar" aria-hidden="true">
                                                        {item.logoText}
                                                    </span>
                                                    <span className="list_label">{item.label}</span>
                                                </div>

                                                <div className="list_right">
                                                    <b className="list_value">
                                                        {formatMaskedKoreanWon(item.amount)}
                                                    </b>
                                                    <button
                                                        type="button"
                                                        className="arrow_btn"
                                                        aria-label={`${item.label} 내역 보기`}
                                                        onClick={() =>
                                                            handleClickPaymentItem(
                                                                item.key,
                                                                item.label,
                                                            )
                                                        }
                                                    >
                                                        ›
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="pay_add">
                            <button
                                type="button"
                                className="add_btn"
                                onClick={handleClickAddMyData}
                            >
                                마이데이터 추가 <span className="add_plus">+</span>
                            </button>

                            {isAddFormOpen && (
                                <form className="add_form" onSubmit={handleSubmitMyData}>
                                    <div className="add_form__grid">
                                        <label className="add_field">
                                            <span className="add_field__label">데이터 유형</span>
                                            <select
                                                value={newEntryDraft.entryType}
                                                onChange={(e) =>
                                                    setNewEntryDraft((prev) => ({
                                                        ...prev,
                                                        entryType: e.target.value,
                                                    }))
                                                }
                                            >
                                                <option value="spend">지출</option>
                                                <option value="income">수입</option>
                                            </select>
                                        </label>

                                        <label className="add_field">
                                            <span className="add_field__label">
                                                {newEntryDraft.entryType === "income"
                                                    ? "수입 이름"
                                                    : "지출수단 이름"}
                                            </span>
                                            <input
                                                type="text"
                                                value={newEntryDraft.paymentLabel}
                                                onChange={(e) =>
                                                    setNewEntryDraft((prev) => ({
                                                        ...prev,
                                                        paymentLabel: e.target.value,
                                                    }))
                                                }
                                                placeholder="예) 알바, 신한카드"
                                            />
                                        </label>

                                        <label className="add_field">
                                            <span className="add_field__label">금액</span>
                                            <input
                                                type="number"
                                                inputMode="numeric"
                                                value={newEntryDraft.amount}
                                                onChange={(e) =>
                                                    setNewEntryDraft((prev) => ({
                                                        ...prev,
                                                        amount: e.target.value,
                                                    }))
                                                }
                                                placeholder="0"
                                            />
                                        </label>

                                        {newEntryDraft.entryType === "spend" && (
                                            <>
                                                <label className="add_field">
                                                    <span className="add_field__label">
                                                        카테고리
                                                    </span>
                                                    <select
                                                        value={newEntryDraft.categoryKey}
                                                        onChange={(e) =>
                                                            setNewEntryDraft((prev) => ({
                                                                ...prev,
                                                                categoryKey: e.target.value,
                                                            }))
                                                        }
                                                    >
                                                        {CATEGORY_OPTIONS.map((option) => (
                                                            <option key={option.key} value={option.key}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </label>

                                                <label className="add_field">
                                                    <span className="add_field__label">
                                                        지출 수단
                                                    </span>
                                                    <select
                                                        value={newEntryDraft.paymentGroupKey}
                                                        onChange={(e) =>
                                                            setNewEntryDraft((prev) => ({
                                                                ...prev,
                                                                paymentGroupKey: e.target.value,
                                                            }))
                                                        }
                                                    >
                                                        {Object.values(PAYMENT_GROUP_META).map((group) => (
                                                            <option key={group.key} value={group.key}>
                                                                {group.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </label>

                                                <label className="add_field">
                                                    <span className="add_field__label">지출 구분</span>
                                                    <select
                                                        value={newEntryDraft.spendType}
                                                        onChange={(e) =>
                                                            setNewEntryDraft((prev) => ({
                                                                ...prev,
                                                                spendType: e.target.value,
                                                            }))
                                                        }
                                                    >
                                                        <option value="regular">정기</option>
                                                        <option value="variable">변동</option>
                                                    </select>
                                                </label>

                                                <label className="add_field">
                                                    <span className="add_field__label">상태</span>
                                                    <select
                                                        value={newEntryDraft.status}
                                                        onChange={(e) =>
                                                            setNewEntryDraft((prev) => ({
                                                                ...prev,
                                                                status: e.target.value,
                                                            }))
                                                        }
                                                    >
                                                        <option value="paid">완료</option>
                                                        <option value="planned">예정</option>
                                                    </select>
                                                </label>

                                                <label className="add_field">
                                                    <span className="add_field__label">표시 날짜</span>
                                                    <input
                                                        type="text"
                                                        value={newEntryDraft.dateLabel}
                                                        onChange={(e) =>
                                                            setNewEntryDraft((prev) => ({
                                                                ...prev,
                                                                dateLabel: e.target.value,
                                                            }))
                                                        }
                                                        placeholder="10/30"
                                                    />
                                                </label>
                                            </>
                                        )}
                                    </div>

                                    <div className="add_actions">
                                        <BaseButton type="submit" style="btn_solid__primary">
                                            추가하기
                                        </BaseButton>
                                    </div>
                                </form>
                            )}
                        </div>
                    </section>

                    {/* ======================
                     * 3) CATEGORY SPEND (도넛+리스트)
                     * ====================== */}
                    <section className="card cat" aria-label="카테고리별 지출">
                        <div className="panel_head">
                            <div className="panel_title">
                                카테고리별 지출{" "}
                                <span className="muted">
                                    ({formatMaskedCount(categorySummaries.length)}개)
                                </span>
                            </div>

                            <BaseButtonContainer className="cat_actions">
                                <BaseButton
                                    type="button"
                                    size="sm"
                                    style={
                                        isEditMode ? "btn_solid__primary" : "btn_outline__grey"
                                    }
                                    onClick={handleToggleEditMode}
                                    aria-label="편집 모드 토글"
                                    title="편집"
                                >
                                    <FiEdit3 />
                                </BaseButton>
                            </BaseButtonContainer>
                        </div>

                        <div className="cat_donut">
                            <DonutChart
                                segments={displayCategorySegments}
                                centerTopLabel="지출 합계"
                                centerValue={categoryTotal}
                                centerBottomLabel="이번 달"
                                animationTime={animationTime}
                                isPaused={isEditMode}
                                isMasked={!isLinkedAccount}
                            />
                        </div>

                        <ul className="cat_list" aria-label="카테고리 리스트">
                            {categorySummaries.map((c, index) => {
                                const dotTone =
                                    index === 0 ? "primary" : index === 1 ? "dark" : "soft";

                                return (
                                    <li key={c.key} className="cat_row">
                                        <div className="cat_left">
                                            <span
                                                className={`dot dot_${dotTone}`}
                                                aria-hidden="true"
                                            />
                                            <div className="cat_text">
                                                <div className="cat_label">{c.label}</div>
                                                <div className="cat_meta muted">
                                                    {formatMaskedPercent(c.percent)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="cat_right">
                                            {!isEditMode ? (
                                                <b className="cat_value">
                                                    {formatMaskedKoreanWon(c.amount)}
                                                </b>
                                            ) : (
                                                <input
                                                    className="cat_input"
                                                    inputMode="numeric"
                                                    value={categoryAmountInput[c.key] ?? ""}
                                                    onChange={(e) => {
                                                        const nextValue = e.target.value;
                                                        setCategoryAmountInput((prev) => ({
                                                            ...prev,
                                                            [c.key]: nextValue,
                                                        }));
                                                    }}
                                                    onBlur={() => commitCategoryAmount(c.key)}
                                                    onKeyDown={(e) => handleEnterCommit(e, c.key)}
                                                    aria-label={`${c.label} 금액 수정`}
                                                />
                                            )}

                                            <button
                                                type="button"
                                                className="arrow_btn"
                                                aria-label={`${c.label} 내역 보기`}
                                                onClick={() =>
                                                    handleClickCategoryRow(c.key, c.label)
                                                }
                                            >
                                                ›
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                </div>
            </Inner>

            <AuthRequiredModal
                isOpen={isSignUpModalOpen}
                onClose={() => setIsSignUpModalOpen(false)}
                onConfirm={handleClickSignUp}
            />

            {/* ======================
             * BottomSheet
             * ====================== */}
            <BottomSheet
                isOpen={sheetState.isOpen}
                title={sheetState.title}
                items={sheetState.items}
                onClose={closeSheet}
            />
        </Screen>
    );
}

/* =========================
 * DonutChart (모바일 카드용)
 * ========================= */

function DonutChart({
    segments = [],
    centerTopLabel,
    centerValue,
    centerBottomLabel,
    animationTime,
    isPaused,
    isMasked,
}) {
    const size = 210;
    const strokeWidth = 18;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const totalValue = Math.max(
        1,
        segments.reduce((acc, s) => acc + Math.max(0, s.value), 0),
    );

    const startAt = -90;

    // 살짝 숨쉬기(멈추면 0)
    const pulse = isPaused ? 0 : 0.5 + 0.5 * Math.sin(animationTime * 2.0);
    const ringOpacity = 0.18 + pulse * 0.12;

    let cumulative = 0;

    return (
        <div className="donut" style={{ width: `${size}px`, height: `${size}px` }}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                role="img"
                aria-label="도넛 그래프"
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    className="donut_bg"
                    strokeWidth={strokeWidth}
                    style={{ opacity: ringOpacity }}
                />

                {segments.map((segment) => {
                    const safeValue = Math.max(0, segment.value);
                    const ratio = safeValue / totalValue;

                    const segmentLength = ratio * circumference;
                    const dashArray = `${segmentLength} ${circumference - segmentLength}`;
                    const dashOffset = circumference * (1 - cumulative);

                    cumulative += ratio;

                    return (
                        <circle
                            key={segment.key}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            className={`donut_seg tone_${segment.tone || "soft"}`}
                            strokeWidth={strokeWidth}
                            strokeDasharray={dashArray}
                            strokeDashoffset={dashOffset}
                            transform={`rotate(${startAt} ${size / 2} ${size / 2})`}
                        />
                    );
                })}
            </svg>

            <div className="donut_center">
                <div className="donut_top muted">{centerTopLabel}</div>
                <div className="donut_value">
                    {isMasked ? "??" : formatKoreanWonShort(centerValue)}
                </div>
                <div className="donut_bottom muted">{centerBottomLabel}</div>
            </div>
        </div>
    );
}

function AuthRequiredModal({ isOpen, onClose, onConfirm }) {
    return (
        <div className={`modal ${isOpen ? "is_open" : ""}`} aria-hidden={!isOpen}>
            <div className="modal_dim" onClick={onClose} />
            <div className="modal_panel" role="dialog" aria-modal="true">
                <div className="modal_title">회원가입시 사용 가능합니다</div>
                <p className="modal_desc">
                    로그인 또는 회원가입 후 마이데이터를 연동하면 지출/수입 정보를 확인하고
                    수정할 수 있어요.
                </p>

                <div className="modal_actions">
                    <button type="button" className="modal_btn" onClick={onClose}>
                        닫기
                    </button>
                    <button
                        type="button"
                        className="modal_btn modal_btn__primary"
                        onClick={onConfirm}
                    >
                        회원가입 하기
                    </button>
                </div>
            </div>
        </div>
    );
}

/* =========================
 * BottomSheet
 * ========================= */

function BottomSheet({ isOpen, title, items, onClose }) {
    return (
        <div className={`sheet ${isOpen ? "is_open" : ""}`} aria-hidden={!isOpen}>
            <div className="sheet_dim" onClick={onClose} />

            <div className="sheet_panel" role="dialog" aria-label={title || "내역"}>
                <div className="sheet_head">
                    <div className="sheet_title">{title || "내역"}</div>
                    <button
                        type="button"
                        className="sheet_close"
                        onClick={onClose}
                        aria-label="닫기"
                    >
                        <FiX />
                    </button>
                </div>

                {(!items || items.length === 0) && (
                    <div className="sheet_empty muted">표시할 내역이 없어요.</div>
                )}

                {items && items.length > 0 && (
                    <ul className="tx_list" aria-label="거래 내역">
                        {items.map((tx) => (
                            <li key={tx.id} className="tx_row">
                                <div className="tx_left">
                                    <div className="tx_title">{tx.title}</div>
                                    <div className="tx_meta muted">
                                        {tx.date} · {tx.sub}
                                    </div>
                                </div>
                                <div className="tx_right">
                                    <b className="tx_amount">{formatKoreanWon(tx.amount)}</b>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
