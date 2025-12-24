import "./index.css";

import BaseButton from "../../Form/BaseButton";
import BaseButtonContainer from "../../Form/BaseButtonContainer";
import FormFieldInput from "../../Form/FormFieldInput";
import BottomSheet from "../../Common/Modal/BottomSheet";

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

            <FormFieldInput
              id="seedSpend"
              label="총 지출"
              wrapperClassName="form_field add_field"
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={seedInputs.spendTotal}
              onChange={handleInputChange("spendTotal")}
            />
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
