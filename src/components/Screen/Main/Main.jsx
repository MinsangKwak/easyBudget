import "./index.css";

import Screen from "../../Layout/Screen";
import Title from "../../Content/Title";
import Inner from "../../Content/Inner";
import PaymentMethodsSection from "./components/PaymentMethodsSection";
import CategorySection from "./components/CategorySection";
import AddDataSheet from "./components/AddDataSheet";
import TransactionSheet from "./components/TransactionSheet";
import AuthRequiredModal from "./components/AuthRequiredModal";
import { formatKoreanWon } from "./utils";

const ScreenMain = ({
    onRequestSignUp,
    isLinkedAccount,
    isSignUpModalOpen,
    onCloseSignUpModal,
    mainState,
    sectionIds = {},
}) => {
    const { paymentMethods, categorySpend } = sectionIds;
    const {
        isEditMode,
        categorySummaries,
        categoryAmountInput,
        setCategoryAmountInput,
        commitCategoryAmount,
        handleEnterCommit,
        categoryTotal,
        displayCategorySegments,
        paymentGroups,
        isAddSheetOpen,
        setIsAddSheetOpen,
        newEntryDraft,
        setNewEntryDraft,
        handleClickAddMyData,
        handleSubmitMyData,
        handleClickPaymentItem,
        handleToggleEditMode,
        handleClickCategoryRow,
        sheetState,
        closeSheet,
        animationTime,
        report,
    } = mainState;

    const maskText = "??";
    const formatMaskedKoreanWon = (value) => (isLinkedAccount ? formatKoreanWon(value) : maskText);
    const formatMaskedCount = (value) => (isLinkedAccount ? value : maskText);
    const formatMaskedPercent = (value) => (isLinkedAccount ? `${value}%` : maskText);

    const handleCategoryChange = (categoryKey, value) => {
        setCategoryAmountInput((previous) => ({ ...previous, [categoryKey]: value }));
    };

    const handleClickSignUp = () => {
        onCloseSignUpModal?.();
        onRequestSignUp?.();
    };

    return (
        <Screen className="screen_main">
            <Title>지출 관리</Title>
            <Inner>
                <CategorySection
                    id={categorySpend}
                    categorySummaries={categorySummaries}
                    categoryTotal={categoryTotal}
                    displayCategorySegments={displayCategorySegments}
                    isEditMode={isEditMode}
                    isLinkedAccount={isLinkedAccount}
                    animationTime={animationTime}
                    formatMaskedKoreanWon={formatMaskedKoreanWon}
                    formatMaskedCount={formatMaskedCount}
                    formatMaskedPercent={formatMaskedPercent}
                    onToggleEditMode={handleToggleEditMode}
                    categoryAmountInput={categoryAmountInput}
                    onCategoryChange={handleCategoryChange}
                    onCategoryCommit={commitCategoryAmount}
                    onCategoryEnter={handleEnterCommit}
                    onClickCategory={handleClickCategoryRow}
                />

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

export default ScreenMain;
