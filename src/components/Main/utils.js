export const clampValue = (value, minimum, maximum) => {
    return Math.min(maximum, Math.max(minimum, value));
};

export const roundValue = (value) => Math.round(value);

export const parseNumberSafely = (rawValue) => {
    const parsedValue = Number(
        String(rawValue ?? "")
            .replaceAll(",", "")
            .trim(),
    );
    return Number.isFinite(parsedValue) ? parsedValue : 0;
};

export const formatKoreanWon = (value) => {
    const sign = value < 0 ? "-" : "";
    const absoluteValue = Math.abs(roundValue(value));
    return `${sign}${absoluteValue.toLocaleString("ko-KR")}` + "원";
};

export const formatKoreanWonShort = (value) => {
    const sign = value < 0 ? "-" : "";
    const absoluteValue = Math.abs(roundValue(value));

    if (absoluteValue >= 100000000) return `${sign}${Math.round(absoluteValue / 100000000)}억`;
    if (absoluteValue >= 10000) return `${sign}${Math.round(absoluteValue / 10000)}만`;
    return `${sign}${absoluteValue.toLocaleString("ko-KR")}`;
};

export const slugifyKey = (value, fallback = "item") => {
    const base = String(value || "")
        .trim()
        .toLowerCase();
    if (!base) return fallback;
    return base.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || fallback;
};
