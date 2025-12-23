export const CATEGORY_OPTIONS = [
    { key: "cat_food", label: "식비·외식비", defaultTone: "iris" },
    { key: "cat_loan", label: "대출", defaultTone: "amethyst" },
    { key: "cat_ins", label: "보험", defaultTone: "blush" },
    { key: "cat_house", label: "주거·관리", defaultTone: "lilac" },
    { key: "cat_misc", label: "결제·소통", defaultTone: "plum" },
];

export const PAYMENT_GROUP_META = {
    card: { key: "card", label: "카드지출" },
    cash: { key: "cash", label: "현금지출" },
};

const OCTOBER_2025_INCOME_ENTRIES = [
    { id: "income-salary-2025-10", label: "급여", amount: 3200000 },
    { id: "income-side-2025-10", label: "기타 수입", amount: 580000 },
];

const OCTOBER_2025_SPEND_ENTRIES = [
    {
        id: "cat_food_shinhan_2025_10",
        categoryKey: "cat_food",
        categoryLabel: "식비·외식비",
        amount: 3600000,
        paymentKey: "card_shinhan",
        paymentLabel: "신한카드",
        paymentLogo: "S",
        paymentGroupKey: "card",
        paymentGroupLabel: "카드지출",
        spendType: "variable",
        status: "paid",
        dateLabel: "10/18",
    },
    {
        id: "cat_food_hyundai_2025_10",
        categoryKey: "cat_food",
        categoryLabel: "식비·외식비",
        amount: 3000000,
        paymentKey: "card_hyundai",
        paymentLabel: "현대카드",
        paymentLogo: "H",
        paymentGroupKey: "card",
        paymentGroupLabel: "카드지출",
        spendType: "variable",
        status: "planned",
        dateLabel: "10/22",
    },
    {
        id: "cat_loan_hyundai_2025_10",
        categoryKey: "cat_loan",
        categoryLabel: "대출",
        amount: 5500000,
        paymentKey: "card_hyundai",
        paymentLabel: "현대카드",
        paymentLogo: "H",
        paymentGroupKey: "card",
        paymentGroupLabel: "카드지출",
        spendType: "regular",
        status: "planned",
        dateLabel: "10/25",
    },
    {
        id: "cat_ins_kb_2025_10",
        categoryKey: "cat_ins",
        categoryLabel: "보험",
        amount: 2000000,
        paymentKey: "card_kb",
        paymentLabel: "KB국민카드",
        paymentLogo: "K",
        paymentGroupKey: "card",
        paymentGroupLabel: "카드지출",
        spendType: "regular",
        status: "paid",
        dateLabel: "10/08",
    },
    {
        id: "cat_house_cash_2025_10",
        categoryKey: "cat_house",
        categoryLabel: "주거·관리",
        amount: 1400000,
        paymentKey: "cash",
        paymentLabel: "현금",
        paymentLogo: "₩",
        paymentGroupKey: "cash",
        paymentGroupLabel: "현금지출",
        spendType: "regular",
        status: "paid",
        dateLabel: "10/03",
    },
    {
        id: "cat_misc_card_2025_10",
        categoryKey: "cat_misc",
        categoryLabel: "결제·소통",
        amount: 450000,
        paymentKey: "card_other",
        paymentLabel: "우리카드",
        paymentLogo: "W",
        paymentGroupKey: "card",
        paymentGroupLabel: "카드지출",
        spendType: "variable",
        status: "paid",
        dateLabel: "10/02",
    },
];

const DECEMBER_2025_INCOME_ENTRIES = [
    { id: "income-salary-2025-12", label: "급여", amount: 4100000 },
    { id: "income-bonus-2025-12", label: "성과급", amount: 970000 },
];

