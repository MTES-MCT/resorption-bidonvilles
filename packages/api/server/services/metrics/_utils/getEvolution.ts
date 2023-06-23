export default (value: number, total: number): number => {
    const percentage = Math.round((value / total) * 100);
    return Number.isNaN(percentage) ? 0 : percentage;
};
