import { Actor } from '#server/models/shantytownActorModel/serializeActor';
import { IncomingTown } from '#server/models/incomingTownsModel/findAll';
import { Diff } from '#server/models/shantytownModel/_common/getDiff';
import { LivingConditions } from '#server/models/shantytownModel/_common/livingConditions/serializeLivingConditions';
import { ShantytownDecree } from '#server/models/shantytownDecreeModel/shantytownDecrees.d';
import { ShantytownRawComment } from '#root/types/resources/ShantytownCommentRaw.d';
import { ShantytownAction } from '#root/types/resources/Action.d';
import { SocialOrigin } from '#root/types/resources/SocialOrigin.d';

type ShantytownUser = {
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

type ShantytownClosingSolution = {
    id: number,
    peopleAffected: number,
    householdsAffected: number,
    message: string,
    shantytownId?: number
};

type Changelog = {
    author: ShantytownUser,
    date: number,
    diff: Diff[]
};

type BaseShantytown =
{
    type: 'shantytown',
    id: number,
    updatedWithoutAnyChange: boolean | null,
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
    censusStatus: 'none' | 'done' | 'scheduled' | null,
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
    comments: ShantytownRawComment[],
    actors: Actor[],
    actions: ShantytownAction[],
    closingSolutions: ShantytownClosingSolution[],
    closedWithSolutions: 'no' | 'yes' | 'unknown' | null,
    changelog: Changelog[],
    createdAt: number,
    updatedAt: number | null,
    createdBy: ShantytownUser,
    updatedBy: ShantytownUser,
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
    existingLitigation: boolean | null,
    evacuationUnderTimeLimit: boolean | null,
    administrativeOrderDecisionAt: number | null,
    administrativeOrderDecisionRenderedBy: string | null,
    administrativeOrderEvacuationAt: number | null,
    insalubrityOrder: boolean | null,
    insalubrityOrderDisplayed: boolean | null,
    insalubrityOrderType: string | null,
    insalubrityOrderBy: string | null,
    insalubrityOrderAt: number | null,
    insalubrityParcels: string | null,
    decrees: ShantytownDecree[]
};

type ShantytownWithOwner = BaseShantytown & {
    owner: string | null
};

export type Shantytown = BaseShantytown | ShantytownWithJustice | ShantytownWithOwner | (ShantytownWithJustice & ShantytownWithOwner);
