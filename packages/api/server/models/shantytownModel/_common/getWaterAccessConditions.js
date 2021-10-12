const getWaterHandWashAccessPopulationRatio = require('./getWaterHandWashAccessPopulationRatio');


/**
 * Computes the waterAccessConditions field of the given shantytown
 * @param {Object} shantytown
 *
 * @returns {string || null}
 */
module.exports = (shantytown) => {
    if (shantytown.accessToWater) {
        const waterHandWashAccessPopulationRatio = getWaterHandWashAccessPopulationRatio(shantytown.populationTotal, shantytown.waterHandWashAccessNumber);
        if (
            !shantytown.waterPotable
            || !shantytown.waterContinuousAccess
            || !shantytown.waterPublicPoint
            || !shantytown.waterDistance
            || shantytown.waterDistance !== '0-20'
            || shantytown.waterRoadsToCross === null
            || shantytown.waterRoadsToCross
            || !shantytown.waterEveryoneHasAccess
            || shantytown.waterStagnantWater === null
            || shantytown.waterStagnantWater
            || !shantytown.waterHandWashAccess
            || waterHandWashAccessPopulationRatio > 20
        ) {
            return 'toImprove';
        }
        return 'true';
    }
    return shantytown.accessToWater === false ? 'false' : null;
};
