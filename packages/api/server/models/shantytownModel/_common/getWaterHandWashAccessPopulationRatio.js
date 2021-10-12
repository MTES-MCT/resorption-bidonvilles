module.exports = (populationTotal, waterHandWashAccessNumber) => (populationTotal && waterHandWashAccessNumber ? Math.floor(Number(populationTotal) / Number(waterHandWashAccessNumber)) : null);
