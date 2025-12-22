import Screen from "../../Layout/Screen";
import Title from "../../Content/Title";
import Inner from "../../Content/Inner";
import CategorySection from "../Main/components/CategorySection";
import PaymentMethodsSection from "../Main/components/PaymentMethodsSection";
import AddDataSheet from "../Main/components/AddDataSheet";
import TransactionSheet from "../Main/components/TransactionSheet";
import AuthRequiredModal from "../Main/components/AuthRequiredModal";
import { formatKoreanWon } from "../Main/utils";

const ScreenSpend = ({
    viewType = "category",
    onRequestSignUp,
    isLinkedAccount,
    isSignUpModalOpen,
    onCloseSignUpModal,
    mainState,
    sectionIds = {},
}) => {
    const { paymentMethods, categorySpend } = sectionIds;
    const isCategoryView = viewType === "category";
    const isPaymentView = viewType === "paymentMethods";
    const {
        isEditMode,
        report,
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
        handleClickCategoryRow,
        sheetState,
        closeSheet,
        animationTime,
        handleToggleEditMode,
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
            <Title>Wallet</Title>
            <Inner>
                {isCategoryView && (
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
                )}

                {isPaymentView && (
                    <PaymentMethodsSection
                        id={paymentMethods}
                        paymentGroups={paymentGroups}
                        totalSpend={report.spendTotal}
                        formatMaskedKoreanWon={formatMaskedKoreanWon}
                        onClickAdd={handleClickAddMyData}
                        onClickPayment={handleClickPaymentItem}
                    />
                )}
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
