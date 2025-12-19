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
 * demo transactions
 * ========================= */

const makeTx = (id, title, amount, date, sub) => ({ id, title, amount, date, sub });

const DEMO_TRANSACTIONS = {
    card_shinhan: [
        makeTx("c1", "스타벅스", 6500, "10/18", "카드"),
        makeTx("c2", "GS25", 4200, "10/18", "카드"),
        makeTx("c3", "쿠팡", 38900, "10/17", "카드"),
    ],
    card_hyundai: [
        makeTx("c4", "버거킹", 12400, "10/16", "카드"),
        makeTx("c5", "교보문고", 18500, "10/15", "카드"),
    ],
    card_kb: [
        makeTx("c6", "넷플릭스", 17000, "10/12", "구독"),
        makeTx("c7", "유튜브 프리미엄", 14900, "10/12", "구독"),
    ],
    cash: [makeTx("m1", "현금 인출", 50000, "10/10", "현금")],

    cat_food: [
        makeTx("t1", "김밥천국", 12000, "10/18", "식비"),
        makeTx("t2", "스타벅스", 6500, "10/18", "외식비"),
        makeTx("t3", "마켓컬리", 54000, "10/16", "식비"),
    ],
    cat_loan: [makeTx("t4", "대출 이자", 210000, "10/15", "대출")],
    cat_ins: [makeTx("t5", "실손보험", 200000, "10/08", "보험")],
    cat_house: [makeTx("t6", "관리비", 140000, "10/03", "주거")],
    cat_misc: [
        makeTx("t7", "통신요금", 45000, "10/02", "통신"),
        makeTx("t8", "수수료", 12000, "10/01", "수수료"),
    ],
};

/* =========================
 * ScreenMain (Mobile)
 * ========================= */