const DECEMBER_2025_SPEND_ENTRIES = [
    {
        id: "cat_food_nh_2025_12",
        categoryKey: "cat_food",
        categoryLabel: "식비·외식비",
        amount: 3450000,
        paymentKey: "card_nh",
        paymentLabel: "NH농협카드",
        paymentLogo: "N",
        paymentGroupKey: "card",
        paymentGroupLabel: "카드지출",
        spendType: "variable",
        status: "paid",
        dateLabel: "12/06",
    },
    {
        id: "cat_food_kb_2025_12",
        categoryKey: "cat_food",
        categoryLabel: "식비·외식비",
        amount: 1850000,
        paymentKey: "card_kb",
        paymentLabel: "KB국민카드",
        paymentLogo: "K",
        paymentGroupKey: "card",
        paymentGroupLabel: "카드지출",
        spendType: "variable",
        status: "planned",
        dateLabel: "12/19",
    },
    {
        id: "cat_loan_hyundai_2025_12",
        categoryKey: "cat_loan",
        categoryLabel: "대출",
        amount: 4300000,
        paymentKey: "card_hyundai",
        paymentLabel: "현대카드",
        paymentLogo: "H",
        paymentGroupKey: "card",
        paymentGroupLabel: "카드지출",
        spendType: "regular",
        status: "planned",
        dateLabel: "12/25",
    },
    {
        id: "cat_ins_kb_2025_12",
        categoryKey: "cat_ins",
        categoryLabel: "보험",
        amount: 1650000,
        paymentKey: "card_kb",
        paymentLabel: "KB국민카드",
        paymentLogo: "K",
        paymentGroupKey: "card",
        paymentGroupLabel: "카드지출",
        spendType: "regular",
        status: "paid",
        dateLabel: "12/08",
    },
    {
        id: "cat_house_cash_2025_12",
        categoryKey: "cat_house",
        categoryLabel: "주거·관리",
        amount: 1150000,
        paymentKey: "cash",
        paymentLabel: "현금",
        paymentLogo: "₩",
        paymentGroupKey: "cash",
        paymentGroupLabel: "현금지출",
        spendType: "regular",
        status: "paid",
        dateLabel: "12/03",
    },
    {
        id: "cat_misc_card_2025_12",
        categoryKey: "cat_misc",
        categoryLabel: "결제·소통",
        amount: 350000,
        paymentKey: "card_other",
        paymentLabel: "우리카드",
        paymentLogo: "W",
        paymentGroupKey: "card",
        paymentGroupLabel: "카드지출",
        spendType: "variable",
        status: "paid",
        dateLabel: "12/02",
    },
];

const NOVEMBER_2025_INCOME_ENTRIES = [
    { id: "income-salary-2025-11", label: "급여", amount: 3300000 },
    { id: "income-bonus-2025-11", label: "성과급", amount: 550000 },
];

