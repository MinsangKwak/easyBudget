import BaseButton from "../../../Form/BaseButton";
import BottomSheet from "../../../Common/Modal/BottomSheet";
import { CATEGORY_OPTIONS, PAYMENT_GROUP_META } from "../constants";

const AddDataSheet = ({ isOpen, newEntryDraft, onClose, onSubmit, onDraftChange }) => {
  const handleSelectChange = (field, value) => {
    onDraftChange((previous) => ({ ...previous, [field]: value }));
  };

  return (
    <BottomSheet isOpen={isOpen} title="마이데이터 추가" onClose={onClose}>
      <form className="add_form" onSubmit={onSubmit}>
        <div className="add_form__grid">
          <label className="add_field">
            <span className="add_field__label">데이터 유형</span>
            <select
              value={newEntryDraft.entryType}
              onChange={(event) => handleSelectChange("entryType", event.target.value)}
            >
              <option value="spend">지출</option>
              <option value="income">수입</option>
            </select>
          </label>

          <label className="add_field">
            <span className="add_field__label">
              {newEntryDraft.entryType === "income" ? "수입 이름" : "지출수단 이름"}
            </span>
            <input
              type="text"
              value={newEntryDraft.paymentLabel}
              onChange={(event) => handleSelectChange("paymentLabel", event.target.value)}
              placeholder="예) 알바, 신한카드"
            />
          </label>

          <label className="add_field">
            <span className="add_field__label">금액</span>
            <input
              type="number"
              inputMode="numeric"
              value={newEntryDraft.amount}
              onChange={(event) => handleSelectChange("amount", event.target.value)}
              placeholder="0"
            />
          </label>

          {newEntryDraft.entryType === "spend" && (
            <>
              <label className="add_field">
                <span className="add_field__label">카테고리</span>
                <select
                  value={newEntryDraft.categoryKey}
                  onChange={(event) => handleSelectChange("categoryKey", event.target.value)}
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="add_field">
                <span className="add_field__label">지출 수단</span>
                <select
                  value={newEntryDraft.paymentGroupKey}
                  onChange={(event) => handleSelectChange("paymentGroupKey", event.target.value)}
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
                  onChange={(event) => handleSelectChange("spendType", event.target.value)}
                >
                  <option value="regular">정기</option>
                  <option value="variable">변동</option>
                </select>
              </label>

              <label className="add_field">
                <span className="add_field__label">상태</span>
                <select
                  value={newEntryDraft.status}
                  onChange={(event) => handleSelectChange("status", event.target.value)}
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
                  onChange={(event) => handleSelectChange("dateLabel", event.target.value)}
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
    </BottomSheet>
  );
};

export default AddDataSheet;
