import "./index.css";

import Screen from "../../Layout/Screen";
import Title from "../../Content/Title";
import SubTitle from "../../Content/SubTitle";
import Inner from "../../Content/Inner";
import ReportSection from "./components/ReportSection";
import YearlySummary from "./components/YearlySummary";
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
}) => {
    const {
        isEditMode,
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
        isAddSheetOpen,
        setIsAddSheetOpen,
        newEntryDraft,
        setNewEntryDraft,
        handleSubmitMyData,
        handleToggleEditMode,
        sheetState,
        closeSheet,
        report,
        yearlySummary,
    } = mainState;

    const maskText = "??";
    const formatMaskedKoreanWon = (value) => (isLinkedAccount ? formatKoreanWon(value) : maskText);
    const formatMaskedCount = (value) => (isLinkedAccount ? value : maskText);
    const formatMaskedPercent = (value) => (isLinkedAccount ? `${value}%` : maskText);

    const handleBudgetChange = (key, value) => {
        setBudgetInputs((previous) => ({ ...previous, [key]: value }));
    };

    const handleClickSignUp = () => {
        onCloseSignUpModal?.();
        onRequestSignUp?.();
    };

    return (
        <Screen className="screen_main">
            <Title>
                쉬운 가계부 <br /> Wallet입니다.
            </Title>
            <SubTitle>수치부터 보여주는 시원한 가계부</SubTitle>
            <Inner>
                <YearlySummary summary={yearlySummary} />
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
