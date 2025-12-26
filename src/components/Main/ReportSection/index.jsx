import "./index.css";

import BaseButton from "../../Form/BaseButton";
import BaseSelectBox from "../../Form/BaseSelectBox";
import FormFieldInput from "../../Form/FormFieldInput";
import { FiEdit3 } from "react-icons/fi";

const ReportSection = ({
  monthLabel,
  monthKey,
  monthOptions,
  onChangeMonth,
  periodFilters = [],
  onChangePeriod,
  report,
  budgetInputs,
  isEditMode,
  isLinkedAccount,
  formatMaskedKoreanWon,
  formatMaskedCount,
  onToggleEditMode,
  onBudgetChange,
  onBudgetCommit,
  reportStatusFilter,
  onChangeReportStatusFilter,
  onOpenSpendEditGuide,
}) => {
  const statusOptions = [
    { key: "all", label: "전체" },
  ];
  const renderDetailList = (items, emptyLabel) => {
    if (!items.length) {
      return <div className="report_detail_empty muted">{emptyLabel}</div>;
    }

    return (
      <ul className="report_detail_list">
        {items.map((item) => (
          <li key={item.id} className="report_detail_row">
            <div>
              <div className="report_detail_title">{item.title}</div>
              <div className="report_detail_meta muted">
                {item.sub} · {item.date}
              </div>
            </div>
            <b className="report_detail_amount">{formatMaskedKoreanWon(item.amount)}</b>
          </li>
        ))}
      </ul>
    );
  };

  const handleBudgetKeyDown = (event, key) => {
    if (event.key !== "Enter") return;
    event.currentTarget.blur();
    onBudgetCommit(key);
  };

  return (
    <section className="card report" aria-label="리포트">
      <div className="card_head">
        <div className="card_title">리포트</div>
      </div>
      <div className="card_filters">
        <div className="report_filters period_filters" role="group" aria-label="기간 필터">
          <BaseSelectBox
            id="report-month"
            label={monthLabel}
            value={monthKey}
            onChange={(event) => onChangeMonth?.(event.target.value)}
            options={monthOptions}
          />

          {/* {periodFilters.map((option) => (
                        <button
                            key={option.key}
                            type="button"
                            className={`filter_chip filter_chip__period ${
                                monthKey === option.key ? "is_active" : ""
                            }`}
                            onClick={() => onChangePeriod?.(option.key)}
                            aria-pressed={monthKey === option.key}
                        >
                            <span className="filter_chip__label">{option.label}</span>
                            <span className="filter_chip__values">
                                <b>총 지출 {formatMaskedKoreanWon(option.spendTotal)}</b>
                                <b>총 수입 {formatMaskedKoreanWon(option.incomeTotal)}</b>
                            </span>
                        </button>
                    ))} */}
        </div>
      </div>

      <div className="card_body">
        <div className="report_filters" role="group" aria-label="리포트 필터">
          {statusOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`filter_chip ${reportStatusFilter === option.key ? "is_active" : ""}`}
              onClick={() => onChangeReportStatusFilter?.(option.key)}
              aria-pressed={reportStatusFilter === option.key}
            >
              {option.label}
            </button>
          ))}
        </div>

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
            <span className="item_hint__title">예산</span>
            {isEditMode && (
              <FormFieldInput
                id="income-budget"
                label="총 수입 예산"
                wrapperClassName="form_field inline_field"
                inputMode="numeric"
                value={budgetInputs.incomeBudget}
                onChange={(event) => onBudgetChange("incomeBudget", event.target.value)}
                onBlur={() => onBudgetCommit("incomeBudget")}
                onKeyDown={(event) => handleBudgetKeyDown(event, "incomeBudget")}
              />
            )}
            {!isEditMode && (
              <span className="item_subtitle">{formatMaskedKoreanWon(report.incomeHint)}</span>
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
                style="btn_outline__grey"
                onClick={onOpenSpendEditGuide}
                aria-label="총 지출 편집 안내"
                title="총 지출 편집 안내"
              >
                <FiEdit3 />
              </BaseButton>
            )}
          </div>
          <div className="item_value">{formatMaskedKoreanWon(report.spendTotal)}</div>
          <div className="item_hint muted">
            <span className="item_hint__title">예산</span>
            <span className="item_subtitle">{formatMaskedKoreanWon(report.spendHint)}</span>
          </div>
        </div>
      </div>

      <div className="report_blocks">
        <div className="report_block">
          <div className="block_head">
            <div className="block_title">정기지출</div>
            <div className="block_badges">
              <span className="badge">
                지출 완료 {formatMaskedCount(report.regularCountPaid)}건
              </span>
            </div>
          </div>

          <div className="block_rows">
            <div className="row">
              <span className="row_label muted">지출 완료</span>
              <b className="row_value">{formatMaskedKoreanWon(report.regularPaid)}</b>
            </div>
          </div>

          <details className="report_accordion">
            <summary className="report_accordion_summary">상세 내역 보기</summary>
            {renderDetailList(report.regularPaidDetails, "정기지출 내역이 없습니다.")}
          </details>
        </div>

        <div className="report_block">
          <div className="block_head">
            <div className="block_title">변동지출</div>
            <div className="block_badges">
              <span className="badge">
                지출 완료 {formatMaskedCount(report.variableCountPaid)}건
              </span>
            </div>
          </div>

          <div className="block_rows">
            <div className="row">
              <span className="row_label muted">지출 완료</span>
              <b className="row_value">{formatMaskedKoreanWon(report.variablePaid)}</b>
            </div>
          </div>

          <details className="report_accordion">
            <summary className="report_accordion_summary">상세 내역 보기</summary>
            {renderDetailList(report.variablePaidDetails, "변동지출 내역이 없습니다.")}
          </details>
        </div>
      </div>
    </section>
  );
};

export default ReportSection;
