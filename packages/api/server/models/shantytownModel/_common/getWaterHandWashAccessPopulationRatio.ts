export default (populationTotal, waterHandWashAccessNumber) => (populationTotal && waterHandWashAccessNumber ? Math.floor(Number(populationTotal) / Number(waterHandWashAccessNumber)) : null);
