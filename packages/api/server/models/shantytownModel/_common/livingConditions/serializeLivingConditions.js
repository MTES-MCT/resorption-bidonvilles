const getLivingConditionsStatuses = require('./getLivingConditionsStatuses');

module.exports = (town) => {
    const livingConditions = {
        version: town.livingConditionsVersion,
        electricity: {
            status: null,
            type: {
                id: town.electricityTypeId,
                label: town.electricityTypeLabel,
            },
            comments: town.electricityComments,
        },
        water: {
            status: null,
            access: town.accessToWater,
            comments: town.waterComments,
            potable: town.waterPotable,
            continuousAccess: town.waterContinuousAccess,
            publicPoint: town.waterPublicPoint,
            distance: town.waterDistance,
            roadsToCross: town.waterRoadsToCross,
            everyoneHasAccess: town.waterEveryoneHasAccess,
            stagnantWater: town.waterStagnantWater,
            handWashAccess: town.waterHandWashAccess,
            handWashAccessNumber: town.waterHandWashAccessNumber,
        },
        trash: {
            status: null,
            evacuation: town.trashEvacuation,
            cansOnSite: town.trashCansOnSite,
            accumulation: town.trashAccumulation,
            evacuationRegular: town.trashEvacuationRegular,
        },
        sanitary: {
            status: null,
            access: town.accessToSanitary,
            comments: town.sanitaryComments,
            number: town.sanitaryNumber,
            insalubrious: town.sanitaryInsalubrious,
            onSite: town.sanitaryOnSite,
        },
        vermin: {
            status: null,
            vermin: town.vermin,
            comments: town.verminComments,
        },
        firePrevention: {
            status: null,
            measures: town.firePreventionMeasures,
            diagnostic: town.firePreventionDiagnostic,
            siteAccessible: town.firePreventionSiteAccessible,
            devices: town.firePreventionDevices,
            comments: town.firePreventionComments,
        },
    };

    const statuses = getLivingConditionsStatuses(town);
    Object.keys(statuses).forEach((key) => {
        livingConditions[key].status = statuses[key];
    });

    return livingConditions;
};
