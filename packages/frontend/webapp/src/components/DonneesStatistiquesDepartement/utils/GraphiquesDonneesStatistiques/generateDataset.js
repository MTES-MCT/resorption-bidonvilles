function setBackgroundColor(context, bgColor, start = 1) {
    if (!context.chart.chartArea) {
        return;
    }

    const {
        ctx,
        chartArea: { top, bottom },
    } = context.chart;

    const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
    if (start < 1) {
        gradientBg.addColorStop(1, "rgba(255, 255, 255, 0)");
        gradientBg.addColorStop(1 - start - 0.01, "rgba(255, 255, 255, 0)");
    }
    gradientBg.addColorStop(1 - start, bgColor);
    gradientBg.addColorStop(
        Math.min(1, 1 - start + 0.7),
        "rgba(255, 255, 255, 0)"
    );
    return gradientBg;
}

export default function generateDataset(label, color, data, maxGlobal) {
    return {
        label,
        backgroundColor: (context) => {
            return setBackgroundColor(
                context,
                color,
                Math.max(...data) / maxGlobal
            );
        },
        borderColor: color,
        pointRadius: 2,
        borderWidth: 2,
        fill: true,
        data,
        tension: 0.5,
    };
}
