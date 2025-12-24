import { useEffect, useMemo, useState } from "react";
import {
  CATEGORY_OPTIONS,
  DEFAULT_INCOME_ENTRIES,
  DEFAULT_SPEND_ENTRIES,
  MONTHLY_REPORTS,
  PAYMENT_GROUP_META,
} from "../constants";
import { clampValue, parseNumberSafely, slugifyKey } from "../utils";
import { useAnimationFrameLoop } from "./useAnimationFrameLoop";

const LEDGER_STORAGE_KEY = "demo-ledger-data";

const computeEntriesTotal = (entries) =>
  entries.reduce((accumulator, entry) => accumulator + Math.max(0, entry.amount), 0);

const buildSeedCategoryInputs = () =>
  CATEGORY_OPTIONS.reduce((accumulator, option) => {
    accumulator[option.key] = {
      amount: "",
      paymentGroupKey: "card",
      spendType: "variable",
    };
    return accumulator;
  }, {});

const readLedgerMap = () => {
  if (typeof sessionStorage === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(LEDGER_STORAGE_KEY) || "{}");
  } catch (error) {
    console.error("Failed to parse ledger storage", error);
    return {};
  }
};

const writeLedgerMap = (nextMap) => {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(nextMap));
};

const resolveCurrentMonthInfo = () => {
  const now = new Date();
  const year = String(now.getFullYear());
  const monthNumber = now.getMonth() + 1;
  const monthValue = String(monthNumber).padStart(2, "0");

  return {
    year,
    month: monthValue,
    key: `${year}-${monthValue}`,
    label: `${year}년 ${monthNumber}월`,
    sheetLabel: `${year}-${monthValue}월`,
  };
};

const resolveInitialMonthKey = (reports) => {
  const current = resolveCurrentMonthInfo();
  const hasCurrent = reports.some((report) => report.key === current.key);
  if (hasCurrent) return current.key;

  const firstNonAggregate = reports.find((report) => !report.isAggregate);
  return firstNonAggregate?.key || reports[0]?.key;
};

const buildCustomReports = ({ monthKey, monthLabel, incomeEntries, spendEntries, budget }) => {
  const [year] = monthKey.split("-");
  const monthReport = {
    key: monthKey,
    label: monthLabel,
    year,
    budget,
    incomeEntries,
    spendEntries,
  };

  return [
    {
      key: `${year}-all`,
      label: `${year}년 전체`,
      year,
      isAggregate: true,
      budget,
      incomeEntries: incomeEntries.map((entry) => ({
        ...entry,
        id: `${entry.id}-${monthKey}`,
        dateLabel: entry.dateLabel || monthLabel,
      })),
      spendEntries: spendEntries.map((entry) => ({
        ...entry,
        id: `${entry.id}-${monthKey}`,
        dateLabel: entry.dateLabel || monthLabel,
      })),
    },
    monthReport,
  ];
};

