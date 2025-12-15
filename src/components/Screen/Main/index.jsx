import { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";
import Screen from "../../Layout/Screen";
import Inner from "../../Content/Inner";
import SampleBg from "../../../assets/background/sample_bg.png";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const round = (v) => Math.round(v);

function makeId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
function formatDelta(n) {
  const s = n > 0 ? "+" : "";
  return `${s}${n}`;
}
function scoreLabel(score) {
  if (score >= 870) return { text: "최우수", tone: "good" };
  if (score >= 800) return { text: "우수", tone: "good" };
  if (score >= 740) return { text: "양호", tone: "mid" };
  if (score >= 650) return { text: "보통", tone: "mid" };
  return { text: "주의", tone: "bad" };
}

function calcScore(inputs) {
  const base = 760;

  const utilPenalty =
    inputs.cardUtil <= 30
      ? -2
      : inputs.cardUtil <= 50
      ? -10
      : inputs.cardUtil <= 70
      ? -22
      : -38;

  const delinPenalty =
    inputs.delinquency === "none"
      ? 0
      : inputs.delinquency === "once"
      ? -35
      : -70;

  const loanPenalty = -Math.min(5, inputs.loanCount) * 10;

  const ageBonus =
    inputs.creditAgeMonths >= 120
      ? +28
      : inputs.creditAgeMonths >= 60
      ? +18
      : inputs.creditAgeMonths >= 24
      ? +10
      : +2;

  const newCreditPenalty = inputs.recentNewCredit ? -14 : 0;

  const autopayBonus =
    (inputs.autopayTel ? 6 : 0) +
    (inputs.autopayInsurance ? 6 : 0) +
    (inputs.autopayRent ? 4 : 0);

  const score = clamp(
    base +
      utilPenalty +
      delinPenalty +
      loanPenalty +
      ageBonus +
      newCreditPenalty +
      autopayBonus,
    350,
    950
  );

  const breakdown = [
    { key: "util", label: "카드 사용률", value: utilPenalty },
    { key: "delin", label: "최근 연체", value: delinPenalty },
    { key: "loan", label: "대출 건수", value: loanPenalty },
    { key: "age", label: "거래기간", value: ageBonus },
    { key: "new", label: "최근 신규", value: newCreditPenalty },
    { key: "auto", label: "성실납부", value: autopayBonus },
  ];

  const worst = breakdown
    .filter((x) => x.value < 0)
    .sort((a, b) => a.value - b.value)[0]?.key;

  return { score: round(score), breakdown, worstKey: worst || null };
}

function buildSeries({ months, currentScore, improvedScore }) {
  const n = months;
  const now = currentScore;
  const target = improvedScore;

  const start = clamp(now - 45, 350, 950);

  const current = [];
  const improved = [];

  for (let i = 0; i <= n; i++) {
    const t = i / n;

    const cur = start + (now - start) * (0.15 + 0.85 * t);

    const ease = t < 0.4 ? t * 0.6 : 0.24 + (t - 0.4) * 1.266;
    const imp = start + (target - start) * clamp(ease, 0, 1);

    current.push({ x: i, y: round(cur) });
    improved.push({ x: i, y: round(imp) });
  }

  return { current, improved };
}

function svgPathFromSeries(series, w, h, pad, yMin, yMax) {
  const xMax = Math.max(1, series[series.length - 1]?.x || 1);

  const sx = (x) => pad + (x / xMax) * (w - pad * 2);
  const sy = (y) => {
    const t = (y - yMin) / Math.max(1, yMax - yMin);
    return pad + (1 - t) * (h - pad * 2);
  };

  let d = "";
  for (let i = 0; i < series.length; i++) {
    const p = series[i];
    const x = sx(p.x);
    const y = sy(p.y);
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return d;
}

function getNearestPoint({ seriesCurrent, seriesImproved, xMax, xValue }) {
  const idx = clamp(Math.round(xValue), 0, xMax);
  const cur = seriesCurrent[idx];
  const imp = seriesImproved[idx];
  return { idx, cur, imp };
}

const STORAGE_KEY = "credit_simulator_scenarios_v1";

const ScreenMain = () => {
  const [inputs, setInputs] = useState({
    cardUtil: 42,
    delinquency: "none",
    loanCount: 1,
    creditAgeMonths: 36,
    recentNewCredit: false,
    autopayTel: true,
    autopayInsurance: false,
    autopayRent: false,
  });

  const [actions, setActions] = useState({
    keepUtilUnder30: false,
    enableAutopay: true,
    avoidNewCredit: true,
  });

  const [rangeMonths, setRangeMonths] = useState(6);

  const [scenarios, setScenarios] = useState([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState("live");
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);

  // ✅ 프리셋(보수/공격/안정)
  const PRESETS = useMemo(() => {
    return [
      {
        key: "conservative",
        label: "보수적",
        desc: "안정적인 상태(연체 없음, 사용률 낮음, 신규 없음)",
        inputs: {
          cardUtil: 25,
          delinquency: "none",
          loanCount: 0,
          creditAgeMonths: 84,
          recentNewCredit: false,
          autopayTel: true,
          autopayInsurance: true,
          autopayRent: false,
        },
        actions: {
          keepUtilUnder30: true,
          enableAutopay: true,
          avoidNewCredit: true,
        },
      },
      {
        key: "aggressive",
        label: "공격적",
        desc: "리스크가 큰 상태(사용률 높음, 신규 있음, 대출 다수)",
        inputs: {
          cardUtil: 78,
          delinquency: "once",
          loanCount: 3,
          creditAgeMonths: 18,
          recentNewCredit: true,
          autopayTel: false,
          autopayInsurance: false,
          autopayRent: false,
        },
        actions: {
          keepUtilUnder30: false,
          enableAutopay: false,
          avoidNewCredit: false,
        },
      },
      {
        key: "stable",
        label: "안정형",
        desc: "무난한 상태(사용률 중간, 거래기간 보통, 자동이체 일부)",
        inputs: {
          cardUtil: 42,
          delinquency: "none",
          loanCount: 1,
          creditAgeMonths: 48,
          recentNewCredit: false,
          autopayTel: true,
          autopayInsurance: false,
          autopayRent: false,
        },
        actions: {
          keepUtilUnder30: false,
          enableAutopay: true,
          avoidNewCredit: true,
        },
      },
    ];
  }, []);

  const applyPreset = (presetKey) => {
    const p = PRESETS.find((x) => x.key === presetKey);
    if (!p) return;

    // 라이브 상태로 전환 후 적용
    setSelectedScenarioId("live");
    setInputs(p.inputs);
    setActions(p.actions);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setScenarios(parsed);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
    } catch {}
  }, [scenarios]);

  const activeSnapshot = useMemo(() => {
    if (selectedScenarioId === "live") return { name: "실시간 시뮬레이션", inputs, actions };
    const found = scenarios.find((s) => s.id === selectedScenarioId);
    if (!found) return { name: "실시간 시뮬레이션", inputs, actions };
    return found;
  }, [selectedScenarioId, scenarios, inputs, actions]);

  const activeCalc = useMemo(() => {
    const base = calcScore(activeSnapshot.inputs);

    let nextInputs = { ...activeSnapshot.inputs };
    const act = activeSnapshot.actions;

    if (act?.keepUtilUnder30) nextInputs.cardUtil = Math.min(nextInputs.cardUtil, 30);
    if (act?.avoidNewCredit) nextInputs.recentNewCredit = false;
    if (act?.enableAutopay) nextInputs.autopayTel = true;

    const improved = calcScore(nextInputs).score;

    return { base, improved };
  }, [activeSnapshot]);

  // ✅ 히어로 점수 CountUp
  const [displayScore, setDisplayScore] = useState(activeCalc.base.score);
  const rafRef = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    const from = displayScore;
    const to = activeCalc.base.score;
    const start = performance.now();
    const dur = 420;

    const tick = (now) => {
      const t = clamp((now - start) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(round(from + (to - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCalc.base.score]);

  const deltaToImproved = activeCalc.improved - activeCalc.base.score;
  const grade = scoreLabel(displayScore);

  // ✅ 차트 데이터
  const series = useMemo(() => {
    const { current, improved } = buildSeries({
      months: rangeMonths,
      currentScore: activeCalc.base.score,
      improvedScore: activeCalc.improved,
    });

    const allY = [...current, ...improved].map((p) => p.y);
    const yMin = clamp(Math.min(...allY) - 20, 350, 950);
    const yMax = clamp(Math.max(...allY) + 20, 350, 950);

    return { current, improved, yMin, yMax };
  }, [rangeMonths, activeCalc.base.score, activeCalc.improved]);

  const chart = useMemo(() => {
    const w = 820;
    const h = 220;
    const pad = 18;
    const curPath = svgPathFromSeries(series.current, w, h, pad, series.yMin, series.yMax);
    const impPath = svgPathFromSeries(series.improved, w, h, pad, series.yMin, series.yMax);

    const grid = [];
    for (let i = 0; i <= 4; i++) {
      const y = pad + (i / 4) * (h - pad * 2);
      grid.push(y);
    }

    return { w, h, pad, curPath, impPath, grid };
  }, [series]);

  // ✅ 차트 hover tooltip
  const chartWrapRef = useRef(null);
  const [hover, setHover] = useState({
    isOn: false,
    px: 0,
    py: 0,
    monthIndex: 0,
    curY: null,
    impY: null,
  });

  const getChartPointPx = (monthIndex, yValue) => {
    const { w, h, pad } = chart;
    const xMax = rangeMonths;

    const sx = pad + (monthIndex / xMax) * (w - pad * 2);
    const t = (yValue - series.yMin) / Math.max(1, series.yMax - series.yMin);
    const sy = pad + (1 - t) * (h - pad * 2);
    return { sx, sy };
  };

  const onChartMove = (e) => {
    const el = chartWrapRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = clamp(e.clientX - rect.left, 0, rect.width);
    const y = clamp(e.clientY - rect.top, 0, rect.height);

    // x를 monthIndex로 환산
    const xMax = rangeMonths;
    const month = (x / rect.width) * xMax;
    const { cur, imp } = getNearestPoint({
      seriesCurrent: series.current,
      seriesImproved: series.improved,
      xMax,
      xValue: month,
    });

    // 툴팁의 기준점은 “개선 라인” 좌표로 찍어주면 보기 좋음
    const p = getChartPointPx(cur.x, imp.y);

    // SVG 좌표(w=820,h=220)를 DOM(px)로 변환
    const scaleX = rect.width / chart.w;
    const scaleY = rect.height / chart.h;

    setHover({
      isOn: true,
      px: p.sx * scaleX,
      py: p.sy * scaleY,
      monthIndex: cur.x,
      curY: cur.y,
      impY: imp.y,
      rawX: x,
      rawY: y,
    });
  };

  const onChartLeave = () => setHover((p) => ({ ...p, isOn: false }));

  // 섹션4 영향도
  const breakdown = activeCalc.base.breakdown;
  const worstKey = activeCalc.base.worstKey;

  // 섹션5 추천(간단)
  const recommended = useMemo(() => {
    const s = activeSnapshot.inputs;
    const list = [];

    if (s.cardUtil > 30) {
      list.push({
        key: "keepUtilUnder30",
        title: "카드 사용률 30% 이하로 관리",
        effect: "+8~+18",
        desc: "사용률이 높을수록 감점이 커지는 가정입니다.",
      });
    }

    if (s.delinquency !== "none") {
      list.push({
        key: "noDelinquency",
        title: "연체 방지(자동이체/알림)",
        effect: "+15~+40",
        desc: "연체는 큰 감점 요인으로 가정합니다.",
      });
    }

    if (s.recentNewCredit) {
      list.push({
        key: "avoidNewCredit",
        title: "최근 신규 발급/대출 자제",
        effect: "+6~+14",
        desc: "단기 신규는 감점 가정입니다.",
      });
    }

    if (!s.autopayTel && !s.autopayInsurance && !s.autopayRent) {
      list.push({
        key: "enableAutopay",
        title: "성실납부(통신비/보험 등) 반영",
        effect: "+4~+12",
        desc: "성실 납부 실적은 소폭 가산으로 가정합니다.",
      });
    }

    if (list.length < 3) {
      list.push({
        key: "keepStable",
        title: "급격한 패턴 변화 줄이기",
        effect: "+2~+8",
        desc: "안정적인 패턴을 유리하게 가정합니다.",
      });
    }

    return list.slice(0, 3);
  }, [activeSnapshot]);

  // 저장/비교
  const saveScenario = () => {
    const payload = {
      id: makeId(),
      name: `시나리오 ${scenarios.length + 1}`,
      createdAt: new Date().toISOString(),
      inputs,
      actions,
    };
    setScenarios([payload, ...scenarios]);
    setSelectedScenarioId(payload.id);
  };

  const removeScenario = (id) => {
    setScenarios(scenarios.filter((s) => s.id !== id));
    if (selectedScenarioId === id) setSelectedScenarioId("live");
    if (compareA?.id === id) setCompareA(null);
    if (compareB?.id === id) setCompareB(null);
  };

  const pickCompare = (which, scenarioId) => {
    const s =
      scenarioId === "live"
        ? { id: "live", name: "실시간", inputs, actions }
        : scenarios.find((x) => x.id === scenarioId);

    if (!s) return;
    if (which === "A") setCompareA(s);
    if (which === "B") setCompareB(s);
  };

  const compareResult = useMemo(() => {
    if (!compareA || !compareB) return null;

    const aBase = calcScore(compareA.inputs).score;
    const bBase = calcScore(compareB.inputs).score;

    const aImproved = (() => {
      let next = { ...compareA.inputs };
      if (compareA.actions?.keepUtilUnder30) next.cardUtil = Math.min(next.cardUtil, 30);
      if (compareA.actions?.avoidNewCredit) next.recentNewCredit = false;
      if (compareA.actions?.enableAutopay) next.autopayTel = true;
      return calcScore(next).score;
    })();

    const bImproved = (() => {
      let next = { ...compareB.inputs };
      if (compareB.actions?.keepUtilUnder30) next.cardUtil = Math.min(next.cardUtil, 30);
      if (compareB.actions?.avoidNewCredit) next.recentNewCredit = false;
      if (compareB.actions?.enableAutopay) next.autopayTel = true;
      return calcScore(next).score;
    })();

    return { aBase, bBase, aImproved, bImproved };
  }, [compareA, compareB]);

  return (
    <Screen>
      <Inner>
        <div className="sim_page" style={{ backgroundImage: `url(${SampleBg})` }}>
          {/* 섹션 1 */}
          <section className="sim_section sim_hero">
            <div className="sim_hero__left">
              <h2 className="sim_title">신용점수 시뮬레이터</h2>
              <p className="sim_sub">
                입력값을 바꾸면 점수·그래프·영향도가 즉시 반영됩니다. (가정 기반 시뮬레이션)
              </p>

              {/* ✅ 프리셋 버튼 */}
              <div className="preset_box">
                <div className="preset_head">
                  <b>프리셋</b>
                  <span>한 번에 데모 상태로 전환</span>
                </div>
                <div className="preset_row">
                  {PRESETS.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      className="preset_btn"
                      onClick={() => applyPreset(p.key)}
                      title={p.desc}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <div className="preset_desc">
                  팁: “공격적” → “보수적”으로 바꾸면 그래프·영향도 차이가 크게 보여서 데모에 좋습니다.
                </div>
              </div>
            </div>

            <div className={`score_card tone_${grade.tone}`}>
              <div className="score_card__top">
                <div className="score_badge">{grade.text}</div>
                <div className="score_mode">{selectedScenarioId === "live" ? "LIVE" : "SAVED"}</div>
              </div>

              <div className="score_value">
                <span className="score_num">{displayScore}</span>
                <span className="score_unit">점</span>
              </div>

              <div className="score_meta">
                <div className="score_meta__row">
                  <span className="score_meta__label">개선 시나리오 기준</span>
                  <span className={`score_meta__delta ${deltaToImproved >= 0 ? "plus" : "minus"}`}>
                    {formatDelta(deltaToImproved)}점
                  </span>
                </div>
                <div className="score_meta__hint">
                  ※ 실제 신용평가/금융자문이 아닌, UX 데모용 가정 모델입니다.
                </div>
              </div>
            </div>
          </section>

          {/* 섹션 2 */}
          <section className="sim_section sim_controls">
            <div className="panel">
              <div className="panel__head">
                <h3 className="panel__title">시뮬레이터 입력</h3>
                <button type="button" className="btn_ghost" onClick={() => setSelectedScenarioId("live")}>
                  실시간으로 보기
                </button>
              </div>

              <div className="controls_grid">
                <div className="control_item">
                  <div className="control_label">
                    카드 사용률 <span className="control_value">{inputs.cardUtil}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={inputs.cardUtil}
                    onChange={(e) => setInputs((p) => ({ ...p, cardUtil: Number(e.target.value) }))}
                  />
                  <div className="control_help">30% 이하가 유리하다고 가정</div>
                </div>

                <div className="control_item">
                  <div className="control_label">최근 연체</div>
                  <div className="control_row">
                    {[
                      { v: "none", t: "없음" },
                      { v: "once", t: "1회" },
                      { v: "multi", t: "2회+" },
                    ].map((x) => (
                      <label key={x.v} className={`chip ${inputs.delinquency === x.v ? "is_on" : ""}`}>
                        <input
                          type="radio"
                          name="delin"
                          value={x.v}
                          checked={inputs.delinquency === x.v}
                          onChange={() => setInputs((p) => ({ ...p, delinquency: x.v }))}
                        />
                        {x.t}
                      </label>
                    ))}
                  </div>
                  <div className="control_help">연체는 큰 감점 요인으로 가정</div>
                </div>

                <div className="control_item">
                  <div className="control_label">
                    대출 건수 <span className="control_value">{inputs.loanCount}건</span>
                  </div>
                  <div className="stepper">
                    <button
                      type="button"
                      className="btn_step"
                      onClick={() => setInputs((p) => ({ ...p, loanCount: Math.max(0, p.loanCount - 1) }))}
                    >
                      -
                    </button>
                    <div className="stepper_value">{inputs.loanCount}</div>
                    <button
                      type="button"
                      className="btn_step"
                      onClick={() => setInputs((p) => ({ ...p, loanCount: Math.min(5, p.loanCount + 1) }))}
                    >
                      +
                    </button>
                  </div>
                  <div className="control_help">대출 건수가 늘수록 감점 가정</div>
                </div>

                <div className="control_item">
                  <div className="control_label">
                    신용거래 기간 <span className="control_value">{inputs.creditAgeMonths}개월</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="180"
                    step="6"
                    value={inputs.creditAgeMonths}
                    onChange={(e) => setInputs((p) => ({ ...p, creditAgeMonths: Number(e.target.value) }))}
                  />
                  <div className="control_help">기간이 길수록 가산 가정</div>
                </div>

                <div className="control_item">
                  <div className="control_label">최근 3개월 신규 발급/대출</div>
                  <label className={`toggle ${inputs.recentNewCredit ? "is_on" : ""}`}>
                    <input
                      type="checkbox"
                      checked={inputs.recentNewCredit}
                      onChange={(e) => setInputs((p) => ({ ...p, recentNewCredit: e.target.checked }))}
                    />
                    <span className="toggle_ui" />
                    <span className="toggle_text">{inputs.recentNewCredit ? "있음" : "없음"}</span>
                  </label>
                  <div className="control_help">단기 신규는 감점 가정</div>
                </div>

                <div className="control_item">
                  <div className="control_label">성실납부 반영(가정)</div>
                  <div className="control_row">
                    {[
                      { k: "autopayTel", t: "통신비" },
                      { k: "autopayInsurance", t: "보험" },
                      { k: "autopayRent", t: "렌트/구독" },
                    ].map((x) => (
                      <label key={x.k} className={`chip ${inputs[x.k] ? "is_on" : ""}`}>
                        <input
                          type="checkbox"
                          checked={inputs[x.k]}
                          onChange={(e) => setInputs((p) => ({ ...p, [x.k]: e.target.checked }))}
                        />
                        {x.t}
                      </label>
                    ))}
                  </div>
                  <div className="control_help">성실납부는 소폭 가산 가정</div>
                </div>
              </div>
            </div>

            {/* 액션 플랜 */}
            <div className="panel">
              <div className="panel__head">
                <h3 className="panel__title">액션 플랜</h3>
                <div className="panel__hint">체크하면 개선 시나리오에 반영</div>
              </div>

              <div className="action_list">
                <label className={`action_item ${actions.keepUtilUnder30 ? "is_on" : ""}`}>
                  <input
                    type="checkbox"
                    checked={actions.keepUtilUnder30}
                    onChange={(e) => setActions((p) => ({ ...p, keepUtilUnder30: e.target.checked }))}
                  />
                  <div className="action_body">
                    <div className="action_title">카드 사용률 30% 이하로 제한</div>
                    <div className="action_meta">예상 효과: +8~+18</div>
                  </div>
                </label>

                <label className={`action_item ${actions.enableAutopay ? "is_on" : ""}`}>
                  <input
                    type="checkbox"
                    checked={actions.enableAutopay}
                    onChange={(e) => setActions((p) => ({ ...p, enableAutopay: e.target.checked }))}
                  />
                  <div className="action_body">
                    <div className="action_title">성실납부(자동이체) 반영</div>
                    <div className="action_meta">예상 효과: +4~+12</div>
                  </div>
                </label>

                <label className={`action_item ${actions.avoidNewCredit ? "is_on" : ""}`}>
                  <input
                    type="checkbox"
                    checked={actions.avoidNewCredit}
                    onChange={(e) => setActions((p) => ({ ...p, avoidNewCredit: e.target.checked }))}
                  />
                  <div className="action_body">
                    <div className="action_title">최근 신규 발급/대출 피하기</div>
                    <div className="action_meta">예상 효과: +6~+14</div>
                  </div>
                </label>

                <div className="action_result">
                  <div className="action_result__row">
                    <span>현재</span>
                    <b>{activeCalc.base.score}점</b>
                  </div>
                  <div className="action_result__row">
                    <span>개선</span>
                    <b>{activeCalc.improved}점</b>
                  </div>
                  <div className="action_result__row">
                    <span>변화</span>
                    <b className={deltaToImproved >= 0 ? "plus" : "minus"}>
                      {formatDelta(deltaToImproved)}점
                    </b>
                  </div>
                </div>

                <div className="recommend_box">
                  <div className="recommend_title">이번 점수에서 효율 좋은 3가지</div>
                  <ul className="recommend_list">
                    {recommended.map((r) => (
                      <li key={r.key} className="recommend_item">
                        <div className="recommend_main">
                          <span className="recommend_name">{r.title}</span>
                          <span className="recommend_effect">{r.effect}</span>
                        </div>
                        <div className="recommend_desc">{r.desc}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 섹션 3: 그래프 + ✅ Hover Tooltip */}
          <section className="sim_section">
            <div className="panel">
              <div className="panel__head">
                <h3 className="panel__title">점수 추세(가정)</h3>
                <div className="range_tabs">
                  {[1, 3, 6].map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`tab ${rangeMonths === m ? "is_on" : ""}`}
                      onClick={() => setRangeMonths(m)}
                    >
                      {m}개월
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="chart_wrap chart_interactive"
                ref={chartWrapRef}
                onMouseMove={onChartMove}
                onMouseEnter={onChartMove}
                onMouseLeave={onChartLeave}
              >
                <svg
                  className="chart_svg"
                  viewBox={`0 0 ${chart.w} ${chart.h}`}
                  preserveAspectRatio="none"
                  role="img"
                  aria-label="점수 추세 그래프"
                >
                  {chart.grid.map((y, idx) => (
                    <line
                      key={idx}
                      x1={chart.pad}
                      x2={chart.w - chart.pad}
                      y1={y}
                      y2={y}
                      className="chart_grid"
                    />
                  ))}

                  <path d={chart.curPath} className="chart_line chart_line__current" />
                  <path d={chart.impPath} className="chart_line chart_line__improved" />

                  {/* ✅ hover 세로 가이드 + 점 표시(개선 라인) */}
                  {hover.isOn && hover.curY != null && hover.impY != null && (
                    <>
                      {/* 가이드라인: DOM px 기준이 아니라 SVG 기준으로 찍어야 해서 monthIndex로 계산 */}
                      {(() => {
                        const { sx } = (() => {
                          const xMax = rangeMonths;
                          const sx = chart.pad + (hover.monthIndex / xMax) * (chart.w - chart.pad * 2);
                          return { sx };
                        })();

                        const pCur = getChartPointPx(hover.monthIndex, hover.curY);
                        const pImp = getChartPointPx(hover.monthIndex, hover.impY);

                        return (
                          <>
                            <line
                              x1={pImp.sx}
                              x2={pImp.sx}
                              y1={chart.pad}
                              y2={chart.h - chart.pad}
                              className="chart_hover_line"
                            />
                            <circle cx={pCur.sx} cy={pCur.sy} r="4" className="chart_dot chart_dot__current" />
                            <circle cx={pImp.sx} cy={pImp.sy} r="5" className="chart_dot chart_dot__improved" />
                          </>
                        );
                      })()}
                    </>
                  )}
                </svg>

                {/* ✅ Tooltip DOM */}
                {hover.isOn && hover.curY != null && hover.impY != null && (
                  <div
                    className="chart_tooltip"
                    style={{
                      left: `${hover.px}px`,
                      top: `${hover.py}px`,
                    }}
                  >
                    <div className="tt_head">{hover.monthIndex}개월</div>
                    <div className="tt_row">
                      <span className="tt_key">
                        <i className="legend_dot legend_dot__current" /> 현재
                      </span>
                      <b>{hover.curY}점</b>
                    </div>
                    <div className="tt_row">
                      <span className="tt_key">
                        <i className="legend_dot legend_dot__improved" /> 개선
                      </span>
                      <b>{hover.impY}점</b>
                    </div>
                    <div className="tt_row tt_delta">
                      변화 <b className={hover.impY - hover.curY >= 0 ? "plus" : "minus"}>
                        {formatDelta(hover.impY - hover.curY)}점
                      </b>
                    </div>
                  </div>
                )}

                <div className="chart_legend">
                  <span className="legend_item">
                    <i className="legend_dot legend_dot__current" /> 현재 유지
                  </span>
                  <span className="legend_item">
                    <i className="legend_dot legend_dot__improved" /> 개선 시나리오
                  </span>
                  <span className="legend_item legend_y">
                    범위: {series.yMin}~{series.yMax}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 섹션 4 */}
          <section className="sim_section">
            <div className="panel">
              <div className="panel__head">
                <h3 className="panel__title">영향도 분해(가정)</h3>
                <div className="panel__hint">가장 큰 하락 요인을 자동 강조</div>
              </div>

              <div className="breakdown">
                {breakdown.map((b) => {
                  const isWorst = b.key === worstKey;
                  const abs = Math.abs(b.value);
                  const width = clamp(abs * 2.0, 6, 100);
                  const signClass = b.value >= 0 ? "plus" : "minus";

                  return (
                    <div key={b.key} className={`break_row ${isWorst ? "is_worst" : ""}`}>
                      <div className="break_label">{b.label}</div>
                      <div className="break_bar">
                        <div className={`break_fill ${signClass}`} style={{ width: `${width}%` }} />
                      </div>
                      <div className={`break_value ${signClass}`}>{formatDelta(b.value)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 섹션 6 */}
          <section className="sim_section">
            <div className="panel">
              <div className="panel__head">
                <h3 className="panel__title">시나리오 저장 · 비교</h3>
                <div className="panel__actions">
                  <button type="button" className="btn_primary" onClick={saveScenario}>
                    현재 상태 저장
                  </button>
                  <button
                    type="button"
                    className="btn_ghost"
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        `${location.origin}${location.pathname}?score=${activeCalc.base.score}&improved=${activeCalc.improved}`
                      );
                    }}
                  >
                    링크 복사(데모)
                  </button>
                </div>
              </div>

              <div className="scenario_grid">
                <div className="scenario_left">
                  <div className="scenario_head">시나리오 목록</div>

                  <div className="scenario_item">
                    <label className={`scenario_radio ${selectedScenarioId === "live" ? "is_on" : ""}`}>
                      <input
                        type="radio"
                        name="scenario"
                        checked={selectedScenarioId === "live"}
                        onChange={() => setSelectedScenarioId("live")}
                      />
                      <div className="scenario_name">실시간 시뮬레이션</div>
                      <div className="scenario_meta">
                        {activeCalc.base.score}점 → {activeCalc.improved}점
                      </div>
                    </label>

                    <div className="scenario_compare">
                      <button type="button" className="btn_chip" onClick={() => pickCompare("A", "live")}>
                        A로
                      </button>
                      <button type="button" className="btn_chip" onClick={() => pickCompare("B", "live")}>
                        B로
                      </button>
                    </div>
                  </div>

                  {scenarios.length === 0 ? (
                    <div className="empty_note">아직 저장된 시나리오가 없습니다.</div>
                  ) : (
                    scenarios.map((s) => {
                      const base = calcScore(s.inputs).score;

                      let next = { ...s.inputs };
                      if (s.actions?.keepUtilUnder30) next.cardUtil = Math.min(next.cardUtil, 30);
                      if (s.actions?.avoidNewCredit) next.recentNewCredit = false;
                      if (s.actions?.enableAutopay) next.autopayTel = true;
                      const improved = calcScore(next).score;

                      return (
                        <div key={s.id} className="scenario_item">
                          <label className={`scenario_radio ${selectedScenarioId === s.id ? "is_on" : ""}`}>
                            <input
                              type="radio"
                              name="scenario"
                              checked={selectedScenarioId === s.id}
                              onChange={() => setSelectedScenarioId(s.id)}
                            />
                            <div className="scenario_name">{s.name}</div>
                            <div className="scenario_meta">
                              {base}점 → {improved}점
                            </div>
                          </label>

                          <div className="scenario_compare">
                            <button type="button" className="btn_chip" onClick={() => pickCompare("A", s.id)}>
                              A로
                            </button>
                            <button type="button" className="btn_chip" onClick={() => pickCompare("B", s.id)}>
                              B로
                            </button>
                            <button type="button" className="btn_chip danger" onClick={() => removeScenario(s.id)}>
                              삭제
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="scenario_right">
                  <div className="scenario_head">A/B 비교</div>

                  <div className="compare_box">
                    <div className="compare_col">
                      <div className="compare_title">A</div>
                      <div className="compare_name">{compareA?.name || "-"}</div>
                      {compareResult ? (
                        <>
                          <div className="compare_score">
                            <span>현재</span> <b>{compareResult.aBase}</b>
                          </div>
                          <div className="compare_score">
                            <span>개선</span> <b>{compareResult.aImproved}</b>
                          </div>
                        </>
                      ) : (
                        <div className="compare_hint">왼쪽에서 A 선택</div>
                      )}
                    </div>

                    <div className="compare_mid">VS</div>

                    <div className="compare_col">
                      <div className="compare_title">B</div>
                      <div className="compare_name">{compareB?.name || "-"}</div>
                      {compareResult ? (
                        <>
                          <div className="compare_score">
                            <span>현재</span> <b>{compareResult.bBase}</b>
                          </div>
                          <div className="compare_score">
                            <span>개선</span> <b>{compareResult.bImproved}</b>
                          </div>
                        </>
                      ) : (
                        <div className="compare_hint">왼쪽에서 B 선택</div>
                      )}
                    </div>
                  </div>

                  {compareResult && (
                    <div className="compare_summary">
                      <div className="compare_line">
                        현재 점수 차이: <b>{formatDelta(compareResult.aBase - compareResult.bBase)}</b>
                      </div>
                      <div className="compare_line">
                        개선 점수 차이: <b>{formatDelta(compareResult.aImproved - compareResult.bImproved)}</b>
                      </div>
                      <div className="compare_note">※ 비교는 동일 가정 모델 기반입니다.</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <div style={{ height: 8 }} />
        </div>
      </Inner>
    </Screen>
  );
};

export default ScreenMain;
