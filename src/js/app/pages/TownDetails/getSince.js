export default function getSince(ts) {
    const now = new Date();
    const then = new Date(ts * 1000);

    let months = 0;
    if (now.getFullYear() === then.getFullYear()) {
        months = Math.max(0, now.getMonth() - then.getMonth());
    } else if (now.getFullYear() > then.getFullYear()) {
        const diff = now.getFullYear() - then.getFullYear();
        months = (diff - 1) * 12 + (now.getMonth() + 12 - then.getMonth());
    }

    return {
        years: Math.floor(months / 12),
        months: months % 12
    };
}
