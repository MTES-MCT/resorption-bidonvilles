const getAddressSimpleOf = require('./getAddressSimpleOf');
const getUsenameOf = require('./getUsenameOf');
const getWaterAccessConditions = require('./getWaterAccessConditions');
const getWaterHandWashAccessPopulationRatio = require('./getWaterHandWashAccessPopulationRatio');

function fromDateToTimestamp(date) {
    return date !== null ? (new Date(`${date}T00:00:00`).getTime() / 1000) : null;
}

module.exports = (town, permission) => {
    const serializedTown = {
        id: town.id,
        name: town.name,
        status: town.status,
        latitude: town.latitude,
        longitude: town.longitude,
        city: {
            code: town.cityCode,
            name: town.cityName,
            main: town.cityMain,
            latitude: town.cityLatitude,
            longitude: town.cityLongitude,
        },
        epci: {
            code: town.epciCode,
            name: town.epciName,
        },
        departement: {
            code: town.departementCode,
            name: town.departementName,
            latitude: town.departementLatitude,
            longitude: town.departementLongitude,
            chieftown: {
                code: town.departementChiefTownCode,
                name: town.departementChiefTownName,
                latitude: town.departementChiefTownLatitude,
                longitude: town.departementChiefTownLongitude,
            },
        },
        region: {
            code: town.regionCode,
            name: town.regionName,
            latitude: town.regionLatitude,
            longitude: town.regionLongitude,
            chieftown: {
                code: town.regionChiefTownCode,
                name: town.regionChiefTownName,
                latitude: town.regionChiefTownLatitude,
                longitude: town.regionChiefTownLongitude,
            },
        },
        declaredAt: fromDateToTimestamp(town.declaredAt),
        builtAt: fromDateToTimestamp(town.builtAt),
        closedAt: town.closedAt !== null ? (town.closedAt.getTime() / 1000) : null,
        address: town.address,
        addressDetails: town.addressDetails,
        addressSimple: getAddressSimpleOf(town),
        usename: getUsenameOf(town),
        populationTotal: town.populationTotal,
        populationCouples: town.populationCouples,
        populationMinors: town.populationMinors,
        populationMinors0To3: town.populationMinors0To3,
        populationMinors3To6: town.populationMinors3To6,
        populationMinors6To12: town.populationMinors6To12,
        populationMinors12To16: town.populationMinors12To16,
        populationMinors16To18: town.populationMinors16To18,
        minorsInSchool: town.minorsInSchool,
        electricityType: {
            id: town.electricityTypeId,
            label: town.electricityTypeLabel,
        },
        electricityComments: town.electricityComments,
        accessToSanitary: town.accessToSanitary,
        sanitaryComments: town.sanitaryComments,
        accessToWater: town.accessToWater,
        waterAccessConditions: getWaterAccessConditions(town),
        waterHandWashAccessPopulationRatio: getWaterHandWashAccessPopulationRatio(town.populationTotal, town.waterHandWashAccessNumber),
        waterComments: town.waterComments,
        trashEvacuation: town.trashEvacuation,
        owner: town.owner,
        censusStatus: town.censusStatus,
        censusConductedBy: town.censusConductedBy,
        censusConductedAt: fromDateToTimestamp(town.censusConductedAt),
        fieldType: {
            id: town.fieldTypeId,
            label: town.fieldTypeLabel,
        },
        ownerType: {
            id: town.ownerTypeId,
            label: town.ownerTypeLabel,
        },
        socialOrigins: (town.socialOrigins || []).map((socialOrigin) => {
            const [id, label] = socialOrigin.split('|');
            return {
                id: parseInt(id, 10),
                label,
            };
        }),
        comments: {
            regular: [],
            covid: [],
        },
        actors: [],
        plans: [],
        closingSolutions: [],
        closedWithSolutions: town.closedWithSolutions,
        changelog: [],
        createdAt: town.createdAt.getTime() / 1000,
        updatedAt: town.updatedAt !== null ? (town.updatedAt.getTime() / 1000) : null,
        createdBy: {
            id: town.createdById,
            first_name: town.createdByFirstName,
            last_name: town.createdByLastName,
            position: town.createdByPosition,
            organization: {
                id: town.createdByOrganization,
            },
        },
        updatedBy: {
            id: town.updatedById,
            first_name: town.updatedByFirstName,
            last_name: town.updatedByLastName,
            position: town.updatedByPosition,
            organization: {
                id: town.updatedByOrganization,
            },
        },
        waterPotable: town.waterPotable,
        waterContinuousAccess: town.waterContinuousAccess,
        waterPublicPoint: town.waterPublicPoint,
        waterDistance: town.waterDistance,
        waterRoadsToCross: town.waterRoadsToCross,
        waterEveryoneHasAccess: town.waterEveryoneHasAccess,
        waterStagnantWater: town.waterStagnantWater,
        waterHandWashAccess: town.waterHandWashAccess,
        waterHandWashAccessNumber: town.waterHandWashAccessNumber,
        sanitaryNumber: town.sanitaryNumber,
        sanitaryInsalubrious: town.sanitaryInsalubrious,
        sanitaryOnSite: town.sanitaryOnSite,
        trashCansOnSite: town.trashCansOnSite,
        trashAccumulation: town.trashAccumulation,
        trashEvacuationRegular: town.trashEvacuationRegular,
        vermin: town.vermin,
        verminComments: town.verminComments,
        firePreventionMeasures: town.firePreventionMeasures,
        firePreventionDiagnostic: town.firePreventionDiagnostic,
        firePreventionSiteAccessible: town.firePreventionSiteAccessible,
        firePreventionDevices: town.firePreventionDevices,
        firePreventionComments: town.firePreventionComments,
        resorptionTarget: town.resorptionTarget,
    };

    // @todo: alter all dates to a datetime so it can be easily serialized (just like closed_at)
    const restrictedData = {
        data_justice: {
            ownerComplaint: town.ownerComplaint,
            justiceProcedure: town.justiceProcedure,
            justiceRendered: town.justiceRendered,
            justiceRenderedAt: fromDateToTimestamp(town.justiceRenderedAt),
            justiceRenderedBy: town.justiceRenderedBy,
            justiceChallenged: town.justiceChallenged,
            policeStatus: town.policeStatus,
            policeRequestedAt: fromDateToTimestamp(town.policeRequestedAt),
            policeGrantedAt: fromDateToTimestamp(town.policeGrantedAt),
            bailiff: town.bailiff,
        },
    };

    Object.keys(restrictedData)
        .filter(dataPermission => permission[dataPermission] === true)
        .forEach((dataPermission) => {
            Object.assign(serializedTown, restrictedData[dataPermission]);
        });

    return serializedTown;
};