export default function ScreenMain({ onRequestSignUp }) {
    const { currentUser } = useAuth();
    const isLinkedAccount =
        currentUser?.email?.toLowerCase?.() === "test@test.com" || false;

    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    /* ---------- month ---------- */
    const [monthLabel] = useState("10월");

    /* ---------- 리포트 요약 (데모) ---------- */
    const report = useMemo(() => {
        return {
            incomeTotal: 0,
            incomeHint: 3780000,

            spendTotal: 1570000,
            spendHint: 3500000,

            regularPlanned: 400000,
            regularPaid: 925000,
            regularCountPlanned: 3,
            regularCountPaid: 4,

            variablePlanned: 1865000,
            variablePaid: 595000,
            variableHint: 1270000,
        };
    }, []);

    /* ---------- 지출 수단 (데모) ---------- */
    const [paymentGroups] = useState([
        {
            key: "card",
            label: "카드지출",
            total: 649000,
            items: [
                { key: "card_shinhan", label: "신한카드", amount: 240000, logoText: "S" },
                { key: "card_hyundai", label: "현대카드", amount: 185000, logoText: "H" },
                { key: "card_kb", label: "KB국민카드", amount: 175000, logoText: "K" },
                { key: "card_other", label: "우리카드", amount: 49000, logoText: "W" },
            ],
        },
        {
            key: "cash",
            label: "현금지출",
            total: 50000,
            items: [{ key: "cash", label: "현금", amount: 50000, logoText: "₩" }],
        },
    ]);

    /* ---------- 카테고리별 지출 ---------- */
    const [isCategoryEditMode, setIsCategoryEditMode] = useState(false);

    const [categorySpend, setCategorySpend] = useState([
        { key: "cat_food", label: "식비·외식비", amount: 660000, percent: 38 },
        { key: "cat_loan", label: "대출", amount: 550000, percent: 35 },
        { key: "cat_ins", label: "보험", amount: 200000, percent: 13 },
        { key: "cat_house", label: "주거·관리", amount: 140000, percent: 8 },
        { key: "cat_misc", label: "결제·소통", amount: 45000, percent: 3 },
    ]);

    /* ---------- 편집 입력 (문자열) ---------- */
    const [categoryAmountInput, setCategoryAmountInput] = useState(() => {
        const next = {};
        categorySpend.forEach((c) => (next[c.key] = String(c.amount)));
        return next;
    });

    useEffect(() => {
        // 카테고리 목록 변경 시 입력도 보정
        setCategoryAmountInput((prev) => {
            const next = { ...prev };
            categorySpend.forEach((c) => {
                if (next[c.key] == null) next[c.key] = String(c.amount);
            });
            return next;
        });
    }, [categorySpend]);

    const categoryTotal = useMemo(() => {
        return categorySpend.reduce((acc, c) => acc + Math.max(0, c.amount), 0);
    }, [categorySpend]);

    const categorySegments = useMemo(() => {
        // 도넛 색을 "CSS class 톤"으로 구분 (living/leak 느낌보다 category tone)
        // 여기선 2종만 쓰고, 나머지는 동일 톤으로 처리
        return categorySpend.map((c, index) => {
            const tone = index === 0 ? "primary" : index === 1 ? "dark" : "soft";
            return { key: c.key, label: c.label, value: c.amount, tone };
        });
    }, [categorySpend]);

    const ensureLinkedAccount = () => {
        if (!isLinkedAccount) {
            setIsSignUpModalOpen(true);
            return false;
        }
        return true;
    };

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
    useRequestAnimationFrameLoop(!isCategoryEditMode, (dt) => {
        setAnimationTime((t) => t + dt);
    });

    /* =========================
     * handlers
     * ========================= */

    const handleClickPaymentItem = (itemKey, label) => {
        if (!ensureLinkedAccount()) return;
        const items = DEMO_TRANSACTIONS[itemKey] || [];
        openSheet({ title: `${label} 내역`, items });
    };

    const handleClickCategoryRow = (categoryKey, label) => {
        if (!ensureLinkedAccount()) return;
        const items = DEMO_TRANSACTIONS[categoryKey] || [];
        openSheet({ title: `${label} 내역`, items });
    };

    const handleToggleEditMode = () => {
        if (!ensureLinkedAccount()) return;
        setIsCategoryEditMode((v) => !v);
    };

    const handleClickAddMyData = () => {
        if (!ensureLinkedAccount()) return;
    };

    const commitCategoryAmount = (categoryKey) => {
        const raw = categoryAmountInput[categoryKey];
        const parsed = clampValue(parseNumberSafely(raw), 0, 20000000);

        setCategorySpend((prev) =>
            prev.map((c) => (c.key === categoryKey ? { ...c, amount: parsed } : c)),
        );

        setCategoryAmountInput((prev) => ({ ...prev, [categoryKey]: String(parsed) }));
    };

    const handleEnterCommit = (event, categoryKey) => {
        if (event.key !== "Enter") return;
        event.currentTarget.blur();
        commitCategoryAmount(categoryKey);
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
                                <div className="kpi_label">총 수입</div>
                                <div className="kpi_value">
                                    {formatMaskedKoreanWon(report.incomeTotal)}
                                </div>
                                <div className="kpi_hint muted">
                                    예산 {formatMaskedKoreanWon(report.incomeHint)}
                                </div>
                            </div>

                            <div className="kpi_box kpi_spend">
                                <div className="kpi_label">총 지출</div>
                                <div className="kpi_value">
                                    {formatMaskedKoreanWon(report.spendTotal)}
                                </div>
                                <div className="kpi_hint muted">
                                    예산 {formatMaskedKoreanWon(report.spendHint)}
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
                                {formatMaskedKoreanWon(report.regularPaid)}
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
                        </div>
                    </section>

                    {/* ======================
                     * 3) CATEGORY SPEND (도넛+리스트)
                     * ====================== */}
                    <section className="card cat" aria-label="카테고리별 지출">
                        <div className="panel_head">
                            <div className="panel_title">
                                카테고리별 지출{" "}
                                <span className="muted">({formatMaskedCount(categorySpend.length)}개)</span>
                            </div>

                            <BaseButtonContainer className="cat_actions">
                                <BaseButton
                                    type="button"
                                    size="sm"
                                    style={
                                        isCategoryEditMode
                                            ? "btn_solid__primary"
                                            : "btn_outline__grey"
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
                                isPaused={isCategoryEditMode}
                                isMasked={!isLinkedAccount}
                            />
                        </div>

                        <ul className="cat_list" aria-label="카테고리 리스트">
                            {categorySpend.map((c, index) => {
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
                                            {!isCategoryEditMode ? (
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
