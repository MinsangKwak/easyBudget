import { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";
import Screen from "../../Layout/Screen";
import Inner from "../../Content/Inner";
import SampleBg from "../../../assets/background/sample_bg.png";

/* utils */
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const round = (v) => Math.round(v);
const formatDelta = (n) => `${n > 0 ? "+" : ""}${n}`;

/** UX 데모용: 점수 라벨 */
function scoreLabel(score) {
  if (score >= 870) return { text: "최우수", tone: "good" };
  if (score >= 800) return { text: "우수", tone: "good" };
  if (score >= 740) return { text: "양호", tone: "mid" };
  if (score >= 650) return { text: "보통", tone: "mid" };
  return { text: "주의", tone: "bad" };
}

/** UX 데모용: 간단 모델(카드 사용률 + 최근 신규) */
function calcScoreLite({ cardUtil, recentNewCredit }) {
  const base = 780;

  const utilPenalty =
    cardUtil <= 30 ? -4 : cardUtil <= 50 ? -14 : cardUtil <= 70 ? -28 : -42;

  const newCreditPenalty = recentNewCredit ? -16 : 0;

  const score = clamp(base + utilPenalty + newCreditPenalty, 350, 950);
  return { score: round(score) };
}

/** “대출 이율” 데모용 맵핑: 점수↑ → 이율↓ (3%~15%) */
function estimateRateByScore(score) {
  const minS = 350;
  const maxS = 950;
  const minR = 3;
  const maxR = 15;
  const t = clamp((score - minS) / (maxS - minS), 0, 1);
  const rate = maxR - t * (maxR - minR);
  return Math.round(rate * 10) / 10; // 0.1% 단위
}

/** 그래프 */
function buildSeriesLite({ months, currentScore, improvedScore }) {
  const n = months;
  const start = clamp(currentScore - 35, 350, 950);

  const current = [];
  const improved = [];

  for (let i = 0; i <= n; i++) {
    const t = i / n;

    const cur = start + (currentScore - start) * (0.2 + 0.8 * t);

    const ease = t < 0.4 ? t * 0.75 : 0.3 + (t - 0.4) * 1.166;
    const imp = start + (improvedScore - start) * clamp(ease, 0, 1);

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

const ScreenMain = () => {
  const sectionRef = useRef(null);

  /** 핵심 입력 2개 */
  const [inputs, setInputs] = useState({
    cardUtil: 42,
    recentNewCredit: true,
  });

  /** 핵심 “딱 2가지” 행동 */
  const [actions, setActions] = useState({
    keepUtilUnder30: true,
    avoidNewCredit: true,
  });

  /** 시작 상태(인트로 버튼 누르기 전/후) */
  const [started, setStarted] = useState(false);

  /** 예시 프리셋 */
  const PRESETS = useMemo(
    () => ({
      sample: {
        inputs: { cardUtil: 78, recentNewCredit: true },
        actions: { keepUtilUnder30: true, avoidNewCredit: true },
      },
      simple: {
        inputs: { cardUtil: 42, recentNewCredit: true },
        actions: { keepUtilUnder30: true, avoidNewCredit: true },
      },
    }),
    []
  );

  const applyPresetAndGo = (key) => {
    const p = PRESETS[key];
    if (!p) return;
    setInputs(p.inputs);
    setActions(p.actions);
    setStarted(true);

    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  /** 점수 계산 */
  const calc = useMemo(() => {
    const base = calcScoreLite(inputs);

    let next = { ...inputs };
    if (actions.keepUtilUnder30) next.cardUtil = Math.min(next.cardUtil, 30);
    if (actions.avoidNewCredit) next.recentNewCredit = false;
    const improved = calcScoreLite(next);

    const baseRate = estimateRateByScore(base.score);
    const improvedRate = estimateRateByScore(improved.score);

    return { base, improved, baseRate, improvedRate };
  }, [inputs, actions]);

  const deltaScore = calc.improved.score - calc.base.score;
  const deltaRate = calc.improvedRate - calc.baseRate; // 내려가면 음수

  /** hero count-up */
  const [displayScore, setDisplayScore] = useState(calc.base.score);
  const rafRef = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    const from = displayScore;
    const to = calc.base.score;
    const start = performance.now();
    const dur = 380;

    const tick = (now) => {
      const t = clamp((now - start) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(round(from + (to - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calc.base.score]);

  const grade = scoreLabel(displayScore);

  /** hero 그래프(오른쪽) */
  const months = 6;
  const series = useMemo(() => {
    const { current, improved } = buildSeriesLite({
      months,
      currentScore: calc.base.score,
      improvedScore: calc.improved.score,
    });

    const allY = [...current, ...improved].map((p) => p.y);
    const yMin = clamp(Math.min(...allY) - 20, 350, 950);
    const yMax = clamp(Math.max(...allY) + 20, 350, 950);

    return { current, improved, yMin, yMax };
  }, [calc.base.score, calc.improved.score]);

  const chart = useMemo(() => {
    const w = 820;
    const h = 220;
    const pad = 18;
    const curPath = svgPathFromSeries(series.current, w, h, pad, series.yMin, series.yMax);
    const impPath = svgPathFromSeries(series.improved, w, h, pad, series.yMin, series.yMax);

    const grid = [];
    for (let i = 0; i <= 4; i++) grid.push(pad + (i / 4) * (h - pad * 2));
    return { w, h, pad, curPath, impPath, grid };
  }, [series]);

  return (
    <Screen>
      <Inner>
        <div className="page" style={{ backgroundImage: `url(${SampleBg})` }}>
          {/* ===== Intro Hero (질문 + 버튼 + 오른쪽 그래프) ===== */}
          <section className="hero">
            <div className="hero_left">
              <p className="hero_kicker">신용점수 미리보기</p>

              <h1 className="hero_title">
                당신의 신용점수는 <br />
                <span className="hero_em">몇 점</span>인가요?
              </h1>

              <p className="hero_desc">
                신용점수는 어렵게 계산하기보다, <b>“바뀌는 이유”</b>를 먼저 이해하는 게 쉽습니다.
                <br />
                아래 버튼으로 예시부터 시작해보세요.
              </p>

              <div className="hero_cta">
                <button type="button" className="btn_primary" onClick={() => applyPresetAndGo("sample")}>
                  예시로 시작하기
                </button>
                <button type="button" className="btn_ghost" onClick={() => applyPresetAndGo("simple")}>
                  간단하게 시작하기
                </button>
              </div>

              <div className="hero_note">
                * 실제 신용평가/금융자문이 아닌, UX 데모용 가정 모델입니다.
              </div>
            </div>

            <div className="hero_right">
              <div className={`score tone_${grade.tone}`}>
                <div className="score_top">
                  <span className="badge">{grade.text}</span>
                  <span className="tag">{started ? "LIVE" : "PREVIEW"}</span>
                </div>

                <div className="score_value">
                  <span className="score_num">{displayScore}</span>
                  <span className="score_unit">점</span>
                </div>

                <div className="score_meta">
                  <div className="meta_row">
                    <span>두 가지 행동 반영 시</span>
                    <b className={deltaScore >= 0 ? "plus" : "minus"}>{formatDelta(deltaScore)}점</b>
                  </div>
                  <div className="meta_row">
                    <span>예상 대출 이율</span>
                    <b className={deltaRate <= 0 ? "plus" : "minus"}>
                      {calc.baseRate}% → {calc.improvedRate}%
                    </b>
                  </div>
                </div>
              </div>

              <div className="chart_card">
                <div className="chart_head">
                  <b>6개월 변화(가정)</b>
                  <span>유지 vs 행동 반영</span>
                </div>

                <svg
                  className="chart"
                  viewBox={`0 0 ${chart.w} ${chart.h}`}
                  preserveAspectRatio="none"
                  role="img"
                  aria-label="점수 변화 그래프"
                >
                  {chart.grid.map((y, idx) => (
                    <line
                      key={idx}
                      x1={chart.pad}
                      x2={chart.w - chart.pad}
                      y1={y}
                      y2={y}
                      className="grid"
                    />
                  ))}

                  <path d={chart.curPath} className="line current" />
                  <path d={chart.impPath} className="line improved" />
                </svg>

                <div className="legend">
                  <span className="legend_item">
                    <i className="dot current" /> 지금처럼 유지
                  </span>
                  <span className="legend_item">
                    <i className="dot improved" /> 두 가지 행동 반영
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ===== Section: 딱 2가지만 ===== */}
          <section className="section" ref={sectionRef}>
            <div className="section_head">
              <h2>딱 두 가지만 바꾸면, 신용도가 이렇게 바뀝니다</h2>
              <p>아래 2가지만 조절하면 점수와 이율이 바로 업데이트됩니다.</p>
            </div>

            <div className="grid_2">
              <div className="card">
                <div className="card_title">1) 카드 사용률</div>
                <div className="row_between">
                  <span className="muted">현재</span>
                  <b>{inputs.cardUtil}%</b>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={inputs.cardUtil}
                  onChange={(e) => setInputs((p) => ({ ...p, cardUtil: Number(e.target.value) }))}
                />
                <div className="hint">가정: 30% 이하가 유리</div>

                <label className={`check ${actions.keepUtilUnder30 ? "on" : ""}`}>
                  <input
                    type="checkbox"
                    checked={actions.keepUtilUnder30}
                    onChange={(e) => setActions((p) => ({ ...p, keepUtilUnder30: e.target.checked }))}
                  />
                  <span>30% 이하로 제한하기</span>
                </label>
              </div>

              <div className="card">
                <div className="card_title">2) 최근 신규(카드/대출)</div>
                <div className="row_between">
                  <span className="muted">현재</span>
                  <b>{inputs.recentNewCredit ? "있음" : "없음"}</b>
                </div>

                <label className={`toggle ${inputs.recentNewCredit ? "on" : ""}`}>
                  <input
                    type="checkbox"
                    checked={inputs.recentNewCredit}
                    onChange={(e) => setInputs((p) => ({ ...p, recentNewCredit: e.target.checked }))}
                  />
                  <span className="toggle_ui" />
                  <span className="toggle_txt">{inputs.recentNewCredit ? "있음" : "없음"}</span>
                </label>

                <div className="hint">가정: 단기 신규는 불리</div>

                <label className={`check ${actions.avoidNewCredit ? "on" : ""}`}>
                  <input
                    type="checkbox"
                    checked={actions.avoidNewCredit}
                    onChange={(e) => setActions((p) => ({ ...p, avoidNewCredit: e.target.checked }))}
                  />
                  <span>신규 피하기(가정 제거)</span>
                </label>
              </div>
            </div>

            <div className="result_bar">
              <div className="result_item">
                <span className="muted">현재 점수</span>
                <b>{calc.base.score}점</b>
              </div>
              <div className="result_item">
                <span className="muted">행동 반영</span>
                <b>{calc.improved.score}점</b>
              </div>
              <div className="result_item">
                <span className="muted">변화</span>
                <b className={deltaScore >= 0 ? "plus" : "minus"}>{formatDelta(deltaScore)}점</b>
              </div>
            </div>
          </section>

          {/* ===== Section: 이율도 내려간다 ===== */}
          <section className="section">
            <div className="section_head">
              <h2>이걸 하면, 대출상품 이율도 이렇게 내려갑니다</h2>
              <p>실제 산정 방식이 아닌 “이해를 돕는” 데모용 추정치입니다.</p>
            </div>

            <div className="rate_card">
              <div className="rate_left">
                <div className="rate_label">예상 금리(가정)</div>
                <div className="rate_value">
                  <span className="rate_big">{calc.baseRate}%</span>
                  <span className="rate_arrow">→</span>
                  <span className="rate_big">{calc.improvedRate}%</span>
                </div>
                <div className="rate_delta">
                  변화{" "}
                  <b className={deltaRate <= 0 ? "plus" : "minus"}>
                    {deltaRate <= 0 ? "" : "+"}
                    {deltaRate.toFixed(1)}%p
                  </b>
                </div>
              </div>

              <div className="rate_right">
                <div className="pill">
                  점수 {calc.base.score} → {calc.improved.score}
                </div>
                <div className="muted">
                  핵심은 “정확한 수치”가 아니라, <b>행동이 금리에도 영향을 줄 수 있다</b>는 구조를 이해하는 것입니다.
                </div>
              </div>
            </div>
          </section>

          {/* ===== Section: 메시지 ===== */}
          <section className="section">
            <div className="quote">
              <h3>점수는 숫자가 아니라, 행동의 결과</h3>
              <p>
                점수를 맞히는 것보다, <b>“어떤 행동이 왜 유리/불리한지”</b>를 이해하면 다음 선택이 쉬워집니다.
              </p>
              <p className="muted">
                그래서 이 서비스는 “입력 항목을 늘리는 것” 대신, “바뀌는 이유를 빨리 보여주는 것”에 집중했습니다.
              </p>
            </div>
          </section>
        </div>
      </Inner>
    </Screen>
  );
};

export default ScreenMain;
