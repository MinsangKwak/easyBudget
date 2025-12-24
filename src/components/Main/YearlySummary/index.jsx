import "./index.css";

import { formatKoreanWon } from "../utils";

const YearlySummary = ({ summary }) => {
  if (!summary) return null;

  const maxValue = Math.max(summary.income, summary.spend, 1);
  const barData = [
    { key: "income", label: "총 수입", value: summary.income },
    { key: "spend", label: "총 지출", value: summary.spend },
  ];

  return (
    <section className="card yearly_summary" aria-label="연간 요약">
      <div className="card_head">
        <div className="card_title">{summary.yearLabel} 전체 요약</div>
      </div>

      <div className="yearly_rows">
        {barData.map((item) => (
          <div key={item.key} className="yearly_row">
            <div className="yearly_row__head">
              <span>{item.label}</span>
              <span>{formatKoreanWon(item.value)}</span>
            </div>
            <div className="yearly_row__bar" role="presentation">
              <div
                className="yearly_row__fill"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default YearlySummary;
