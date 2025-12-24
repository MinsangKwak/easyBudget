import "../../Main/index.css";

import Screen from "../../Layout/Screen";
import Title from "../../Content/Title";
import SubTitle from "../../Content/SubTitle";
import Inner from "../../Content/Inner";
import ReportSection from "../../Main/ReportSection";
import YearlySummary from "../../Main/YearlySummary";
import AddDataSheet from "../../Main/AddDataSheet";
import SeedDataSheet from "../../Main/SeedDataSheet";
import TransactionSheet from "../../Main/TransactionSheet";
import AuthRequiredModal from "../../Main/AuthRequiredModal";
import { useState } from "react";

import { formatKoreanWon } from "../../Main/utils";
import Modal from "../../Common/Modal/Modal";

const ScreenMain = ({
  onRequestSignUp,
  isLinkedAccount,
  isSignUpModalOpen,
  onCloseSignUpModal,
  onGoCategorySpend,
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
    isSeedSheetOpen,
    setIsSeedSheetOpen,
    seedInputs,
    setSeedInputs,
    seedPeriodLabel,
    handleSeedSubmit,
    handleToggleEditMode,
    sheetState,
    closeSheet,
    report,
    yearlySummary,
  } = mainState;

  const [isSpendEditModalOpen, setIsSpendEditModalOpen] = useState(false);

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

  const handleOpenSpendEditModal = () => {
    setIsSpendEditModalOpen(true);
  };

  const handleCloseSpendEditModal = () => {
    setIsSpendEditModalOpen(false);
  };

  const handleGoCategorySpend = () => {
    setIsSpendEditModalOpen(false);
    onGoCategorySpend?.();
  };

  return (
    <Screen className="screen_main">
      <Title>
        쉬운 가계부 <br /> Wallet입니다.
      </Title>
      <SubTitle>수치부터 보여주는 시원한 가계부</SubTitle>
      <Inner>
        <YearlySummary summary={yearlySummary} isLinkedAccount={isLinkedAccount} />
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
          onOpenSpendEditGuide={handleOpenSpendEditModal}
        />
      </Inner>

      <AddDataSheet
        isOpen={isAddSheetOpen}
        newEntryDraft={newEntryDraft}
        onClose={() => setIsAddSheetOpen(false)}
        onSubmit={handleSubmitMyData}
        onDraftChange={setNewEntryDraft}
      />

      <SeedDataSheet
        isOpen={isSeedSheetOpen}
        periodLabel={seedPeriodLabel}
        seedInputs={seedInputs}
        onClose={() => setIsSeedSheetOpen(false)}
        onSubmit={handleSeedSubmit}
        onSeedChange={setSeedInputs}
      />

      <AuthRequiredModal
        isOpen={isSignUpModalOpen}
        onClose={onCloseSignUpModal}
        onConfirm={handleClickSignUp}
      />

      <Modal
        isOpen={isSpendEditModalOpen}
        onClose={handleCloseSpendEditModal}
        title="총 지출 수정 안내"
      >
        <p className="modal_desc">
          총 지출 금액은 지출 관리 화면에서 수정할 수 있어요. 아래 버튼을 눌러 이동해주세요.
        </p>
        <div className="modal_actions">
          <button type="button" className="modal_btn" onClick={handleCloseSpendEditModal}>
            닫기
          </button>
          <button
            type="button"
            className="modal_btn modal_btn__primary"
            onClick={handleGoCategorySpend}
          >
            지출 관리로 이동
          </button>
        </div>
      </Modal>

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
