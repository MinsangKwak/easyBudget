import "./index.css";

import BaseButton from "../../Form/BaseButton";
import BaseButtonContainer from "../../Form/BaseButtonContainer";
import BaseSelectBox from "../../Form/BaseSelectBox";
import FormFieldInput from "../../Form/FormFieldInput";
import BottomSheet from "../../Common/Modal/BottomSheet";
import { CATEGORY_OPTIONS, PAYMENT_GROUP_META } from "../constants";

const AddDataSheet = ({ isOpen, newEntryDraft, onClose, onSubmit, onDraftChange }) => {
    const handleSelectChange = (field, value) => {
        onDraftChange((previous) => ({ ...previous, [field]: value }));
    };

    const handleInputChange = (field) => (event) => {
        handleSelectChange(field, event.target.value);
    };

    return (
        <BottomSheet isOpen={isOpen} title="마이데이터 추가" onClose={onClose}>
            <form className="add_form" onSubmit={onSubmit}>
                <div className="popup_inner">
                    <div className="popup_body">
                        <BaseSelectBox
                            id="entryType"
                            label="데이터 유형"
                            className="add_field"
                            labelClassName="add_field__label"
                            value={newEntryDraft.entryType}
                            onChange={(event) =>
                                handleSelectChange("entryType", event.target.value)
                            }
                            options={[
                                { key: "spend", label: "지출" },
                                { key: "income", label: "수입" },
                            ]}
                        />

                        <FormFieldInput
                            id="paymentLabel"
                            label={
                                newEntryDraft.entryType === "income" ? "수입 이름" : "지출수단 이름"
                            }
                            wrapperClassName="form_field add_field"
                            placeholder="예) 알바, 신한카드"
                            value={newEntryDraft.paymentLabel}
                            onChange={handleInputChange("paymentLabel")}
                        />

                        <FormFieldInput
                            id="amount"
                            label="금액"
                            wrapperClassName="form_field add_field"
                            type="number"
                            inputMode="numeric"
                            placeholder="0"
                            value={newEntryDraft.amount}
                            onChange={handleInputChange("amount")}
                        />

                        {newEntryDraft.entryType === "spend" && (
                            <>
                                <BaseSelectBox
                                    id="categoryKey"
                                    label="카테고리"
                                    className="add_field"
                                    labelClassName="add_field__label"
                                    value={newEntryDraft.categoryKey}
                                    onChange={(event) =>
                                        handleSelectChange("categoryKey", event.target.value)
                                    }
                                    options={CATEGORY_OPTIONS}
                                />

                                <BaseSelectBox
                                    id="paymentGroupKey"
                                    label="지출 수단"
                                    className="add_field"
                                    labelClassName="add_field__label"
                                    value={newEntryDraft.paymentGroupKey}
                                    onChange={(event) =>
                                        handleSelectChange("paymentGroupKey", event.target.value)
                                    }
                                    options={Object.values(PAYMENT_GROUP_META)}
                                />

                                <BaseSelectBox
                                    id="spendType"
                                    label="지출 구분"
                                    className="add_field"
                                    labelClassName="add_field__label"
                                    value={newEntryDraft.spendType}
                                    onChange={(event) =>
                                        handleSelectChange("spendType", event.target.value)
                                    }
                                    options={[
                                        { key: "regular", label: "정기" },
                                        { key: "variable", label: "변동" },
                                    ]}
                                />

                                <BaseSelectBox
                                    id="status"
                                    label="상태"
                                    className="add_field"
                                    labelClassName="add_field__label"
                                    value={newEntryDraft.status}
                                    onChange={(event) =>
                                        handleSelectChange("status", event.target.value)
                                    }
                                    options={[
                                        { key: "paid", label: "완료" },
                                        { key: "planned", label: "예정" },
                                    ]}
                                />

                                <FormFieldInput
                                    id="dateLabel"
                                    label="표시 날짜"
                                    wrapperClassName="form_field add_field"
                                    placeholder="10/30"
                                    value={newEntryDraft.dateLabel}
                                    onChange={handleInputChange("dateLabel")}
                                />
                            </>
                        )}
                    </div>

                    <BaseButtonContainer className="popup_foot">
                        <BaseButton type="submit" style="btn_solid__primary" size="md">
                            추가하기
                        </BaseButton>
                    </BaseButtonContainer>
                </div>
            </form>
        </BottomSheet>
    );
};

export default AddDataSheet;
