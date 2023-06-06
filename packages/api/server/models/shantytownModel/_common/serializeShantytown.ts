import permissionUtils from '#server/utils/permission';
import ShantytownComment from '#server/models/shantytownCommentModel/ShantytownComment.d';
import { Actor } from '#server/models/shantytownActorModel/serializeActor';
import { ShantytownAction } from '#server/models/actionModel/fetch/Action.d';
import { IncomingTown } from '#server/models/incomingTownsModel/findAll';
import { ShantytownRow } from './SQL';
import { Diff } from './getDiff';
import getAddressSimpleOf from './getAddressSimpleOf';
import getUsenameOf from './getUsenameOf';
import serializeLivingConditions, { LivingConditions } from './livingConditions/serializeLivingConditions';

const { can } = permissionUtils;

function fromDateToTimestamp(date) {
    return date !== null ? (new Date(`${date}T02:00:00`).getTime() / 1000) : null;
}

type SocialOrigin = {
    id: number,
    uid: string,
    label: string
};

type UserShantytown = {
    id: number,
    first_name: string,
    last_name: string,
    position: string,
    organization: {
        id: number,
        name: string,
        abbreviation: string | null,
    },
};

type Changelog = {
    author: UserShantytown,
    date: number,
    diff: Diff[]
};

export type ClosingSolution = {
    id: number,
    peopleAffected: number,
    householdsAffected: number,
    message: string,
    shantytownId?: number
};

type BaseShantytown =
{
    type: 'shantytown',
    id: number,
    name: string | null,
    status: 'open' | 'unknown' | 'closed_by_justice' | 'resorbed' | 'other',
    closingContext: string | null,
    latitude: number,
    longitude: number,
    city: {
        code: string,
        name: string,
        main: string | null,
        latitude: number,
        longitude: number,
    },
    epci: {
        code: string | null,
        name: string | null,
    },
    departement: {
        code: string,
        name: string,
        latitude: number,
        longitude: number,
        chieftown: {
            code: string,
            name: string,
            latitude: number,
            longitude: number,
        },
    },
    region: {
        code: string,
        name: string,
        latitude: number,
        longitude: number,
        chieftown: {
            code: string,
            name: string,
            latitude: number,
            longitude: number,
        },
    },
    declaredAt: number | null,
    builtAt: number | null,
    isReinstallation: boolean | null,
    reinstallationComments: string | null,
    reinstallationIncomingTowns: IncomingTown[],
    closedAt: number | null,
    address: string,
    addressDetails: string | null,
    addressSimple: string,
    usename: string,
    populationTotal: number | null,
    populationCouples: number | null,
    populationMinors: number | null,
    populationMinors0To3: number | null,
    populationMinors3To6: number | null,
    populationMinors6To12: number | null,
    populationMinors12To16: number | null,
    populationMinors16To18: number | null,
    minorsInSchool: number | null,
    caravans: number | null,
    huts: number | null,
    tents: number | null,
    cars: number | null,
    mattresses: number | null,
    livingConditions: LivingConditions,
    censusStatus: 'done' | 'scheduled' | null,
    censusConductedBy: string | null,
    censusConductedAt: number | null,
    fieldType: {
        id: number,
        label: string,
    },
    ownerType: {
        id: number,
        label: string,
    },
    socialOrigins: SocialOrigin[],
    comments: {
        regular: ShantytownComment[],
        covid: any[],
    },
    actors: Actor[],
    actions: ShantytownAction[],
    closingSolutions: ClosingSolution[],
    closedWithSolutions: 'no' | 'yes' | 'unknown' | null,
    changelog: Changelog[],
    createdAt: number,
    updatedAt: number | null,
    createdBy: UserShantytown,
    updatedBy: UserShantytown,
    heatwaveStatus: boolean,
    resorptionTarget: number | null,
    completionRate: number,
    distance?: number | null
};

type ShantytownWithJustice = BaseShantytown & {
    ownerComplaint: boolean | null,
    justiceProcedure: boolean | null,
    justiceRendered: boolean | null,
    justiceRenderedAt: number | null,
    justiceRenderedBy: string | null,
    justiceChallenged: boolean | null,
    policeStatus: 'requested' | 'granted' | 'none' | null,
    policeRequestedAt: number | null,
    policeGrantedAt: number | null,
    bailiff: string | null,
};

type ShantytownWithOwner = BaseShantytown & {
    owner: string | null
};


export type Shantytown = BaseShantytown | ShantytownWithJustice | ShantytownWithOwner | (ShantytownWithJustice & ShantytownWithOwner);

export default (town: ShantytownRow, user): Shantytown => {
    let serializedTown: Shantytown = {
        type: 'shantytown',
        id: town.id,
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
        ownerType: {
            id: town.ownerTypeId,
            label: town.ownerTypeLabel,
        },
        socialOrigins: (town.socialOrigins || []).map((socialOrigin) => {
            const [id, uid, label] = socialOrigin.split('|');
            return {
                id: parseInt(id, 10),
                uid,
                label,
            };
        }),
        comments: {
            regular: [],
            covid: [],
        },
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

    const location = {
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
            },
        };
    }

    if (can(user).do('access', 'shantytown_owner').on(location)) {
        serializedTown = {
            ...serializedTown,
            ...{
                owner: town.owner,
            },
        };
    }
    return serializedTown;
};
