const getWaterHandWashAccessPopulationRatio = require('./getWaterHandWashAccessPopulationRatio');


/**
 * Computes the waterAccessConditions field of the given shantytown
 * @param {Object} shantytown
 *
 * @returns {string || null}
 */
module.exports = (shantytown) => {
    const { water } = shantytown.livingConditions;
    if (water.access) {
        const handWashAccessPopulationRatio = getWaterHandWashAccessPopulationRatio(
            shantytown.populationTotal,
            water.handWashAccessNumber,
        );

        if (
            !water.potable
            || !water.continuousAccess
            || !water.distance
            || water.distance !== '0-20'
            || water.roadsToCross === null
            || water.roadsToCross
            || !water.everyoneHasAccess
            || water.stagnantWater === null
            || water.stagnantWater
            || !water.handWashAccess
            || handWashAccessPopulationRatio > 20
        ) {
            return 'toImprove';
        }

        return 'true';
    }

    return water.access === false ? 'false' : null;
};
