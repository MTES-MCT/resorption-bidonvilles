module.exports = (town) => {
    if (!town.sanitaryNumber) {
        return null;
    }

    const sanitaryNumberPopulationRatio = Math.floor(
        Number(town.populationTotal)
            / Number(town.sanitaryNumber),
    );

    return sanitaryNumberPopulationRatio <= 20;
};
