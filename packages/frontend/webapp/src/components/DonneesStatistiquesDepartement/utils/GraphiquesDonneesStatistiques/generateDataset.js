function setBackgroundColor(context, bgColor, start = 1) {
    if (!context.chart?.chartArea) {
        return;
    }

    const {
        ctx,
        chartArea: { top, bottom },
    } = context.chart;

    const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
    gradientBg.addColorStop(Math.max(0, 1 - start - 0.01), bgColor);
    gradientBg.addColorStop(1, "rgba(255, 255, 255, 0)");
    return gradientBg;
}

export default function generateDataset(label, color, data, maxGlobal) {
    return {
        label,
        backgroundColor: (context) => {
            return setBackgroundColor(
                context,
                color,
                maxGlobal > 0 ? Math.max(...data) / maxGlobal : 0
            );
        },
        // strokeColor: "#ff6c23",
        borderColor: color,
        pointRadius: 2,
        borderWidth: 2,
        fill: true,
        data,
        tension: 0.5,
    };
}
