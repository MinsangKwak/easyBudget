import { formatKoreanWonShort } from "../utils";

const DonutChart = ({
    segments = [],
    centerTopLabel,
    centerValue,
    centerBottomLabel,
    animationTime,
    isPaused,
    isMasked,
}) => {
    const safeSegments = (Array.isArray(segments) ? segments : []).filter(Boolean);

    const size = 210;
    const strokeWidth = 18;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const totalValue = Math.max(
        1,
        safeSegments.reduce(
            (accumulator, segment) => accumulator + Math.max(0, Number(segment?.value) || 0),
            0,
        ),
    );

    const startAt = -90;
    const pulse = isPaused ? 0 : 0.5 + 0.5 * Math.sin(animationTime * 2.0);
    const ringOpacity = 0.18 + pulse * 0.12;

    let cumulative = 0;

    return (
        <div className="donut" style={{ width: `${size}px`, height: `${size}px` }}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                role="img"
                aria-label="도넛 그래프"
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    className="donut_bg"
                    strokeWidth={strokeWidth}
                    style={{ opacity: ringOpacity }}
                />

                {safeSegments.map((segment, index) => {
                    const safeValue = Math.max(0, Number(segment?.value) || 0);
                    const ratio = safeValue / totalValue;

                    const segmentLength = ratio * circumference;
                    const dashArray = `${segmentLength} ${circumference - segmentLength}`;
                    const dashOffset = circumference * (1 - cumulative);

                    cumulative += ratio;
                    const tone = segment?.tone || "iris";
                    const key = segment?.key ?? `segment-${index}`;

                    return (
                        <circle
                            key={key}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            className={`donut_seg tone_${tone}`}
                            strokeWidth={strokeWidth}
                            strokeDasharray={dashArray}
                            strokeDashoffset={dashOffset}
                            transform={`rotate(${startAt} ${size / 2} ${size / 2})`}
                        />
                    );
                })}
            </svg>

            <div className="donut_center">
                <div className="donut_top muted">{centerTopLabel}</div>
                <div className="donut_value">
                    {isMasked ? "??" : formatKoreanWonShort(centerValue)}
                </div>
                <div className="donut_bottom muted">{centerBottomLabel}</div>
            </div>
        </div>
    );
};

export default DonutChart;
