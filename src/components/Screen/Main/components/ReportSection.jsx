import BaseButton from "../../../Form/BaseButton";
import { FiChevronDown, FiEdit3 } from "react-icons/fi";

const ReportSection = ({
    monthLabel,
    report,
    budgetInputs,
    isEditMode,
    isLinkedAccount,
    formatMaskedKoreanWon,
    formatMaskedCount,
    onToggleEditMode,
    onBudgetChange,
    onBudgetCommit,
}) => {
    const handleBudgetKeyDown = (event, key) => {
        if (event.key !== "Enter") return;
        event.currentTarget.blur();
        onBudgetCommit(key);
    };

    return (
        <section className="card report" aria-label="리포트">
            <div className="card_head">
                <div className="card_title">리포트</div>

                <button type="button" className="month_btn" aria-label="월 선택">
                    <span className="month_btn__label">{monthLabel}</span>
                    <FiChevronDown />
                </button>
            </div>

            <div className="card_body">
                <div className="card_item">
                    <div className="item_head">
                        <div className="item_title">총 수입</div>
                        {isLinkedAccount && (
                            <BaseButton
                                type="button"
                                size="xs"
                                style={isEditMode ? "btn_solid__primary" : "btn_outline__grey"}
                                onClick={onToggleEditMode}
                                aria-label="예산 편집"
                                title="예산 편집"
                            >
                                <FiEdit3 />
                            </BaseButton>
                        )}
                    </div>
                    <div className="item_value">{formatMaskedKoreanWon(report.incomeTotal)}</div>
                    <div className="item_hint muted">
                        예산 {" "}
                        {isEditMode ? (
                            <input
                                className="inline_input"
                                inputMode="numeric"
                                value={budgetInputs.incomeBudget}
                                onChange={(event) => onBudgetChange("incomeBudget", event.target.value)}
                                onBlur={() => onBudgetCommit("incomeBudget")}
                                onKeyDown={(event) => handleBudgetKeyDown(event, "incomeBudget")}
                                aria-label="총 수입 예산 수정"
                            />
                        ) : (
                            formatMaskedKoreanWon(report.incomeHint)
                        )}
                    </div>
                </div>

                <div className="card_item kpi_spend">
                    <div className="item_head">
                        <div className="item_title">총 지출</div>
                        {isLinkedAccount && (
                            <BaseButton
                                type="button"
                                size="xs"
                                style={isEditMode ? "btn_solid__primary" : "btn_outline__grey"}
                                onClick={onToggleEditMode}
                                aria-label="예산 편집"
                                title="예산 편집"
                            >
                                <FiEdit3 />
                            </BaseButton>
                        )}
                    </div>
                    <div className="item_value">{formatMaskedKoreanWon(report.spendTotal)}</div>
                    <div className="item_hint muted">
                        예산 {" "}
                        {isEditMode ? (
                            <input
                                className="inline_input"
                                inputMode="numeric"
                                value={budgetInputs.spendBudget}
                                onChange={(event) => onBudgetChange("spendBudget", event.target.value)}
                                onBlur={() => onBudgetCommit("spendBudget")}
                                onKeyDown={(event) => handleBudgetKeyDown(event, "spendBudget")}
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
                            <span className="badge">지출 예정 {formatMaskedCount(report.regularCountPlanned)}건</span>
                            <span className="badge">지출 완료 {formatMaskedCount(report.regularCountPaid)}건</span>
                        </div>
                    </div>

                    <div className="block_rows">
                        <div className="row">
                            <span className="row_label muted">지출 예정</span>
                            <b className="row_value">{formatMaskedKoreanWon(report.regularPlanned)}</b>
                        </div>
                        <div className="row">
                            <span className="row_label muted">지출 완료</span>
                            <b className="row_value">{formatMaskedKoreanWon(report.regularPaid)}</b>
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
                            <b className="row_value">{formatMaskedKoreanWon(report.variablePlanned)}</b>
                        </div>
                        <div className="row">
                            <span className="row_label muted">지출</span>
                            <b className="row_value">{formatMaskedKoreanWon(report.variablePaid)}</b>
                        </div>
                        <div className="row row_hint">
                            <span className="row_label muted">예상</span>
                            <b className="row_value muted">{formatMaskedKoreanWon(report.variableHint)}</b>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReportSection;