export const useMainState = ({ isLinkedAccount, ensureLinkedAccount, currentUser }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [monthlyReports, setMonthlyReports] = useState(MONTHLY_REPORTS);
  const [monthKey, setMonthKey] = useState(() => resolveInitialMonthKey(MONTHLY_REPORTS));
  const [incomeEntries, setIncomeEntries] = useState(DEFAULT_INCOME_ENTRIES);
  const [spendEntries, setSpendEntries] = useState(DEFAULT_SPEND_ENTRIES);
  const [reportStatusFilter, setReportStatusFilter] = useState("all");
  const [planBudget, setPlanBudget] = useState({
    incomeBudget: 3780000,
    spendBudget: 15950000,
    variableBudget: 7050000,
  });
  const [budgetInputs, setBudgetInputs] = useState({
    incomeBudget: "3780000",
    spendBudget: "3500000",
    variableBudget: "1270000",
  });

  const [categoryAmountInput, setCategoryAmountInput] = useState({});
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [newEntryDraft, setNewEntryDraft] = useState({
    entryType: "spend",
    paymentLabel: "",
    paymentLogo: "",
    paymentKey: "",
    amount: "",
    categoryKey: CATEGORY_OPTIONS[0].key,
    paymentGroupKey: "card",
    spendType: "variable",
    status: "paid",
    dateLabel: "",
  });

  const [sheetState, setSheetState] = useState({
    isOpen: false,
    title: "",
    items: [],
  });
  const [isSeedSheetOpen, setIsSeedSheetOpen] = useState(false);
  const [seedInputs, setSeedInputs] = useState({
    incomeTotal: "",
    spendCategories: buildSeedCategoryInputs(),
  });
  const [isSeededData, setIsSeededData] = useState(false);

  const [animationTime, setAnimationTime] = useState(0);
  useAnimationFrameLoop(!isEditMode, (deltaTimeInSeconds) => {
    setAnimationTime((previous) => previous + deltaTimeInSeconds);
  });

  useEffect(() => {
    setBudgetInputs({
      incomeBudget: String(planBudget.incomeBudget),
      spendBudget: String(planBudget.spendBudget),
      variableBudget: String(planBudget.variableBudget),
    });
  }, [planBudget]);

  const monthOptions = useMemo(
    () => monthlyReports.map(({ key, label }) => ({ key, label })),
    [monthlyReports],
  );

  const selectedMonth = useMemo(() => {
    return monthlyReports.find((month) => month.key === monthKey) || monthlyReports[0];
  }, [monthKey, monthlyReports]);

  useEffect(() => {
    if (!selectedMonth) return;
    setIncomeEntries(selectedMonth.incomeEntries.map((entry) => ({ ...entry })));
    setSpendEntries(selectedMonth.spendEntries.map((entry) => ({ ...entry })));
    setPlanBudget({ ...selectedMonth.budget });
  }, [selectedMonth]);

  const monthLabelResolved = selectedMonth?.label || "이번 달";

  const incomeTotal = useMemo(() => {
    return computeEntriesTotal(incomeEntries);
  }, [incomeEntries]);

  const filteredSpendEntries = useMemo(() => {
    if (reportStatusFilter === "planned") {
      return spendEntries.filter((entry) => entry.status === "planned");
    }
    if (reportStatusFilter === "paid") {
      return spendEntries.filter((entry) => entry.status !== "planned");
    }
    return spendEntries;
  }, [reportStatusFilter, spendEntries]);

  const spendTotal = useMemo(() => {
    return computeEntriesTotal(spendEntries);
  }, [spendEntries]);

  const periodFilters = useMemo(() => {
    return monthlyReports.map((period) => {
      const isActive = period.key === monthKey;
      const incomeTotalForPeriod = isActive
        ? computeEntriesTotal(incomeEntries)
        : computeEntriesTotal(period.incomeEntries);
      const spendTotalForPeriod = isActive
        ? computeEntriesTotal(spendEntries)
        : computeEntriesTotal(period.spendEntries);

      return {
        key: period.key,
        label: period.label,
        incomeTotal: incomeTotalForPeriod,
        spendTotal: spendTotalForPeriod,
      };
    });
  }, [incomeEntries, monthKey, monthlyReports, spendEntries]);

  const categorySummaries = useMemo(() => {
    const map = new Map();
    filteredSpendEntries.forEach((entry) => {
      const current = map.get(entry.categoryKey) ?? {
        key: entry.categoryKey,
        label:
          CATEGORY_OPTIONS.find((option) => option.key === entry.categoryKey)?.label ||
          entry.categoryLabel,
        amount: 0,
        entries: [],
      };
      current.amount += Math.max(0, entry.amount);
      current.entries.push(entry);
      map.set(entry.categoryKey, current);
    });

    const total = Array.from(map.values()).reduce((accumulator, category) => {
      return accumulator + category.amount;
    }, 0);

    return CATEGORY_OPTIONS.map((option, index) => {
      const summary = map.get(option.key) ?? {
        key: option.key,
        label: option.label,
        amount: 0,
        entries: [],
      };
      const percent = total > 0 ? Math.round((summary.amount / total) * 100) : 0;
      return {
        ...summary,
        percent,
        tone: option.defaultTone || (index === 0 ? "iris" : "lilac"),
      };
    });
  }, [filteredSpendEntries]);

  const categoryTotal = useMemo(() => {
    return categorySummaries.reduce((accumulator, category) => accumulator + category.amount, 0);
  }, [categorySummaries]);

  useEffect(() => {
    const next = {};
    categorySummaries.forEach((category) => {
      next[category.key] = String(category.amount);
    });
    setCategoryAmountInput(next);
  }, [categorySummaries]);

  const categorySegments = useMemo(() => {
    return categorySummaries.map((category) => ({
      key: category.key,
      label: category.label,
      value: category.amount,
      tone: category.tone,
    }));
  }, [categorySummaries]);

  const displayCategorySegments = useMemo(() => {
    if (isLinkedAccount) return categorySegments;
    return categorySegments.map((segment) => ({ ...segment, value: 0 }));
  }, [categorySegments, isLinkedAccount]);

  const paymentGroups = useMemo(() => {
    const groupMap = new Map();

    filteredSpendEntries.forEach((entry) => {
      const groupKey = entry.paymentGroupKey || "other";
      const groupMeta = PAYMENT_GROUP_META[groupKey];
      const groupLabel = groupMeta?.label || entry.paymentGroupLabel || "기타 지출수단";

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, {
          key: groupKey,
          label: groupLabel,
          total: 0,
          items: new Map(),
        });
      }

      const group = groupMap.get(groupKey);
      const existingItem = group.items.get(entry.paymentKey) || {
        key: entry.paymentKey,
        label: entry.paymentLabel || entry.paymentKey,
        logoText: entry.paymentLogo || entry.paymentLabel?.[0] || "•",
        amount: 0,
      };

      existingItem.amount += Math.max(0, entry.amount);
      group.items.set(entry.paymentKey, existingItem);
      group.total += Math.max(0, entry.amount);
    });

    return Array.from(groupMap.values()).map((group) => ({
      ...group,
      items: Array.from(group.items.values()),
    }));
  }, [filteredSpendEntries]);

  const regularPaidEntries = useMemo(
    () =>
      filteredSpendEntries.filter(
        (entry) => entry.spendType === "regular" && entry.status !== "planned",
      ),
    [filteredSpendEntries],
  );
  const variablePaidEntries = useMemo(
    () =>
      filteredSpendEntries.filter(
        (entry) => entry.spendType === "variable" && entry.status !== "planned",
      ),
    [filteredSpendEntries],
  );

  const regularPaidTotal = useMemo(
    () => computeEntriesTotal(regularPaidEntries),
    [regularPaidEntries],
  );
  const variablePaidTotal = useMemo(
    () => computeEntriesTotal(variablePaidEntries),
    [variablePaidEntries],
  );

  const resolveCategoryLabel = (categoryKey) =>
    CATEGORY_OPTIONS.find((option) => option.key === categoryKey)?.label || "카테고리";

  const buildSheetItems = (entries) =>
    entries.map((entry) => ({
      id: entry.id,
      title: entry.paymentLabel || resolveCategoryLabel(entry.categoryKey),
      amount: entry.amount,
      date: entry.dateLabel || monthLabelResolved,
      sub: `${resolveCategoryLabel(entry.categoryKey)} · ${
        entry.spendType === "regular" ? "정기" : "변동"
      }${entry.status === "planned" ? " 예정" : ""}`,
    }));

  const report = useMemo(() => {
    return {
      incomeTotal,
      incomeHint: planBudget.incomeBudget,
      spendTotal,
      spendHint: planBudget.spendBudget,
      regularPaid: regularPaidTotal,
      regularCountPaid: regularPaidEntries.length,
      regularPaidDetails: buildSheetItems(regularPaidEntries),
      variablePaid: variablePaidTotal,
      variableCountPaid: variablePaidEntries.length,
      variablePaidDetails: buildSheetItems(variablePaidEntries),
    };
  }, [
    incomeTotal,
    planBudget,
    regularPaidEntries,
    regularPaidTotal,
    spendTotal,
    variablePaidEntries,
    variablePaidTotal,
  ]);

  const openSheet = ({ title, items }) => {
    setSheetState({ isOpen: true, title, items });
  };

  const closeSheet = () => {
    setSheetState((previous) => ({ ...previous, isOpen: false }));
  };

  const handleToggleEditMode = () => {
    if (!ensureLinkedAccount()) return;
    setIsEditMode((previous) => !previous);
  };

  const handleClickAddMyData = () => {
    if (!ensureLinkedAccount()) return;
    setIsAddSheetOpen(true);
  };

  const commitCategoryAmount = (categoryKey) => {
    const raw = categoryAmountInput[categoryKey];
    const parsed = clampValue(parseNumberSafely(raw), 0, 20000000);

    setSpendEntries((previous) => {
      const entriesForCategory = previous.filter((entry) => entry.categoryKey === categoryKey);
      if (!entriesForCategory.length) return previous;

      const [primary] = entriesForCategory;
      const totalCurrent = entriesForCategory.reduce((accumulator, entry) => {
        return accumulator + Math.max(0, entry.amount);
      }, 0);
      const delta = parsed - totalCurrent;
      const nextPrimaryAmount = Math.max(0, (primary.amount || 0) + delta);

      return previous.map((entry) => {
        if (entry.categoryKey !== categoryKey) return entry;
        if (entry.id === primary.id) return { ...entry, amount: nextPrimaryAmount };
        return entry;
      });
    });

    setCategoryAmountInput((previous) => ({ ...previous, [categoryKey]: String(parsed) }));
  };

  const handleEnterCommit = (event, categoryKey) => {
    if (event.key !== "Enter") return;
    event.currentTarget.blur();
    commitCategoryAmount(categoryKey);
  };

  const commitBudgetInput = (key) => {
    const parsed = clampValue(parseNumberSafely(budgetInputs[key]), 0, 5000000000);
    setPlanBudget((previous) => ({ ...previous, [key]: parsed }));
    setBudgetInputs((previous) => ({ ...previous, [key]: String(parsed) }));
  };

  const handleSubmitMyData = (event) => {
    event?.preventDefault?.();
    if (!ensureLinkedAccount()) return;

    const parsedAmount = clampValue(parseNumberSafely(newEntryDraft.amount), 0, 20000000);
    if (!parsedAmount) return;

    if (newEntryDraft.entryType === "income") {
      const label = newEntryDraft.paymentLabel?.trim() || "추가 수입";
      const nextIncome = {
        id: `income-${Date.now()}`,
        label,
        amount: parsedAmount,
      };
      setIncomeEntries((previous) => [...previous, nextIncome]);
    } else {
      const categoryLabel = resolveCategoryLabel(newEntryDraft.categoryKey);
      const paymentLabel = newEntryDraft.paymentLabel?.trim() || "새 지출수단";
      const paymentKey =
        newEntryDraft.paymentKey ||
        `${newEntryDraft.paymentGroupKey}-${slugifyKey(paymentLabel, "payment")}`;
      const paymentLogo = (newEntryDraft.paymentLogo || paymentLabel[0] || "•")
        .toUpperCase()
        .slice(0, 1);

      const nextEntry = {
        id: `entry-${Date.now()}`,
        categoryKey: newEntryDraft.categoryKey,
        categoryLabel,
        amount: parsedAmount,
        paymentKey,
        paymentLabel,
        paymentLogo,
        paymentGroupKey: newEntryDraft.paymentGroupKey,
        paymentGroupLabel: PAYMENT_GROUP_META[newEntryDraft.paymentGroupKey]?.label || "지출수단",
        spendType: newEntryDraft.spendType,
        status: newEntryDraft.status,
        dateLabel: newEntryDraft.dateLabel || monthLabelResolved,
      };

      setSpendEntries((previous) => [...previous, nextEntry]);
    }

    setNewEntryDraft((previous) => ({
      ...previous,
      paymentLabel: "",
      paymentLogo: "",
      paymentKey: "",
      amount: "",
      dateLabel: "",
    }));
    setIsAddSheetOpen(false);
  };

  const handleClickPaymentItem = (itemKey, label) => {
    if (!ensureLinkedAccount()) return;
    const items = filteredSpendEntries.filter((entry) => entry.paymentKey === itemKey);
    openSheet({ title: `${label} 내역`, items: buildSheetItems(items) });
  };

  const handleClickCategoryRow = (categoryKey, label) => {
    if (!ensureLinkedAccount()) return;
    const items = filteredSpendEntries.filter((entry) => entry.categoryKey === categoryKey);
    openSheet({ title: `${label} 내역`, items: buildSheetItems(items) });
  };

  const yearlySummary = useMemo(() => {
    const targetYear = selectedMonth?.year || monthlyReports[0]?.year || "올해";
    const reportsForYear = monthlyReports.filter(
      (report) => report.year === targetYear && !report.isAggregate,
    );

    const totalIncome = reportsForYear.reduce((acc, month) => {
      const entries = month.key === monthKey ? incomeEntries : month.incomeEntries;
      return acc + entries.reduce((entrySum, entry) => entrySum + Math.max(0, entry.amount), 0);
    }, 0);
    const totalSpend = reportsForYear.reduce((acc, month) => {
      const entries = month.key === monthKey ? spendEntries : month.spendEntries;
      return acc + entries.reduce((entrySum, entry) => entrySum + Math.max(0, entry.amount), 0);
    }, 0);

    return {
      yearLabel: `${targetYear}년`,
      income: totalIncome,
      spend: totalSpend,
    };
  }, [incomeEntries, monthKey, monthlyReports, selectedMonth, spendEntries]);

  const currentPeriod = useMemo(() => resolveCurrentMonthInfo(), []);
  const normalizedEmail = currentUser?.email?.toLowerCase?.() || "";
  const shouldSkipSeed = normalizedEmail === "test@test.com";

  useEffect(() => {
    if (!currentUser) {
      setMonthlyReports(MONTHLY_REPORTS);
      setMonthKey(resolveInitialMonthKey(MONTHLY_REPORTS));
      setIsSeedSheetOpen(false);
      setIsSeededData(false);
      setSeedInputs({ incomeTotal: "", spendCategories: buildSeedCategoryInputs() });
      return;
    }

    if (shouldSkipSeed) {
      setMonthlyReports(MONTHLY_REPORTS);
      setMonthKey(resolveInitialMonthKey(MONTHLY_REPORTS));
      setIsSeedSheetOpen(false);
      setIsSeededData(false);
      setSeedInputs({ incomeTotal: "", spendCategories: buildSeedCategoryInputs() });
      return;
    }

    const ledgerMap = readLedgerMap();
    const storedLedger = ledgerMap[currentUser.id];
    const hasEntries =
      (storedLedger?.incomeEntries?.length || 0) > 0 ||
      (storedLedger?.spendEntries?.length || 0) > 0;

    if (storedLedger && hasEntries) {
      const storedMonthKey = storedLedger.monthKey || currentPeriod.key;
      const storedMonthLabel = storedLedger.monthLabel || currentPeriod.label;
      setMonthlyReports(
        buildCustomReports({
          monthKey: storedMonthKey,
          monthLabel: storedMonthLabel,
          incomeEntries: storedLedger.incomeEntries || [],
          spendEntries: storedLedger.spendEntries || [],
          budget: storedLedger.planBudget || {
            incomeBudget: 0,
            spendBudget: 0,
            variableBudget: 0,
          },
        }),
      );
      setMonthKey(storedMonthKey);
      setIsSeedSheetOpen(false);
      setIsSeededData(true);
      setSeedInputs({
        incomeTotal: storedLedger.planBudget?.incomeBudget
          ? String(storedLedger.planBudget.incomeBudget)
          : "",
        spendCategories: buildSeedCategoryInputs(),
      });
      return;
    }

    setMonthlyReports(
      buildCustomReports({
        monthKey: currentPeriod.key,
        monthLabel: currentPeriod.label,
        incomeEntries: [],
        spendEntries: [],
        budget: {
          incomeBudget: 0,
          spendBudget: 0,
          variableBudget: 0,
        },
      }),
    );
    setMonthKey(currentPeriod.key);
    setIsSeedSheetOpen(true);
    setIsSeededData(false);
    setSeedInputs({ incomeTotal: "", spendCategories: buildSeedCategoryInputs() });
  }, [currentPeriod.key, currentPeriod.label, currentUser, shouldSkipSeed]);

  useEffect(() => {
    if (!currentUser || shouldSkipSeed || !isSeededData) return;
    const ledgerMap = readLedgerMap();
    ledgerMap[currentUser.id] = {
      monthKey,
      monthLabel: selectedMonth?.label || currentPeriod.label,
      incomeEntries,
      spendEntries,
      planBudget,
      updatedAt: new Date().toISOString(),
    };
    writeLedgerMap(ledgerMap);
  }, [
    currentPeriod.label,
    currentUser,
    incomeEntries,
    isSeededData,
    monthKey,
    planBudget,
    selectedMonth?.label,
    shouldSkipSeed,
    spendEntries,
  ]);

  const handleSeedSubmit = (event) => {
    event?.preventDefault?.();
    if (!currentUser || shouldSkipSeed) return;

    const parsedIncome = clampValue(parseNumberSafely(seedInputs.incomeTotal), 0, 20000000);
    const spendSeedEntries = CATEGORY_OPTIONS.flatMap((option) => {
      const categorySeed = seedInputs.spendCategories?.[option.key];
      const rawValue = categorySeed?.amount;
      const parsedSpend = clampValue(parseNumberSafely(rawValue), 0, 20000000);
      if (!parsedSpend) return [];
      const paymentGroupKey = categorySeed?.paymentGroupKey || "card";
      const paymentGroupLabel = PAYMENT_GROUP_META[paymentGroupKey]?.label || "지출수단";
      const spendType = categorySeed?.spendType || "variable";
      const paymentLabel = paymentGroupLabel;
      const paymentKey = `${paymentGroupKey}_seed`;
      return [
        {
          id: `spend-seed-${option.key}-${Date.now()}`,
          categoryKey: option.key,
          categoryLabel: option.label,
          amount: parsedSpend,
          paymentKey,
          paymentLabel,
          paymentLogo: paymentLabel[0] || "•",
          paymentGroupKey,
          paymentGroupLabel,
          spendType,
          status: "paid",
          dateLabel: currentPeriod.label,
        },
      ];
    });
    const parsedSpendTotal = spendSeedEntries.reduce(
      (accumulator, entry) => accumulator + entry.amount,
      0,
    );
    const parsedVariableTotal = spendSeedEntries.reduce(
      (accumulator, entry) =>
        entry.spendType === "variable" ? accumulator + entry.amount : accumulator,
      0,
    );

    if (!parsedIncome && !parsedSpendTotal) return;

    const incomeSeedEntries =
      parsedIncome > 0
        ? [
            {
              id: `income-seed-${Date.now()}`,
              label: "초기 수입",
              amount: parsedIncome,
              dateLabel: currentPeriod.label,
            },
          ]
        : [];

    const nextBudget = {
      incomeBudget: parsedIncome,
      spendBudget: parsedSpendTotal,
      variableBudget: parsedVariableTotal,
    };

    setMonthlyReports(
      buildCustomReports({
        monthKey: currentPeriod.key,
        monthLabel: currentPeriod.label,
        incomeEntries: incomeSeedEntries,
        spendEntries: spendSeedEntries,
        budget: nextBudget,
      }),
    );
    setMonthKey(currentPeriod.key);
    setIsSeedSheetOpen(false);
    setIsSeededData(true);
  };

  return {
    isEditMode,
    monthKey,
    monthLabel: monthLabelResolved,
    monthOptions,
    setMonthKey,
    incomeTotal,
    spendTotal,
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
    openSheet,
    closeSheet,
    animationTime,
    yearlySummary,
    reportStatusFilter,
    setReportStatusFilter,
    filteredSpendEntries,
    periodFilters,
    isSeedSheetOpen,
    setIsSeedSheetOpen,
    seedInputs,
    setSeedInputs,
    seedPeriodLabel: currentPeriod.sheetLabel,
    handleSeedSubmit,
  };
};
