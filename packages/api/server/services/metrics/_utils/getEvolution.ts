export default (initialValue: number, finalValue: number): number => {
    if (initialValue === 0) return 0;
    const percentage = Math.round(((finalValue - initialValue) / initialValue) * 100);
    return Number.isNaN(percentage) ? 0 : percentage;
};
