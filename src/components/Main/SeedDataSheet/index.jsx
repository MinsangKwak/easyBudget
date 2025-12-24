import "./index.css";

import BaseButton from "../../Form/BaseButton";
import BaseButtonContainer from "../../Form/BaseButtonContainer";
import FormFieldInput from "../../Form/FormFieldInput";
import BottomSheet from "../../Common/Modal/BottomSheet";
import { CATEGORY_OPTIONS, PAYMENT_GROUP_META } from "../constants";
import { formatKoreanWon, parseNumberSafely } from "../utils";

const SeedDataSheet = ({
  isOpen,
  periodLabel,
  seedInputs,
  onClose,
  onSubmit,
  onSeedChange,
}) => {
  const handleInputChange = (field) => (event) => {
    onSeedChange((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleCategoryChange = (categoryKey, field) => (event) => {
    const value = event.target.value;
    onSeedChange((previous) => ({
      ...previous,
      spendCategories: {
        ...previous.spendCategories,
        [categoryKey]: {
          ...previous.spendCategories?.[categoryKey],
          [field]: value,
        },
      },
    }));
  };

  const spendCategoryTotal = Object.values(seedInputs.spendCategories || {}).reduce(
    (accumulator, value) => accumulator + Math.max(0, parseNumberSafely(value?.amount)),
    0,
  );

  return (
    <BottomSheet isOpen={isOpen} title="이번 달 수입/지출 입력" onClose={onClose}>
      <form className="seed_form" onSubmit={onSubmit}>
        <div className="popup_inner">
          <div className="popup_body">
            <p className="seed_period">기간: {periodLabel}</p>

            <FormFieldInput
              id="seedIncome"
              label="총 수입"
              wrapperClassName="form_field add_field"
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={seedInputs.incomeTotal}
              onChange={handleInputChange("incomeTotal")}
            />

            <div className="seed_section">
              <div className="seed_section__head">
                <span className="seed_section__title">카테고리별 지출</span>
                <span className="seed_section__total">
                  합계 {formatKoreanWon(spendCategoryTotal)}
                </span>
              </div>
              {CATEGORY_OPTIONS.map((option) => {
                const categorySeed = seedInputs.spendCategories?.[option.key] || {};
                return (
                  <div key={option.key} className="seed_category">
                    <FormFieldInput
                      id={`seedSpend-${option.key}`}
                      label={option.label}
                      wrapperClassName="form_field add_field"
                      type="number"
                      inputMode="numeric"
                      placeholder="0"
                      value={categorySeed.amount ?? ""}
                      onChange={handleCategoryChange(option.key, "amount")}
                    />
                    <div className="seed_category__meta">
                      <label className="add_field seed_select" htmlFor={`seedSpendGroup-${option.key}`}>
                        <span className="add_field__label">지출 수단</span>
                        <select
                          id={`seedSpendGroup-${option.key}`}
                          value={categorySeed.paymentGroupKey ?? "card"}
                          onChange={handleCategoryChange(option.key, "paymentGroupKey")}
                        >
                          {Object.values(PAYMENT_GROUP_META).map((group) => (
                            <option key={group.key} value={group.key}>
                              {group.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="add_field seed_select" htmlFor={`seedSpendType-${option.key}`}>
                        <span className="add_field__label">지출 구분</span>
                        <select
                          id={`seedSpendType-${option.key}`}
                          value={categorySeed.spendType ?? "variable"}
                          onChange={handleCategoryChange(option.key, "spendType")}
                        >
                          <option value="regular">정기</option>
                          <option value="variable">변동</option>
                        </select>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <BaseButtonContainer className="popup_foot">
            <BaseButton type="submit" style="btn_solid__primary" size="md">
              입력 완료
            </BaseButton>
          </BaseButtonContainer>
        </div>
      </form>
    </BottomSheet>
  );
};

export default SeedDataSheet;
