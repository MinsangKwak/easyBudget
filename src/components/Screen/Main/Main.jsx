import "./index.css";

import { useEffect, useMemo, useState } from "react";
import Screen from "../../Layout/Screen";
import Title from "../../Content/Title";
import Inner from "../../Content/Inner";
import { useAuth } from "../../../contexts/AuthContext";
import ReportSection from "./components/ReportSection";
import PaymentMethodsSection from "./components/PaymentMethodsSection";
import CategorySection from "./components/CategorySection";
import AddDataSheet from "./components/AddDataSheet";
import TransactionSheet from "./components/TransactionSheet";
import AuthRequiredModal from "./components/AuthRequiredModal";
import { formatKoreanWon } from "./utils";
import { useMainState } from "./hooks/useMainState";

const ScreenMain = ({ onRequestSignUp }) => {
    const { currentUser } = useAuth();
    const isLinkedAccount = useMemo(() => {
        return ["test@test.com", "test@gmail.com"].includes(
            currentUser?.email?.toLowerCase?.() || "",
        );
    }, [currentUser]);

    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const monthLabel = "10월";

    const ensureLinkedAccount = () => {
        if (!isLinkedAccount) {
            setIsSignUpModalOpen(true);
            return false;
        }
        return true;
    };

    const {
        isEditMode,
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
    } = useMainState({ monthLabel, isLinkedAccount, ensureLinkedAccount });

    useEffect(() => {
        const hasOpenSheet = sheetState.isOpen || isAddSheetOpen;
        document.documentElement.classList.toggle("is_sheet_open", hasOpenSheet);

        return () => document.documentElement.classList.remove("is_sheet_open");
    }, [isAddSheetOpen, sheetState.isOpen]);

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
        setIsSignUpModalOpen(false);
        onRequestSignUp?.();
    };

    return (
        <Screen className="screen_main">
            <Title>쉬운 가계부,</Title>
            <Inner>
                <section className="card style_dash hero">
                    <div className="card_head">
                        <div className="card_title">
                            내 입맛에 맞게 카테고리를 재분류할 수 있어요.
                        </div>
                    </div>
                </section>

                <ReportSection
                    monthLabel={monthLabel}
                    report={report}
                    budgetInputs={budgetInputs}
                    isEditMode={isEditMode}
                    isLinkedAccount={isLinkedAccount}
                    formatMaskedKoreanWon={formatMaskedKoreanWon}
                    formatMaskedCount={formatMaskedCount}
                    onToggleEditMode={handleToggleEditMode}
                    onBudgetChange={handleBudgetChange}
                    onBudgetCommit={commitBudgetInput}
                />

                <PaymentMethodsSection
                    paymentGroups={paymentGroups}
                    totalSpend={report.spendTotal}
                    formatMaskedKoreanWon={formatMaskedKoreanWon}
                    onClickAdd={handleClickAddMyData}
                    onClickPayment={handleClickPaymentItem}
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
                onClose={() => setIsSignUpModalOpen(false)}
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
