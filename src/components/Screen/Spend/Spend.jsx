import Screen from "../../Layout/Screen";
import Title from "../../Content/Title";
import Inner from "../../Content/Inner";
import CategorySection from "../Main/components/CategorySection";
import PaymentMethodsSection from "../Main/components/PaymentMethodsSection";
import ReportSection from "../Main/components/ReportSection";
import YearlySummary from "../Main/components/YearlySummary";
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
    sectionIds = {},
}) => {
    const { paymentMethods, categorySpend } = sectionIds;
    const {
        isEditMode,
        report,
        categorySummaries,
        categoryAmountInput,
        setCategoryAmountInput,
        commitCategoryAmount,
        handleEnterCommit,
        monthLabel,
        monthKey,
        monthOptions,
        setMonthKey,
        periodFilters,
        budgetInputs,
        setBudgetInputs,
        commitBudgetInput,
        reportStatusFilter,
        setReportStatusFilter,
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
        handleClickCategoryRow,
        sheetState,
        closeSheet,
        animationTime,
        handleToggleEditMode,
        yearlySummary,
    } = mainState;

    const maskText = "??";
    const formatMaskedKoreanWon = (value) => (isLinkedAccount ? formatKoreanWon(value) : maskText);
    const formatMaskedCount = (value) => (isLinkedAccount ? value : maskText);
    const formatMaskedPercent = (value) => (isLinkedAccount ? `${value}%` : maskText);

    const handleCategoryChange = (categoryKey, value) => {
        setCategoryAmountInput((previous) => ({ ...previous, [categoryKey]: value }));
    };

    const handleBudgetChange = (key, value) => {
        setBudgetInputs((previous) => ({ ...previous, [key]: value }));
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
                    monthKey={monthKey}
                    monthOptions={monthOptions}
                    onChangeMonth={setMonthKey}
                    periodFilters={periodFilters}
                    onChangePeriod={setMonthKey}
                    report={report}
                    budgetInputs={budgetInputs}
                    isEditMode={isEditMode}
                    isLinkedAccount={isLinkedAccount}
                    formatMaskedKoreanWon={formatMaskedKoreanWon}
                    formatMaskedCount={formatMaskedCount}
                    onToggleEditMode={handleToggleEditMode}
                    onBudgetChange={handleBudgetChange}
                    onBudgetCommit={commitBudgetInput}
                    reportStatusFilter={reportStatusFilter}
                    onChangeReportStatusFilter={setReportStatusFilter}
                />

                <YearlySummary summary={yearlySummary} />

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

export default ScreenSpend;
