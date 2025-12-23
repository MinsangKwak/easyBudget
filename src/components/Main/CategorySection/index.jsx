import "./index.css";

import BaseButton from "../../Form/BaseButton";
import BaseButtonContainer from "../../Form/BaseButtonContainer";
import FormFieldInput from "../../Form/FormFieldInput";
import { FiEdit3 } from "react-icons/fi";
import DonutChart from "../DonutChart";

const CategorySection = ({
    id,
    categorySummaries,
    categoryTotal,
    displayCategorySegments,
    isEditMode,
    isLinkedAccount,
    animationTime,
    formatMaskedKoreanWon,
    formatMaskedCount,
    formatMaskedPercent,
    onToggleEditMode,
    periodLabel = "이번 달",
    categoryAmountInput,
    onCategoryChange,
    onCategoryCommit,
    onCategoryEnter,
    onClickCategory,
}) => {
    return (
        <section id={id} className="card cat" aria-label="카테고리별 지출">
            <div className="card_head">
                <div className="card_title">
                    카테고리별 지출{" "}
                    <span className="muted">({formatMaskedCount(categorySummaries.length)}개)</span>
                </div>

                <BaseButtonContainer>
                    <BaseButton
                        type="button"
                        size="xs"
                        style={isEditMode ? "btn_solid__primary" : "btn_outline__grey"}
                        onClick={onToggleEditMode}
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
                    centerBottomLabel={periodLabel}
                    animationTime={animationTime}
                    isPaused={isEditMode}
                    isMasked={!isLinkedAccount}
                />
            </div>

            <ul className="cat_list" aria-label="카테고리 리스트">
                {categorySummaries.map((category) => {
                    const dotTone = category.tone || "lilac";

                    return (
                        <li key={category.key} className="cat_row">
                            <div className="cat_left">
                                <span className={`dot dot_${dotTone}`} aria-hidden="true" />
                                <div className="cat_text">
                                    <div className="cat_label">{category.label}</div>
                                    <div className="cat_meta muted">
                                        {formatMaskedPercent(category.percent)}
                                    </div>
                                </div>
                            </div>

                            <div className="cat_right">
                                {!isEditMode && (
                                    <b className="cat_value">
                                        {formatMaskedKoreanWon(category.amount)}
                                    </b>
                                )}
                                {isEditMode && (
                                    <FormFieldInput
                                        id={`cat-${category.key}`}
                                        label={`${category.label} 금액`}
                                        wrapperClassName="form_field cat_input_wrapper"
                                        inputMode="numeric"
                                        value={categoryAmountInput[category.key] ?? ""}
                                        onChange={(event) =>
                                            onCategoryChange(category.key, event.target.value)
                                        }
                                        onBlur={() => onCategoryCommit(category.key)}
                                        onKeyDown={(event) => onCategoryEnter(event, category.key)}
                                    />
                                )}

                                <button
                                    type="button"
                                    className="arrow_btn"
                                    aria-label={`${category.label} 내역 보기`}
                                    onClick={() => onClickCategory(category.key, category.label)}
                                >
                                    ›
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

export default CategorySection;
