import "../../Main/index.css";

import { useRef } from "react";
import { FiChevronDown } from "react-icons/fi";

import Screen from "../../Layout/Screen";
import Title from "../../Content/Title";
import SubTitle from "../../Content/SubTitle";
import Inner from "../../Content/Inner";
import CategorySection from "../../Main/CategorySection";
import AddDataSheet from "../../Main/AddDataSheet";
import TransactionSheet from "../../Main/TransactionSheet";
import AuthRequiredModal from "../../Main/AuthRequiredModal";
import { formatKoreanWon } from "../../Main/utils";

const ScreenCategory = ({
    onRequestSignUp,
    isLinkedAccount,
    isSignUpModalOpen,
    onCloseSignUpModal,
    mainState,
    sectionIds = {},
}) => {
    const { categorySpend } = sectionIds;
    const swipeStartX = useRef(null);
    const {
        monthLabel,
        monthKey,
        monthOptions,
        setMonthKey,
        isEditMode,
        categorySummaries,
        categoryAmountInput,
        setCategoryAmountInput,
        commitCategoryAmount,
        handleEnterCommit,
        categoryTotal,
        displayCategorySegments,
        isAddSheetOpen,
        setIsAddSheetOpen,
        newEntryDraft,
        setNewEntryDraft,
        handleClickAddMyData,
        handleSubmitMyData,
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
    const activeMonthIndex = monthOptions.findIndex((option) => option.key === monthKey);

    const handleCategoryChange = (categoryKey, value) => {
        setCategoryAmountInput((previous) => ({ ...previous, [categoryKey]: value }));
    };

    const handleClickSignUp = () => {
        onCloseSignUpModal?.();
        onRequestSignUp?.();
    };

    const handleSwipeStart = (event) => {
        const touch = event.touches?.[0];
        swipeStartX.current = touch?.clientX ?? event.clientX ?? null;
    };

    const handleSwipeEnd = (event) => {
        if (swipeStartX.current === null) return;

        const touch = event.changedTouches?.[0];
        const deltaX = (touch?.clientX ?? event.clientX ?? 0) - swipeStartX.current;
        const threshold = 30;

        const safeIndex = activeMonthIndex >= 0 ? activeMonthIndex : 0;

        if (deltaX > threshold && safeIndex > 0) {
            setMonthKey(monthOptions[safeIndex - 1]?.key);
        } else if (deltaX < -threshold && safeIndex < monthOptions.length - 1) {
            setMonthKey(monthOptions[safeIndex + 1]?.key);
        }

        swipeStartX.current = null;
    };

    const slideOffset = Math.max(activeMonthIndex, 0) * -100;

    return (
        <Screen className="screen_main">
            <Title>카테고리별 지출</Title>
            <SubTitle>카테고리별 지출 현황과 예산을 관리해요</SubTitle>
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

                <div
                    id={categorySpend}
                    className="category_swiper"
                    onTouchStart={handleSwipeStart}
                    onTouchEnd={handleSwipeEnd}
                    onMouseDown={handleSwipeStart}
                    onMouseUp={handleSwipeEnd}
                >
                    <div
                        className="category_swiper__track"
                        style={{ transform: `translateX(${slideOffset}%)` }}
                    >
                        {monthOptions.map((option) => (
                            <div key={option.key} className="category_swiper__slide">
                                <CategorySection
                                    periodLabel={monthLabel}
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
                            </div>
                        ))}
                    </div>
                </div>
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

export default ScreenCategory;
