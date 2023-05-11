export default (from: Date, to: Date): number => (to.getMonth() - from.getMonth()) + ((to.getFullYear() - from.getFullYear()) * 12);
