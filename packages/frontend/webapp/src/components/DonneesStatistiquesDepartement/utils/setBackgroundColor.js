export default function setBackgroundColor(context, bgColor) {
    if (!context.chart.chartArea) {
        return;
    }
    const {
        ctx,
        chartArea: { top, bottom },
    } = context.chart;
    const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
    gradientBg.addColorStop(0, bgColor[0]);
    gradientBg.addColorStop(1, bgColor[1]);
    return gradientBg;
}
