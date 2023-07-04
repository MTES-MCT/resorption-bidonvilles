export default (initialValue: number, finalValue: number): number => {
    const percentage = Math.round(((finalValue - initialValue) / finalValue) * 100);
    return Number.isNaN(percentage) ? 0 : percentage;
};
