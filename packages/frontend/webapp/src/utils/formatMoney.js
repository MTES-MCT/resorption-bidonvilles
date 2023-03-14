const formatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "symbol",
});

export default (number) => {
    return formatter.format(number);
};
