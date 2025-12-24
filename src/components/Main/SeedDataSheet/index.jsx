import "./index.css";

import BaseButton from "../../Form/BaseButton";
import BaseButtonContainer from "../../Form/BaseButtonContainer";
import FormFieldInput from "../../Form/FormFieldInput";
import BottomSheet from "../../Common/Modal/BottomSheet";
import { CATEGORY_OPTIONS } from "../constants";
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

  const handleCategoryChange = (categoryKey) => (event) => {
    onSeedChange((previous) => ({
      ...previous,
      spendCategories: {
        ...previous.spendCategories,
        [categoryKey]: event.target.value,
      },
    }));
  };

  const spendCategoryTotal = Object.values(seedInputs.spendCategories || {}).reduce(
    (accumulator, value) => accumulator + Math.max(0, parseNumberSafely(value)),
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
              {CATEGORY_OPTIONS.map((option) => (
                <FormFieldInput
                  key={option.key}
                  id={`seedSpend-${option.key}`}
                  label={option.label}
                  wrapperClassName="form_field add_field"
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={seedInputs.spendCategories?.[option.key] ?? ""}
                  onChange={handleCategoryChange(option.key)}
                />
              ))}
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