const NOVEMBER_2025_SPEND_ENTRIES = [
    {
        id: "cat_food_shinhan_2025_11",
        categoryKey: "cat_food",
        categoryLabel: "식비·외식비",
        amount: 3150000,
        paymentKey: "card_shinhan",
        paymentLabel: "신한카드",
        paymentLogo: "S",
        paymentGroupKey: "card",
        paymentGroupLabel: "카드지출",
        spendType: "variable",
        status: "paid",
        dateLabel: "11/11",
    },
    {
        id: "cat_food_hyundai_2025_11",
        categoryKey: "cat_food",
        categoryLabel: "식비·외식비",
        amount: 2700000,
        paymentKey: "card_hyundai",
        paymentLabel: "현대카드",
        paymentLogo: "H",
        paymentGroupKey: "card",
        paymentGroupLabel: "카드지출",
        spendType: "variable",
        status: "planned",
        dateLabel: "11/24",
    },
    {
        id: "cat_loan_hyundai_2025_11",
        categoryKey: "cat_loan",
        categoryLabel: "대출",
        amount: 5500000,
        paymentKey: "card_hyundai",
        paymentLabel: "현대카드",
        paymentLogo: "H",
        paymentGroupKey: "card",
        paymentGroupLabel: "카드지출",
        spendType: "regular",
        status: "planned",
        dateLabel: "11/25",
    },
    {
        id: "cat_ins_kb_2025_11",
        categoryKey: "cat_ins",
        categoryLabel: "보험",
        amount: 2000000,
        paymentKey: "card_kb",
        paymentLabel: "KB국민카드",
        paymentLogo: "K",
        paymentGroupKey: "card",
        paymentGroupLabel: "카드지출",
        spendType: "regular",
        status: "paid",
        dateLabel: "11/07",
    },
    {
        id: "cat_house_cash_2025_11",
        categoryKey: "cat_house",
        categoryLabel: "주거·관리",
        amount: 1280000,
        paymentKey: "cash",
        paymentLabel: "현금",
        paymentLogo: "₩",
        paymentGroupKey: "cash",
        paymentGroupLabel: "현금지출",
        spendType: "regular",
        status: "paid",
        dateLabel: "11/04",
    },
    {
        id: "cat_misc_card_2025_11",
        categoryKey: "cat_misc",
        categoryLabel: "결제·소통",
        amount: 380000,
        paymentKey: "card_other",
        paymentLabel: "우리카드",
        paymentLogo: "W",
        paymentGroupKey: "card",
        paymentGroupLabel: "카드지출",
        spendType: "variable",
        status: "paid",
        dateLabel: "11/02",
    },
];

const MONTHLY_REPORTS_2025 = [
    {
        key: "2025-12",
        label: "2025년 12월",
        year: "2025",
        budget: {
            incomeBudget: 5200000,
            spendBudget: 12750000,
            variableBudget: 5650000,
        },
        incomeEntries: DECEMBER_2025_INCOME_ENTRIES,
        spendEntries: DECEMBER_2025_SPEND_ENTRIES,
    },
    {
        key: "2025-11",
        label: "2025년 11월",
        year: "2025",
        budget: {
            incomeBudget: 3850000,
            spendBudget: 15010000,
            variableBudget: 6230000,
        },
        incomeEntries: NOVEMBER_2025_INCOME_ENTRIES,
        spendEntries: NOVEMBER_2025_SPEND_ENTRIES,
    },
    {
        key: "2025-10",
        label: "2025년 10월",
        year: "2025",
        budget: {
            incomeBudget: 3780000,
            spendBudget: 15950000,
            variableBudget: 7050000,
        },
        incomeEntries: OCTOBER_2025_INCOME_ENTRIES,
        spendEntries: OCTOBER_2025_SPEND_ENTRIES,
    },
];

const buildYearlyReport = (year, months) => {
    const incomeEntries = months.flatMap((month) =>
        month.incomeEntries.map((entry) => ({
            ...entry,
            id: `${entry.id}-${month.key}`,
            dateLabel: entry.dateLabel || month.label,
        })),
    );
    const spendEntries = months.flatMap((month) =>
        month.spendEntries.map((entry) => ({
            ...entry,
            id: `${entry.id}-${month.key}`,
            dateLabel: entry.dateLabel || month.label,
        })),
    );

    const sumBudget = (key) =>
        months.reduce((accumulator, month) => accumulator + (month.budget?.[key] || 0), 0);

    return {
        key: `${year}-all`,
        label: `${year}년 전체`,
        year,
        isAggregate: true,
        budget: {
            incomeBudget: sumBudget("incomeBudget"),
            spendBudget: sumBudget("spendBudget"),
            variableBudget: sumBudget("variableBudget"),
        },
        incomeEntries,
        spendEntries,
    };
};

const YEARLY_2025_REPORT = buildYearlyReport("2025", MONTHLY_REPORTS_2025);

export const MONTHLY_REPORTS = [YEARLY_2025_REPORT, ...MONTHLY_REPORTS_2025];

export const DEFAULT_INCOME_ENTRIES = YEARLY_2025_REPORT.incomeEntries;
export const DEFAULT_SPEND_ENTRIES = YEARLY_2025_REPORT.spendEntries;
