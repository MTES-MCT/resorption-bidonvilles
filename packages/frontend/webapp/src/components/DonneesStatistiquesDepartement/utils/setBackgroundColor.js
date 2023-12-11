export default function setBackgroundColor(context, bgColor, start = 1) {
    if (!context.chart.chartArea) {
        return;
    }

    const {
        ctx,
        chartArea: { top, bottom },
    } = context.chart;

    const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
    if (start < 1) {
        gradientBg.addColorStop(1, "transparent");
        gradientBg.addColorStop(1 - start - 0.01, "transparent");
    }
    gradientBg.addColorStop(1 - start, bgColor);
    gradientBg.addColorStop(Math.min(1, 1 - start + 0.4), "transparent");
    return gradientBg;
}
