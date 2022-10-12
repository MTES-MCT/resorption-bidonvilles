module.exports = (town) => {
    const waterHandWashAccessPopulationRatio = town.populationTotal && town.waterHandWashAccessNumber
        ? Math.floor(
            Number(town.populationTotal)
                      / Number(town.waterHandWashAccessNumber),
        )
        : null;

    if (town.waterHandWashAccess === null) {
        return null;
    }

    if (town.waterHandWashAccess === false || !waterHandWashAccessPopulationRatio) {
        return false;
    }

    return waterHandWashAccessPopulationRatio <= 20;
};
