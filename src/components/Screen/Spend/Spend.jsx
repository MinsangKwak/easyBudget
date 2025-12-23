import "../Main/index.css";
import Screen from "../../Layout/Screen";
import Title from "../../Content/Title";
import SubTitle from "../../Content/SubTitle";
import Inner from "../../Content/Inner";
import PaymentMethodsSection from "../../Main/components/PaymentMethodsSection";
import AddDataSheet from "../../Main/components/AddDataSheet";
import TransactionSheet from "../../Main/components/TransactionSheet";
import AuthRequiredModal from "../../Main/components/AuthRequiredModal";
import { formatKoreanWon } from "../../Main/utils";
import { FiChevronDown } from "react-icons/fi";

const ScreenSpend = ({
    onRequestSignUp,
    isLinkedAccount,
    isSignUpModalOpen,
    onCloseSignUpModal,
    mainState,
    sectionIds = {},
}) => {
    const { paymentMethods } = sectionIds;
    const {
        monthLabel,
        monthKey,
        monthOptions,
        setMonthKey,
        report,
        paymentGroups,
        isAddSheetOpen,
        setIsAddSheetOpen,
        newEntryDraft,
        setNewEntryDraft,
        handleClickAddMyData,
        handleSubmitMyData,
        handleClickPaymentItem,
        sheetState,
        closeSheet,
    } = mainState;

    const maskText = "??";
    const formatMaskedKoreanWon = (value) => (isLinkedAccount ? formatKoreanWon(value) : maskText);

    const handleClickSignUp = () => {
        onCloseSignUpModal?.();
        onRequestSignUp?.();
    };

    return (
        <Screen className="screen_main">
            <Title>Wallet</Title>
            <SubTitle>연동된 지출 수단을 한눈에 확인해요</SubTitle>
            <Inner>
                <div className="card_filters">
                    <div className="report_filters period_filters" role="group" aria-label="기간 필터">
                        <label className="month_btn" aria-label="월 선택">
                            <span className="month_btn__label">{monthLabel}</span>
                            <FiChevronDown />
                            <select
                                className="month_select"
                                value={monthKey}
                                onChange={(event) => setMonthKey?.(event.target.value)}
                                aria-label="월 선택"
                            >
                                {monthOptions.map((option) => (
                                    <option key={option.key} value={option.key}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>

                <PaymentMethodsSection
                    id={paymentMethods}
                    paymentGroups={paymentGroups}
                    totalSpend={report.spendTotal}
                    formatMaskedKoreanWon={formatMaskedKoreanWon}
                    onClickAdd={handleClickAddMyData}
                    onClickPayment={handleClickPaymentItem}
                />
            </Inner>

            <AddDataSheet
                isOpen={isAddSheetOpen}
                newEntryDraft={newEntryDraft}
                onClose={() => setIsAddSheetOpen(false)}
                onSubmit={handleSubmitMyData}
                onDraftChange={setNewEntryDraft}
            />

            <AuthRequiredModal
                isOpen={isSignUpModalOpen}
                onClose={onCloseSignUpModal}
                onConfirm={handleClickSignUp}
            />

            <TransactionSheet
                isOpen={sheetState.isOpen}
                title={sheetState.title}
                items={sheetState.items}
                onClose={closeSheet}
            />
        </Screen>
    );
};

export default ScreenSpend;
