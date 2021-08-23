export default function getSince(ts) {
    const now = new Date();
    const then = new Date(ts * 1000);

    const days = Math.abs(
        (now.getFullYear() - then.getFullYear()) * 365 +
            (now.getFullYear() - then.getFullYear()) * (365 / 12) +
            (now.getDate() - then.getDate())
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
