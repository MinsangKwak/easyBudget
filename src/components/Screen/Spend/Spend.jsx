import Screen from "../../Layout/Screen";
import Title from "../../Content/Title";
import Inner from "../../Content/Inner";
import ReportSection from "../Main/components/ReportSection";
import CategorySection from "../Main/components/CategorySection";
import PaymentMethodsSection from "../Main/components/PaymentMethodsSection";
import AddDataSheet from "../Main/components/AddDataSheet";
import TransactionSheet from "../Main/components/TransactionSheet";
import AuthRequiredModal from "../Main/components/AuthRequiredModal";
import { formatKoreanWon } from "../Main/utils";

const ScreenSpend = ({
    onRequestSignUp,
    isLinkedAccount,
    isSignUpModalOpen,
    onCloseSignUpModal,
    mainState,
}) => {
    const {
        isEditMode,
        monthKey,
        monthLabel,
        monthOptions,
        setMonthKey,
        report,
        budgetInputs,
        setBudgetInputs,
        commitBudgetInput,
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
        handleToggleEditMode,
        handleClickPaymentItem,
        handleClickCategoryRow,
        sheetState,
        closeSheet,
        animationTime,
        reportStatusFilter,
        setReportStatusFilter,
    } = mainState;

    const maskText = "??";
    const formatMaskedKoreanWon = (value) => (isLinkedAccount ? formatKoreanWon(value) : maskText);
    const formatMaskedCount = (value) => (isLinkedAccount ? value : maskText);
    const formatMaskedPercent = (value) => (isLinkedAccount ? `${value}%` : maskText);

    const handleBudgetChange = (key, value) => {
        setBudgetInputs((previous) => ({ ...previous, [key]: value }));
    };

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
                <ReportSection
                    monthLabel={monthLabel}
                    report={report}
                    budgetInputs={budgetInputs}
                    isEditMode={isEditMode}
                    isLinkedAccount={isLinkedAccount}
                    formatMaskedKoreanWon={formatMaskedKoreanWon}
                    formatMaskedCount={formatMaskedCount}
                    monthKey={monthKey}
                    monthOptions={monthOptions}
                    onChangeMonth={setMonthKey}
                    onToggleEditMode={handleToggleEditMode}
                    onBudgetChange={handleBudgetChange}
                    onBudgetCommit={commitBudgetInput}
                    reportStatusFilter={reportStatusFilter}
                    onChangeReportStatusFilter={setReportStatusFilter}
                />

                <CategorySection
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
