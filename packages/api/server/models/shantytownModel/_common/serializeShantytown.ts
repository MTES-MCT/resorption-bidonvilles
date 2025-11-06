import permissionUtils from '#server/utils/permission';
import { Location } from '#server/models/geoModel/Location.d';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import { ShantytownRow } from './SQL';
import getAddressSimpleOf from './getAddressSimpleOf';
import getUsenameOf from './getUsenameOf';
import serializeLivingConditions from './livingConditions/serializeLivingConditions';

const { can } = permissionUtils;

function fromDateToTimestamp(date) {
    return date !== null ? (new Date(`${date}T00:00:00Z`).getTime() / 1000) : null;
}

export default (town: ShantytownRow, user): Shantytown => {
    let serializedTown: Shantytown = {
        type: 'shantytown',
        id: town.id,
        updatedWithoutAnyChange: town.updatedWithoutAnyChange,
        name: town.name,
        status: town.status,
        closingContext: town.closingContext,
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
        reinstallationIncomingTowns: [],
        closedAt: town.closedAt !== null ? (town.closedAt.getTime() / 1000) : null,
        address: town.address,
        addressDetails: town.addressDetails,
        addressSimple: getAddressSimpleOf(town.address),
        usename: getUsenameOf(town),
        populationTotal: town.populationTotal,
        populationTotalFemales: town.populationTotalFemales,
        populationCouples: town.populationCouples,
        populationMinors: town.populationMinors,
        populationMinorsGirls: town.populationMinorsGirls,
        populationMinors0To3: town.populationMinors0To3,
        populationMinors3To6: town.populationMinors3To6,
        populationMinors6To12: town.populationMinors6To12,
        populationMinors12To16: town.populationMinors12To16,
        populationMinors16To18: town.populationMinors16To18,
        minorsInSchool: town.minorsInSchool,
        caravans: town.caravans,
        huts: town.huts,
        tents: town.tents,
        cars: town.cars,
        mattresses: town.mattresses,
        livingConditions: serializeLivingConditions(town),
        censusStatus: town.censusStatus,
        censusConductedBy: town.censusConductedBy,
        censusConductedAt: fromDateToTimestamp(town.censusConductedAt),
        fieldType: {
            id: town.fieldTypeId,
            label: town.fieldTypeLabel,
        },
        socialOrigins: (town.socialOrigins || []).map((socialOrigin) => {
            const [id, uid, label] = socialOrigin.split('|');
            return {
                id: parseInt(id, 10),
                uid,
                label,
            };
        }),
        comments: [],
        actors: [],
        actions: [],
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
                name: town.createdByOrganizationName,
                abbreviation: town.createdByOrganizationAbbreviation,
            },
        },
        updatedBy: {
            id: town.updatedById,
            first_name: town.updatedByFirstName,
            last_name: town.updatedByLastName,
            position: town.updatedByPosition,
            organization: {
                id: town.updatedByOrganization,
                name: town.updatedByOrganizationName,
                abbreviation: town.updatedByOrganizationAbbreviation,
            },
        },
        heatwaveStatus: town.heatwaveStatus,
        resorptionTarget: town.resorptionTarget,
        completionRate: 0,
        preparatoryPhasesTowardResorption: [],
    };

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

    const location: Location = {
        type: 'city',
        city: serializedTown.city,
        epci: serializedTown.epci,
        departement: serializedTown.departement,
        region: serializedTown.region,
    };
    if (can(user).do('access', 'shantytown_justice').on(location)) {
        serializedTown = {
            ...serializedTown,
            ...{
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
                // procédures administratives
                existingLitigation: town.existingLitigation,
                evacuationUnderTimeLimit: town.evacuationUnderTimeLimit,
                administrativeOrderDecisionAt: fromDateToTimestamp(town.administrativeOrderDecisionAt),
                administrativeOrderDecisionRenderedBy: town.administrativeOrderDecisionRenderedBy,
                administrativeOrderEvacuationAt: fromDateToTimestamp(town.administrativeOrderEvacuationAt),
                insalubrityOrder: town.insalubrityOrder,
                insalubrityOrderDisplayed: town.insalubrityOrderDisplayed,
                insalubrityOrderType: town.insalubrityOrderType,
                insalubrityOrderBy: town.insalubrityOrderBy,
                insalubrityOrderAt: fromDateToTimestamp(town.insalubrityOrderAt),
                insalubrityParcels: town.insalubrityParcels,
                // fin procédures administratives
            },
        };
    }

    if (can(user).do('access', 'shantytown_owner').on(location)) {
        serializedTown = {
            ...serializedTown,
            ...{
                owner: town.owners,
            },
        };
    }

    return serializedTown;
};
