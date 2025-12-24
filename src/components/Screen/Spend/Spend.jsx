import "../../Main/index.css";
import { useRef } from "react";

import Screen from "../../Layout/Screen";
import Title from "../../Content/Title";
import SubTitle from "../../Content/SubTitle";
import Inner from "../../Content/Inner";
import PaymentMethodsSection from "../../Main/PaymentMethodsSection";
import AddDataSheet from "../../Main/AddDataSheet";
import TransactionSheet from "../../Main/TransactionSheet";
import AuthRequiredModal from "../../Main/AuthRequiredModal";
import { formatKoreanWon } from "../../Main/utils";
import BaseSelectBox from "../../Form/BaseSelectBox";

const ScreenSpend = ({
    onRequestSignUp,
    isLinkedAccount,
    isSignUpModalOpen,
    onCloseSignUpModal,
    mainState,
    sectionIds = {},
}) => {
    const swipeStartX = useRef(null);
    const { paymentMethods } = sectionIds;
    const {
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
    const activeMonthIndex = monthOptions.findIndex((option) => option.key === monthKey);

    const maskText = "??";
    const formatMaskedKoreanWon = (value) => (isLinkedAccount ? formatKoreanWon(value) : maskText);

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
            <Title>Wallet</Title>
            <SubTitle>연동된 지출 수단을 한눈에 확인해요</SubTitle>
            <Inner>
                <div className="card_filters">
                    <div className="report_filters period_filters" role="group" aria-label="기간 필터">
                        <BaseSelectBox
                            id="month-select-spend"
                            className="month_select_box"
                            options={monthOptions}
                            value={monthKey}
                            onChange={(event) => setMonthKey?.(event.target.value)}
                            aria-label="월 선택"
                        />
                    </div>
                </div>

                <div
                    id={paymentMethods}
                    className="payment_swiper"
                    onTouchStart={handleSwipeStart}
                    onTouchEnd={handleSwipeEnd}
                    onMouseDown={handleSwipeStart}
                    onMouseUp={handleSwipeEnd}
                >
                    <div
                        className="payment_swiper__track"
                        style={{ transform: `translateX(${slideOffset}%)` }}
                    >
                        {monthOptions.map((option) => (
                            <div key={option.key} className="payment_swiper__slide">
                                <PaymentMethodsSection
                                    paymentGroups={paymentGroups}
                                    totalSpend={report.spendTotal}
                                    formatMaskedKoreanWon={formatMaskedKoreanWon}
                                    onClickAdd={handleClickAddMyData}
                                    onClickPayment={handleClickPaymentItem}
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

export default ScreenSpend;
