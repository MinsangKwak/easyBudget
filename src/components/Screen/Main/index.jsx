import { useEffect, useMemo, useRef, useState } from "react";
import { FiRefreshCcw, FiEdit3 } from "react-icons/fi";
import "./index.css";

/* =========================
 * utils
 * ========================= */

const clampValue = (value, minimum, maximum) => {
  return Math.min(maximum, Math.max(minimum, value));
};

const roundValue = (value) => {
  return Math.round(value);
};

const parseNumberSafely = (rawValue) => {
  const parsedValue = Number(String(rawValue ?? "").replaceAll(",", "").trim());
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const formatKoreanWon = (value) => {
  const sign = value < 0 ? "-" : "";
  const absoluteValue = Math.abs(roundValue(value));
  return `${sign}${absoluteValue.toLocaleString("ko-KR")}원`;
};

const formatKoreanWonShort = (value) => {
  const sign = value < 0 ? "-" : "";
  const absoluteValue = Math.abs(roundValue(value));

  if (absoluteValue >= 100000000) return `${sign}${Math.round(absoluteValue / 100000000)}억`;
  if (absoluteValue >= 10000) return `${sign}${Math.round(absoluteValue / 10000)}만`;
  return `${sign}${absoluteValue.toLocaleString("ko-KR")}`;
};

/* =========================
 * RAF loop
 * ========================= */

function useRequestAnimationFrameLoop(isEnabled, onFrame) {
  const animationFrameIdRef = useRef(0);
  const lastTimestampRef = useRef(0);

  useEffect(() => {
    if (!isEnabled) return;

    lastTimestampRef.current = performance.now();

    const onAnimationFrame = (currentTimestamp) => {
      const deltaTimeInSeconds = Math.min(
        0.05,
        (currentTimestamp - lastTimestampRef.current) / 1000
      );

      lastTimestampRef.current = currentTimestamp;
      onFrame(deltaTimeInSeconds, currentTimestamp);

      animationFrameIdRef.current = requestAnimationFrame(onAnimationFrame);
    };

    animationFrameIdRef.current = requestAnimationFrame(onAnimationFrame);

    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [isEnabled, onFrame]);
}

/* =========================
 * 모델: 남는 돈 목표 ↑ → 누수 먼저 자동 감소(가정)
 * - 누수: 이자 + 수수료 + 구독
 * - 고정비 상세내역: 생활비 + 이자 + 수수료 + 구독
 * ========================= */

function buildMonthlyCashflowModel({
  monthlyIncome,
  fixedCost,
  baseLivingCost,
  baseInterestCost,
  baseFeeCost,
  baseSubscriptionCost,
  remainTarget,
}) {
  const safeIncome = Math.max(0, monthlyIncome);
  const safeFixedCost = clampValue(fixedCost, 0, safeIncome);

  const safeBaseLivingCost = clampValue(baseLivingCost, 0, safeIncome);
  const safeBaseInterestCost = clampValue(baseInterestCost, 0, safeIncome);
  const safeBaseFeeCost = clampValue(baseFeeCost, 0, safeIncome);
  const safeBaseSubscriptionCost = clampValue(baseSubscriptionCost, 0, safeIncome);

  const baseLeakCost = safeBaseInterestCost + safeBaseFeeCost + safeBaseSubscriptionCost;
  const safeRemainTarget = clampValue(remainTarget, 0, safeIncome);

  // 목표를 달성하려면 총 지출은 income - target 이하여야 함
  const targetTotalOutflow = safeIncome - safeRemainTarget;

  // 현재(기본) 총 지출: 고정비 + (생활비 + 누수)
  const baseDetailTotal = safeBaseLivingCost + baseLeakCost;
  const baseTotalOutflow = safeFixedCost + baseDetailTotal;

  const excessOutflow = Math.max(0, baseTotalOutflow - targetTotalOutflow);

  // 줄이는 순서: 누수(이자+수수료+구독) → 생활비
  // 누수 바닥값: 25%는 남김(UX 가정)
  const minimumLeakCost = baseLeakCost * 0.25;
  const maximumLeakReduction = Math.max(0, baseLeakCost - minimumLeakCost);

  const leakReduction = clampValue(excessOutflow, 0, maximumLeakReduction);
  const remainingExcessAfterLeakReduction = Math.max(0, excessOutflow - leakReduction);

  const livingReduction = clampValue(remainingExcessAfterLeakReduction, 0, safeBaseLivingCost);

  const adjustedLeakCost = baseLeakCost - leakReduction;
  const adjustedLivingCost = safeBaseLivingCost - livingReduction;

  // 누수를 이자/수수료/구독에 비례 배분해서 줄여줌(가정)
  const baseLeakDenominator = Math.max(1, baseLeakCost);

  const adjustedInterestCost = Math.max(
    0,
    Math.round(adjustedLeakCost * (safeBaseInterestCost / baseLeakDenominator))
  );

  const adjustedFeeCost = Math.max(
    0,
    Math.round(adjustedLeakCost * (safeBaseFeeCost / baseLeakDenominator))
  );

  // 잔여가 조금 튈 수 있으니 구독에서 마지막으로 맞춤
  const adjustedSubscriptionCost = Math.max(
    0,
    adjustedLeakCost - adjustedInterestCost - adjustedFeeCost
  );

  const detailTotalOutflow =
    adjustedLivingCost + adjustedInterestCost + adjustedFeeCost + adjustedSubscriptionCost;

  const totalOutflow = safeFixedCost + detailTotalOutflow;
  const remainingMoney = safeIncome - totalOutflow;

  return {
    monthlyIncome: safeIncome,

    fixedCost: safeFixedCost,

    livingCost: adjustedLivingCost,
    interestCost: adjustedInterestCost,
    feeCost: adjustedFeeCost,
    subscriptionCost: adjustedSubscriptionCost,

    leakCost: adjustedInterestCost + adjustedFeeCost + adjustedSubscriptionCost,
    baseLeakCost,

    leakSaved: baseLeakCost - (adjustedInterestCost + adjustedFeeCost + adjustedSubscriptionCost),

    remainTarget: safeRemainTarget,

    totalOutflow,
    remainingMoney,
  };
}

/* =========================
 * particles
 * ========================= */

function createFlowParticles({ totalValue, maximumParticles = 8, randomSeed = 0 }) {
  const safeValue = Math.max(0, totalValue);
  const particleCount = clampValue(Math.floor(safeValue / 120000) + 3, 3, maximumParticles);

  const averageValuePerParticle = safeValue / Math.max(1, particleCount);

  const particles = [];
  for (let index = 0; index < particleCount; index += 1) {
    const randomFactor = (Math.sin((index + 1) * 12.9898 + randomSeed) * 43758.5453) % 1;
    const ratio = 0.7 + Math.abs(randomFactor) * 0.9;

    const particleValue = Math.max(0, averageValuePerParticle * ratio);

    particles.push({
      id: `${randomSeed}-${index}`,
      amount: particleValue,
      laneIndex: index % 2,
      startPhase: (index / particleCount) * 0.85,
      speed: 0.18 + (index % 3) * 0.04,
    });
  }

  return particles;
}

/* =========================
 * 평균(데모) 데이터
 * ========================= */

function buildDemographicAverageForThirty({
  monthlyIncomeCandidate,
  fixedCostCandidate,
  livingCostCandidate,
  interestCostCandidate,
  feeCostCandidate,
  subscriptionCostCandidate,
}) {
  const safeMonthlyIncomeCandidate = Math.max(0, monthlyIncomeCandidate);
  const safeFixedCostCandidate = Math.max(0, fixedCostCandidate);
  const safeLivingCostCandidate = Math.max(0, livingCostCandidate);
  const safeInterestCostCandidate = Math.max(0, interestCostCandidate);
  const safeFeeCostCandidate = Math.max(0, feeCostCandidate);
  const safeSubscriptionCostCandidate = Math.max(0, subscriptionCostCandidate);

  const averageMonthlyIncome =
    safeMonthlyIncomeCandidate > 0 ? safeMonthlyIncomeCandidate : 3800000;

  const averageFixedCost = safeFixedCostCandidate > 0 ? safeFixedCostCandidate : 1200000;

  const averageLivingCost = safeLivingCostCandidate > 0 ? safeLivingCostCandidate : 950000;

  const averageInterestCost = safeInterestCostCandidate > 0 ? safeInterestCostCandidate : 230000;

  const averageFeeCost = safeFeeCostCandidate > 0 ? safeFeeCostCandidate : 65000;

  const averageSubscriptionCost =
    safeSubscriptionCostCandidate > 0 ? safeSubscriptionCostCandidate : 59000;

  const averageLeakCost = averageInterestCost + averageFeeCost + averageSubscriptionCost;
  const averageTotalOutflow = averageFixedCost + averageLivingCost + averageLeakCost;
  const averageRemaining = averageMonthlyIncome - averageTotalOutflow;

  return {
    demographicLabel: "30대 평균(데모)",
    averageMonthlyIncome,
    averageFixedCost,
    averageLivingCost,
    averageInterestCost,
    averageFeeCost,
    averageSubscriptionCost,
    averageLeakCost,
    averageTotalOutflow,
    averageRemaining,
  };
}

/* =========================
 * ScreenMain
 * ========================= */

export default function ScreenMain() {
  /* ---------- 나의 기본값 ---------- */
  const [cashflowBase, setCashflowBase] = useState({
    monthlyIncome: 3800000,
    fixedCost: 1350000,

    baseLivingCost: 980000,
    baseInterestCost: 210000,
    baseFeeCost: 65000,
    baseSubscriptionCost: 52000,
  });

  /* ---------- 나의 목표(잔액) ---------- */
  const [remainTargetValue, setRemainTargetValue] = useState(1208000);

  /* ---------- 입력 중 애니메이션 정지 ---------- */
  const [isUserEditing, setIsUserEditing] = useState(false);

  /* ---------- 입력 폼(문자열) ---------- */
  const [inputForm, setInputForm] = useState({
    monthlyIncomeInput: String(cashflowBase.monthlyIncome),
    fixedCostInput: String(cashflowBase.fixedCost),
    remainTargetInput: String(remainTargetValue),

    livingCostInput: String(cashflowBase.baseLivingCost),
    interestCostInput: String(cashflowBase.baseInterestCost),
    feeCostInput: String(cashflowBase.baseFeeCost),
    subscriptionCostInput: String(cashflowBase.baseSubscriptionCost),
  });

  /* ---------- 히어로 카드: 뒤집기 ---------- */
  const [isHeroCardFlipped, setIsHeroCardFlipped] = useState(false);

  /* ---------- 애니메이션 시간 ---------- */
  const [animationTime, setAnimationTime] = useState(0);

  useRequestAnimationFrameLoop(!isUserEditing, (deltaTimeInSeconds) => {
    setAnimationTime((previousAnimationTime) => previousAnimationTime + deltaTimeInSeconds);
  });

  /* ---------- 나의 모델 계산 ---------- */
  const cashflowModel = useMemo(() => {
    return buildMonthlyCashflowModel({
      monthlyIncome: cashflowBase.monthlyIncome,
      fixedCost: cashflowBase.fixedCost,

      baseLivingCost: cashflowBase.baseLivingCost,
      baseInterestCost: cashflowBase.baseInterestCost,
      baseFeeCost: cashflowBase.baseFeeCost,
      baseSubscriptionCost: cashflowBase.baseSubscriptionCost,

      remainTarget: remainTargetValue,
    });
  }, [cashflowBase, remainTargetValue]);

  /* ---------- “30대 평균(데모)” 계산 ---------- */
  const demographicAverage = useMemo(() => {
    return buildDemographicAverageForThirty({
      monthlyIncomeCandidate: cashflowBase.monthlyIncome,
      fixedCostCandidate: cashflowBase.fixedCost,
      livingCostCandidate: cashflowBase.baseLivingCost,
      interestCostCandidate: cashflowBase.baseInterestCost,
      feeCostCandidate: cashflowBase.baseFeeCost,
      subscriptionCostCandidate: cashflowBase.baseSubscriptionCost,
    });
  }, [cashflowBase]);

  /* ---------- 누수 강조(맥박) ---------- */
  const leakPulseValue = useMemo(() => {
    return 0.5 + 0.5 * Math.sin(animationTime * 2.1);
  }, [animationTime]);

  /* ---------- HERO 큰 숫자: 누수 카운트업(입력 중 정지) ---------- */
  const [animatedLeakValue, setAnimatedLeakValue] = useState(cashflowModel.leakCost);

  useEffect(() => {
    if (isUserEditing) return;

    const fromValue = animatedLeakValue;
    const toValue = cashflowModel.leakCost;

    const startTimestamp = performance.now();
    const durationMilliseconds = 420;

    let animationFrameId = 0;

    const onAnimationFrame = (currentTimestamp) => {
      const progress = clampValue((currentTimestamp - startTimestamp) / durationMilliseconds, 0, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedLeakValue(roundValue(fromValue + (toValue - fromValue) * easedProgress));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(onAnimationFrame);
      }
    };

    animationFrameId = requestAnimationFrame(onAnimationFrame);

    return () => cancelAnimationFrame(animationFrameId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cashflowModel.leakCost, isUserEditing]);

  /* ---------- 두께 계산 ---------- */
  const pipeThickness = useMemo(() => {
    const safeIncome = Math.max(1, cashflowModel.monthlyIncome);

    const fixedRatio = cashflowModel.fixedCost / safeIncome;
    const leakRatio = cashflowModel.leakCost / safeIncome;
    const remainRatio = Math.max(0, cashflowModel.remainingMoney) / safeIncome;

    return {
      fixed: clampValue(fixedRatio, 0.06, 0.6),
      leak: clampValue(leakRatio, 0.04, 0.6),
      remain: clampValue(remainRatio, 0.04, 0.5),
    };
  }, [cashflowModel]);

  /* ---------- 파티클 ---------- */
  const particles = useMemo(() => {
    return {
      fixed: createFlowParticles({ totalValue: cashflowModel.fixedCost, randomSeed: 11 }),
      leak: createFlowParticles({ totalValue: cashflowModel.leakCost, randomSeed: 71 }),
      remain: createFlowParticles({
        totalValue: Math.max(0, cashflowModel.remainingMoney),
        randomSeed: 97,
        maximumParticles: 6,
      }),
    };
  }, [cashflowModel]);

  /* ---------- 흐름 위치 ---------- */
  const calculateFlowPosition = (startPhase, speed) => {
    const position = (startPhase + animationTime * speed) % 1;
    return position;
  };

  /* =========================
   * 입력 확정(공통)
   * ========================= */

  const commitMonthlyIncomeInput = () => {
    const parsedMonthlyIncome = clampValue(
      parseNumberSafely(inputForm.monthlyIncomeInput),
      0,
      20000000
    );

    setCashflowBase((previousCashflowBase) => {
      return {
        ...previousCashflowBase,
        monthlyIncome: parsedMonthlyIncome,
      };
    });

    setInputForm((previousInputForm) => {
      return {
        ...previousInputForm,
        monthlyIncomeInput: String(parsedMonthlyIncome),
      };
    });

    setIsUserEditing(false);
  };

  const commitFixedCostInput = () => {
    const parsedFixedCost = clampValue(
      parseNumberSafely(inputForm.fixedCostInput),
      0,
      cashflowBase.monthlyIncome
    );

    setCashflowBase((previousCashflowBase) => {
      return {
        ...previousCashflowBase,
        fixedCost: parsedFixedCost,
      };
    });

    setInputForm((previousInputForm) => {
      return {
        ...previousInputForm,
        fixedCostInput: String(parsedFixedCost),
      };
    });

    setIsUserEditing(false);
  };

  const commitRemainTargetInput = () => {
    const parsedRemainTarget = clampValue(
      parseNumberSafely(inputForm.remainTargetInput),
      0,
      cashflowBase.monthlyIncome
    );

    setRemainTargetValue(parsedRemainTarget);

    setInputForm((previousInputForm) => {
      return {
        ...previousInputForm,
        remainTargetInput: String(parsedRemainTarget),
      };
    });

    setIsUserEditing(false);
  };

  const commitDetailCostsInput = () => {
    const parsedLivingCost = clampValue(
      parseNumberSafely(inputForm.livingCostInput),
      0,
      cashflowBase.monthlyIncome
    );

    const parsedInterestCost = clampValue(
      parseNumberSafely(inputForm.interestCostInput),
      0,
      cashflowBase.monthlyIncome
    );

    const parsedFeeCost = clampValue(
      parseNumberSafely(inputForm.feeCostInput),
      0,
      cashflowBase.monthlyIncome
    );

    const parsedSubscriptionCost = clampValue(
      parseNumberSafely(inputForm.subscriptionCostInput),
      0,
      cashflowBase.monthlyIncome
    );

    setCashflowBase((previousCashflowBase) => {
      return {
        ...previousCashflowBase,
        baseLivingCost: parsedLivingCost,
        baseInterestCost: parsedInterestCost,
        baseFeeCost: parsedFeeCost,
        baseSubscriptionCost: parsedSubscriptionCost,
      };
    });

    setInputForm((previousInputForm) => {
      return {
        ...previousInputForm,
        livingCostInput: String(parsedLivingCost),
        interestCostInput: String(parsedInterestCost),
        feeCostInput: String(parsedFeeCost),
        subscriptionCostInput: String(parsedSubscriptionCost),
      };
    });

    setIsUserEditing(false);
  };

  const handleEnterToCommit = (keyboardEvent, commitFunction) => {
    if (keyboardEvent.key !== "Enter") return;
    keyboardEvent.currentTarget.blur();
    commitFunction();
  };

  /* =========================
   * 링크 이동(데모)
   * ========================= */
  const handleClickGoToDetails = () => {
    const detailSection = document.querySelector('[aria-label="고정비 상세내역"]');
    detailSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* =========================
   * 1단계 항목 고정 (가독성)
   * - 월 수입 / 고정비 / 이번 달 잔액 / 누수
   * ========================= */
  const stage1Items = useMemo(() => {
    return [
      {
        key: "income",
        label: "월 수입",
        value: cashflowModel.monthlyIncome,
        tone: "base",
      },
      {
        key: "fixed",
        label: "고정비",
        value: cashflowModel.fixedCost,
        tone: "base",
      },
      {
        key: "leak",
        label: "이번 달 누수(이자·수수료·구독)",
        value: cashflowModel.leakCost,
        tone: "leak",
      },
      {
        key: "balance",
        label: "이번 달 잔액",
        value: cashflowModel.remainingMoney,
        tone: cashflowModel.remainingMoney >= 0 ? "good" : "bad",
      },
    ];
  }, [cashflowModel]);

  return (
    <div className="main_wrap">
      {/* ======================
       * HERO: 좌(평균/입력카드) + 우(1단계 항목 고정 + 레이더)
       * ====================== */}
      <section className="hero_radar" aria-label="히어로 비교 영역">

        {/* LEFT */}
        <div className="hero_radar__left">

<div className="hero_radar__topbar">
  <div className="hero_radar__kicker">나가는 돈 줄여보자</div>

  <div className="hero_radar__top_actions">
    <button
      type="button"
      className="btn_primary"
      onClick={() => setIsHeroCardFlipped(true)}
      aria-label="내 값 입력으로 전환"
      title="내 값 입력"
    >
      <FiEdit3 style={{ marginRight: 6, verticalAlign: "-2px" }} />
      내 값 입력
    </button>

    <button
      type="button"
      className="btn_ghost"
      onClick={() => setIsHeroCardFlipped(false)}
      aria-label="평균 보기로 전환"
      title="평균 보기"
    >
      <FiRefreshCcw style={{ marginRight: 6, verticalAlign: "-2px" }} />
      평균 보기
    </button>
  </div>
</div>


          <div className="hero_radar__kicker">나가는 돈 줄여보자</div>

          <h2 className="hero_radar__title">
            평균을 기준으로 보면, <span className="hero_radar__em">새는 돈</span>이 더 또렷해집니다.
          </h2>

          <FlipCard
            isFlipped={isHeroCardFlipped}
            front={
              <div className="hero_radar__big">
                <div className="hero_radar__big_label">30대 평균 총액(데모)</div>
                <div className="hero_radar__big_value">
                  {formatKoreanWon(demographicAverage.averageMonthlyIncome)}
                </div>

                <div className="hero_radar__big_sub">
                  <div className="muted">평균 소비금액(고정비 + 생활비 + 누수)</div>
                  <b className="leak">{formatKoreanWon(demographicAverage.averageTotalOutflow)}</b>

                  <div style={{ marginTop: 10 }} className="muted">
                    평균 잔액(단순 계산)
                  </div>
                  <b className={demographicAverage.averageRemaining >= 0 ? "good" : "bad"}>
                    {formatKoreanWon(demographicAverage.averageRemaining)}
                  </b>
                </div>

                <div style={{ marginTop: 12 }} className="hero_radar__big_sub">
                  <div className="muted">평균 누수(이자·수수료·구독)</div>
                  <b className="leak">{formatKoreanWon(animatedLeakValue)}</b>
                </div>

                <div style={{ marginTop: 10 }} className="muted">
                  * 데모 값입니다. 나중에 실제 통계(출처)로 교체하면 “산정 근거”가 자동으로 설득력을 가집니다.
                </div>
              </div>
            }
            back={
              <div>
                <section className="top_kpi_grid" aria-label="내 정보 입력(히어로)">
                  <div className="kpi_box kpi_a">
                    <div className="kpi_label">월 수입</div>
                    <div className="kpi_value">{formatKoreanWon(cashflowModel.monthlyIncome)}</div>

                    <input
                      className="kpi_input"
                      inputMode="numeric"
                      value={inputForm.monthlyIncomeInput}
                      onFocus={() => setIsUserEditing(true)}
                      onChange={(event) => {
                        setInputForm((previousInputForm) => {
                          return {
                            ...previousInputForm,
                            monthlyIncomeInput: event.target.value,
                          };
                        });
                      }}
                      onBlur={commitMonthlyIncomeInput}
                      onKeyDown={(keyboardEvent) => {
                        handleEnterToCommit(keyboardEvent, commitMonthlyIncomeInput);
                      }}
                      aria-label="월 수입 입력"
                    />
                  </div>

                  <div className="kpi_box kpi_b">
                    <div className="kpi_label">고정비</div>
                    <div className="kpi_value">{formatKoreanWon(cashflowModel.fixedCost)}</div>

                    <input
                      className="kpi_input"
                      inputMode="numeric"
                      value={inputForm.fixedCostInput}
                      onFocus={() => setIsUserEditing(true)}
                      onChange={(event) => {
                        setInputForm((previousInputForm) => {
                          return {
                            ...previousInputForm,
                            fixedCostInput: event.target.value,
                          };
                        });
                      }}
                      onBlur={commitFixedCostInput}
                      onKeyDown={(keyboardEvent) => {
                        handleEnterToCommit(keyboardEvent, commitFixedCostInput);
                      }}
                      aria-label="고정비 입력"
                    />
                  </div>

                  <div className="kpi_box kpi_c">
                    <div className="kpi_label">이번 달 잔액 목표</div>
                    <div className={`kpi_value ${cashflowModel.remainingMoney >= 0 ? "good" : "bad"}`}>
                      {formatKoreanWon(cashflowModel.remainingMoney)}
                    </div>

                    <input
                      className="kpi_input"
                      inputMode="numeric"
                      value={inputForm.remainTargetInput}
                      onFocus={() => setIsUserEditing(true)}
                      onChange={(event) => {
                        setInputForm((previousInputForm) => {
                          return {
                            ...previousInputForm,
                            remainTargetInput: event.target.value,
                          };
                        });
                      }}
                      onBlur={commitRemainTargetInput}
                      onKeyDown={(keyboardEvent) => {
                        handleEnterToCommit(keyboardEvent, commitRemainTargetInput);
                      }}
                      aria-label="잔액 목표 입력"
                    />

                    <div className="kpi_sub muted">
                      목표를 올리면 <b className="leak">누수</b>부터 자동으로 줄어듭니다(가정)
                    </div>
                  </div>
                </section>

                <div className="hero_radar__mini muted" style={{ marginTop: 10 }}>
                  입력 중에는 흐름이 멈추고, 확정하면 다시 흐릅니다.
                </div>
              </div>
            }
          />
        </div>

        {/* RIGHT */}
        <div className="hero_radar__right">
          <div className="radar_card">
            <div className="radar_card__head">
              <div className="radar_card__title">나의 예상 소비(1단계)</div>
              <div className="radar_card__sub muted">
                먼저 4개 항목으로 고정해서 “흐름”부터 잡습니다.
              </div>
            </div>

            {/* ✅ 1단계 항목 고정: 월수입/고정비/누수/이번달 잔액 */}
            <div className="radar_legend" aria-label="1단계 항목">
              {stage1Items.map((item) => {
                const valueClass =
                  item.tone === "leak" ? "leak" : item.tone === "good" ? "good" : item.tone === "bad" ? "bad" : "";

                const dotClass =
                  item.key === "leak" ? "leak" : item.key === "balance" ? (cashflowModel.remainingMoney >= 0 ? "living" : "leak") : "living";

                return (
                  <div key={item.key} className="radar_legend__row">
                    <span className={`legend_dot ${dotClass}`} />
                    <span className="legend_label">{item.label}</span>
                    <b className={`legend_value ${valueClass}`}>{formatKoreanWon(item.value)}</b>
                  </div>
                );
              })}
            </div>

            {/* ✅ 도넛도 “1단계 흐름”이 읽히게: 고정비 vs 누수 vs 잔액 */}
            <div className="radar_chart" style={{ marginTop: 8 }}>
              <RadarDonut
                animationTime={animationTime}
                isUserEditing={isUserEditing}
                segments={[
                  { key: "fixed", label: "고정비", value: cashflowModel.fixedCost, tone: "living" },
                  { key: "leak", label: "누수", value: cashflowModel.leakCost, tone: "leak" },
                  {
                    key: "balance",
                    label: "이번 달 잔액",
                    value: Math.max(0, cashflowModel.remainingMoney),
                    tone: cashflowModel.remainingMoney >= 0 ? "living" : "leak",
                  },
                ]}
                centerTopLabel="나의 흐름"
                centerValue={cashflowModel.leakCost}
                centerBottomLabel="이번 달 누수"
              />
            </div>

            <div className="panel_sub muted" style={{ marginTop: 10 }}>
              결론은 간단합니다. <b className="leak">누수</b>를 줄이면 <b>이번 달 잔액</b>이 커집니다.
            </div>

            <div className="hero_radar__cta" style={{ marginTop: 10 }}>
              <button type="button" className="btn_primary" onClick={handleClickGoToDetails}>
                더 자세히 보기
              </button>
              <button
                type="button"
                className="btn_ghost"
                onClick={() => {
                  const leakSection = document.querySelector('[aria-label="이번 달 또 없어질 돈"]');
                  leakSection?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                누수부터 보기
              </button>
            </div>

            <div className="hero_radar__mini muted">
              * 다음 단계에서 생활비/구독 등을 더 잘게 쪼개는 흐름(설문/연동)을 붙이면 자연스럽게 확장됩니다.
            </div>
          </div>
        </div>
      </section>

      {/* ======================
       * 2) 이번달 또 없어질 돈(누수)
       * ====================== */}
      <section className="panel" aria-label="이번 달 또 없어질 돈">
        <div className="panel_head">
          <div className="panel_title">이번 달 누수</div>
          <div className="panel_value leak">{formatKoreanWon(cashflowModel.leakCost)}</div>
        </div>

        <div className="panel_sub muted">
          목표 기준 절감 추정: <b className="plus">{formatKoreanWon(cashflowModel.leakSaved)}</b>
        </div>

        <div className="leak_pipe_preview">
          <PipeLane
            title="이자·수수료·구독"
            value={cashflowModel.leakCost}
            tone="leak"
            thickness={pipeThickness.leak}
            particles={particles.leak}
            isUserEditing={isUserEditing}
            calculateFlowPosition={calculateFlowPosition}
            pulseValue={leakPulseValue}
          />
        </div>
      </section>

      {/* ======================
       * 3) 고정비 상세내역
       * ====================== */}
      <section className="panel" aria-label="고정비 상세내역">
        <div className="panel_head">
          <div className="panel_title">지출 상세(생활비 + 누수)</div>
          <div className="panel_value">
            {formatKoreanWon(cashflowModel.livingCost + cashflowModel.leakCost)}
          </div>
        </div>

        <div className="detail_grid">
          <div className="detail_item">
            <div className="detail_label">생활비</div>
            <div className="detail_value">{formatKoreanWon(cashflowModel.livingCost)}</div>
            <input
              className="detail_input"
              inputMode="numeric"
              value={inputForm.livingCostInput}
              onFocus={() => setIsUserEditing(true)}
              onChange={(event) => {
                setInputForm((previousInputForm) => {
                  return {
                    ...previousInputForm,
                    livingCostInput: event.target.value,
                  };
                });
              }}
              onBlur={commitDetailCostsInput}
              onKeyDown={(keyboardEvent) => {
                handleEnterToCommit(keyboardEvent, commitDetailCostsInput);
              }}
              aria-label="생활비 입력"
            />
          </div>

          <div className="detail_item">
            <div className="detail_label">이자</div>
            <div className="detail_value">{formatKoreanWon(cashflowModel.interestCost)}</div>
            <input
              className="detail_input"
              inputMode="numeric"
              value={inputForm.interestCostInput}
              onFocus={() => setIsUserEditing(true)}
              onChange={(event) => {
                setInputForm((previousInputForm) => {
                  return {
                    ...previousInputForm,
                    interestCostInput: event.target.value,
                  };
                });
              }}
              onBlur={commitDetailCostsInput}
              onKeyDown={(keyboardEvent) => {
                handleEnterToCommit(keyboardEvent, commitDetailCostsInput);
              }}
              aria-label="이자 입력"
            />
          </div>

          <div className="detail_item">
            <div className="detail_label">수수료</div>
            <div className="detail_value">{formatKoreanWon(cashflowModel.feeCost)}</div>
            <input
              className="detail_input"
              inputMode="numeric"
              value={inputForm.feeCostInput}
              onFocus={() => setIsUserEditing(true)}
              onChange={(event) => {
                setInputForm((previousInputForm) => {
                  return {
                    ...previousInputForm,
                    feeCostInput: event.target.value,
                  };
                });
              }}
              onBlur={commitDetailCostsInput}
              onKeyDown={(keyboardEvent) => {
                handleEnterToCommit(keyboardEvent, commitDetailCostsInput);
              }}
              aria-label="수수료 입력"
            />
          </div>

          <div className="detail_item">
            <div className="detail_label">구독</div>
            <div className="detail_value">{formatKoreanWon(cashflowModel.subscriptionCost)}</div>
            <input
              className="detail_input"
              inputMode="numeric"
              value={inputForm.subscriptionCostInput}
              onFocus={() => setIsUserEditing(true)}
              onChange={(event) => {
                setInputForm((previousInputForm) => {
                  return {
                    ...previousInputForm,
                    subscriptionCostInput: event.target.value,
                  };
                });
              }}
              onBlur={commitDetailCostsInput}
              onKeyDown={(keyboardEvent) => {
                handleEnterToCommit(keyboardEvent, commitDetailCostsInput);
              }}
              aria-label="구독 입력"
            />
          </div>
        </div>

        <div className="panel_sub muted" style={{ marginTop: 10 }}>
          입력 중에는 흐름이 멈추고, 확정하면 다시 흐릅니다.
        </div>
      </section>

      {/* ======================
       * 4) 이번달 잔액 (기존 남는 돈 → 잔액)
       * ====================== */}
      <section className="panel" aria-label="이번 달 잔액">
        <div className="panel_head">
          <div className="panel_title">이번 달 잔액</div>
          <div className={`panel_value ${cashflowModel.remainingMoney >= 0 ? "good" : "bad"}`}>
            {formatKoreanWon(cashflowModel.remainingMoney)}
          </div>
        </div>

        <div className="drop_block">
          <div className="drop_pipe" data-tone={cashflowModel.remainingMoney >= 0 ? "good" : "bad"}>
            <div className={`drop_stream ${isUserEditing ? "is_paused" : ""}`} />

            <div className="drop_chips" aria-hidden="true">
              {particles.remain.map((particle) => {
                const position = calculateFlowPosition(particle.startPhase, particle.speed);
                const verticalPercent = (position * 100) % 100;

                return (
                  <span
                    key={particle.id}
                    className="chip chip_good"
                    style={{
                      top: `${verticalPercent}%`,
                      left: `${particle.laneIndex ? 58 : 18}%`,
                      transform: "translateY(-50%)",
                    }}
                  >
                    +{formatKoreanWonShort(particle.amount)}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="drop_note">
            <b>핵심:</b> <b className="leak">누수</b>를 줄이면 <b>이번 달 잔액</b>이 커집니다.
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================
 * FlipCard (버튼 제거 버전)
 * ========================= */

function FlipCard({ isFlipped, front, back }) {
  return (
    <div className={`flip_card ${isFlipped ? "is_flipped" : ""}`}>
      <div className="flip_card__inner">
        <div className="flip_card__face flip_card__front">{front}</div>
        <div className="flip_card__face flip_card__back">{back}</div>
      </div>
    </div>
  );
}

/* =========================
 * PipeLane
 * ========================= */

function PipeLane({
  title,
  value,
  tone = "base",
  thickness = 0.25,
  particles = [],
  isUserEditing,
  calculateFlowPosition,
  pulseValue,
}) {
  const pipeHeightInPixels = clampValue(thickness * 44, 8, 28);

  const leakStyle =
    tone === "leak"
      ? {
          boxShadow: `0 0 ${Math.round(10 + (pulseValue || 0) * 14)}px rgba(220,38,38,0.25)`,
          borderColor: `rgba(220,38,38,${0.22 + (pulseValue || 0) * 0.18})`,
        }
      : undefined;

  return (
    <div className={`lane lane_${tone}`}>
      <div className="lane_head">
        <div className="lane_title">{title}</div>
        <div className={`lane_value ${tone === "leak" ? "leak" : ""}`}>{formatKoreanWon(value)}</div>
      </div>

      <div className="lane_pipe" style={{ height: `${pipeHeightInPixels}px`, ...leakStyle }}>
        <div className={`lane_stream ${tone === "leak" ? "is_leak" : ""} ${isUserEditing ? "is_paused" : ""}`} />

        <div className="lane_chips" aria-hidden="true">
          {particles.map((particle) => {
            const position = calculateFlowPosition(particle.startPhase, particle.speed);
            const leftPercent = 6 + position * 88;

            return (
              <span
                key={particle.id}
                className={`chip ${tone === "leak" ? "chip_leak" : "chip_base"}`}
                style={{
                  left: `${leftPercent}%`,
                  top: particle.laneIndex ? "70%" : "30%",
                }}
              >
                -{formatKoreanWonShort(particle.amount)}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =========================
 * RadarDonut
 * ========================= */

function RadarDonut({
  segments = [],
  centerTopLabel,
  centerValue,
  centerBottomLabel,
  animationTime,
  isUserEditing,
}) {
  const size = 220;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const totalValue = Math.max(
    1,
    segments.reduce((accumulator, segment) => accumulator + Math.max(0, segment.value), 0)
  );

  const startAt = -90;

  const pulseValue = isUserEditing ? 0 : 0.5 + 0.5 * Math.sin(animationTime * 2.0);
  const leakGlowOpacity = 0.18 + pulseValue * 0.22;

  let cumulative = 0;

  return (
    <div className="radar_donut" style={{ width: `${size}px`, height: `${size}px` }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="레이더 도넛">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="radar_ring_bg"
          strokeWidth={strokeWidth}
        />

        {segments.map((segment) => {
          const safeValue = Math.max(0, segment.value);
          const ratio = safeValue / totalValue;
          const segmentLength = ratio * circumference;

          const dashArray = `${segmentLength} ${circumference - segmentLength}`;
          const dashOffset = circumference * (1 - cumulative);

          cumulative += ratio;

          return (
            <circle
              key={segment.key}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              className={`radar_segment ${segment.tone === "leak" ? "is_leak" : "is_living"}`}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              transform={`rotate(${startAt} ${size / 2} ${size / 2})`}
              style={
                segment.tone === "leak"
                  ? { filter: `drop-shadow(0 0 10px rgba(220, 38, 38, ${leakGlowOpacity}))` }
                  : undefined
              }
            />
          );
        })}
      </svg>

      <div className="radar_center">
        <div className="radar_center__top">{centerTopLabel}</div>
        <div className={`radar_center__value ${centerValue >= 0 ? "leak" : ""}`}>
          {formatKoreanWonShort(centerValue)}
        </div>
        <div className="radar_center__bottom muted">{centerBottomLabel}</div>
      </div>
    </div>
  );
}
