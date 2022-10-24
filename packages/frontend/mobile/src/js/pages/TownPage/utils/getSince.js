export default function getSince(ts) {
    const now = new Date();
    const then = new Date(ts * 1000);

    now.setUTCHours(0, 0, 0, 0);
    then.setUTCHours(0, 0, 0, 0);

    const days = Math.floor(
        Math.abs(now.getTime() - then.getTime()) / (1000 * 3600 * 24)
    );

    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    return {
        days,
        weeks,
        months,
        years
    };
}
