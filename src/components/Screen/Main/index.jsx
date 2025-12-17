import { useEffect, useMemo, useRef, useState } from "react";
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
 * ScreenMain
 * ========================= */

export default function ScreenMain() {
  /* ---------- 사용자 기본값 ---------- */
  const [cashflowBase, setCashflowBase] = useState({
    monthlyIncome: 3800000,
    fixedCost: 1350000,

    baseLivingCost: 980000,
    baseInterestCost: 210000,
    baseFeeCost: 65000,
    baseSubscriptionCost: 52000,
  });

  /* ---------- 목표(잔액) ---------- */
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

  /* ---------- 애니메이션 시간 ---------- */
  const [animationTime, setAnimationTime] = useState(0);

  useRequestAnimationFrameLoop(!isUserEditing, (deltaTimeInSeconds) => {
    setAnimationTime((previousAnimationTime) => previousAnimationTime + deltaTimeInSeconds);
  });

  /* ---------- 모델 계산 ---------- */
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

  /* ---------- 누수 강조(맥박) ---------- */
  const leakPulseValue = useMemo(() => {
    return 0.5 + 0.5 * Math.sin(animationTime * 2.1);
  }, [animationTime]);

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
    const parsedMonthlyIncome = clampValue(parseNumberSafely(inputForm.monthlyIncomeInput), 0, 20000000);

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
    const parsedFixedCost = clampValue(parseNumberSafely(inputForm.fixedCostInput), 0, cashflowBase.monthlyIncome);

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
    const parsedRemainTarget = clampValue(parseNumberSafely(inputForm.remainTargetInput), 0, cashflowBase.monthlyIncome);

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
    const parsedLivingCost = clampValue(parseNumberSafely(inputForm.livingCostInput), 0, cashflowBase.monthlyIncome);
    const parsedInterestCost = clampValue(parseNumberSafely(inputForm.interestCostInput), 0, cashflowBase.monthlyIncome);
    const parsedFeeCost = clampValue(parseNumberSafely(inputForm.feeCostInput), 0, cashflowBase.monthlyIncome);
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
   * 화면 구성(요청한 구조)
   * ========================= */

  return (
    <div className="main_wrap">
      {/* ======================
       * 1) 상단 KPI 3개: 월 수입 | 고정비 | 잔액(목표)
       * ====================== */}
      <section className="top_kpi_grid" aria-label="상단 핵심 지표">
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
            onKeyDown={(keyboardEvent) => handleEnterToCommit(keyboardEvent, commitMonthlyIncomeInput)}
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
            onKeyDown={(keyboardEvent) => handleEnterToCommit(keyboardEvent, commitFixedCostInput)}
            aria-label="고정비 입력"
          />
        </div>

        <div className="kpi_box kpi_c">
          <div className="kpi_label">이번 달 남는 돈(잔액 목표)</div>
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
            onKeyDown={(keyboardEvent) => handleEnterToCommit(keyboardEvent, commitRemainTargetInput)}
            aria-label="잔액 목표 입력"
          />

          <div className="kpi_sub muted">
            목표를 올리면 <b className="leak">누수(이자·수수료·구독)</b>부터 자동으로 줄어듭니다(가정)
          </div>
        </div>
      </section>

      {/* ======================
       * 2) 이번달 또 없어질 돈(누수)
       * ====================== */}
      <section className="panel" aria-label="이번 달 또 없어질 돈">
        <div className="panel_head">
          <div className="panel_title">이번 달 또 없어질 돈</div>
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
       * - 생활비 / 이자 / 수수료 / 구독
       * ====================== */}
      <section className="panel" aria-label="고정비 상세내역">
        <div className="panel_head">
          <div className="panel_title">고정비 상세내역</div>
          <div className="panel_value">{formatKoreanWon(cashflowModel.livingCost + cashflowModel.leakCost)}</div>
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
              onKeyDown={(keyboardEvent) => handleEnterToCommit(keyboardEvent, commitDetailCostsInput)}
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
              onKeyDown={(keyboardEvent) => handleEnterToCommit(keyboardEvent, commitDetailCostsInput)}
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
              onKeyDown={(keyboardEvent) => handleEnterToCommit(keyboardEvent, commitDetailCostsInput)}
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
              onKeyDown={(keyboardEvent) => handleEnterToCommit(keyboardEvent, commitDetailCostsInput)}
              aria-label="구독 입력"
            />
          </div>
        </div>

        <div className="panel_sub muted">
          입력 중에는 흐름이 멈추고, 확정하면 다시 흐릅니다.
        </div>
      </section>

      {/* ======================
       * 4) 이번달 남는 돈(잔액) — 드롭(떨어지는 느낌)
       * ====================== */}
      <section className="panel" aria-label="이번 달 남는 돈">
        <div className="panel_head">
          <div className="panel_title">이번 달 남는 돈</div>
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
            <b>핵심:</b> 남는 돈을 만들려면, <b className="leak">누수부터 줄어야</b> 합니다.
          </div>
        </div>
      </section>
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
