const { can } = require('#server/utils/permission');
const getAddressSimpleOf = require('./getAddressSimpleOf');
const getUsenameOf = require('./getUsenameOf');
const getWaterAccessConditions = require('./getWaterAccessConditions');

function fromDateToTimestamp(date) {
    return date !== null ? (new Date(`${date}T00:00:00`).getTime() / 1000) : null;
}

module.exports = (town, user) => {
    const serializedTown = {
        type: 'shantytown',
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
        isReinstallation: town.isReinstallation,
        reinstallationComments: town.reinstallationComments,
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
        caravans: town.caravans,
        huts: town.huts,
        livingConditions: {
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
        },
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
        resorptionTarget: town.resorptionTarget,
    };

    serializedTown.livingConditions.water.status = getWaterAccessConditions(serializedTown);

    // generé par findNearby
    if (town.distance !== undefined) {
        serializedTown.distance = town.distance;
    }

    let completionTotal = 0;
    if (serializedTown.addressSimple !== 'Pas d\'adresse précise') {
        completionTotal += 1;
    }
    if (town.fieldTypeLabel !== 'Inconnu') {
        completionTotal += 1;
    }
    if (town.ownerTypeLabel !== 'Inconnu') {
        completionTotal += 1;
    }
    if (town.censusStatus !== null) {
        completionTotal += 1;
    }
    if (town.populationTotal !== null) {
        completionTotal += 1;
    }
    if (town.populationCouples !== null) {
        completionTotal += 1;
    }
    if (town.populationMinors !== null) {
        completionTotal += 1;
    }
    if (serializedTown.socialOrigins.length > 0) {
        completionTotal += 1;
    }

    serializedTown.completionRate = Math.floor((completionTotal / 12) * 100) / 100;

    const location = {
        type: 'city',
        city: serializedTown.city,
        epci: serializedTown.epci,
        departement: serializedTown.departement,
        region: serializedTown.region,
    };
    if (can(user).do('access', 'shantytown_justice').on(location)) {
        Object.assign(serializedTown, {
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
        });
    }

    if (can(user).do('access', 'shantytown_owner').on(location)) {
        Object.assign(serializedTown, {
            owner: town.owner,
        });
    }

    return serializedTown;
};
