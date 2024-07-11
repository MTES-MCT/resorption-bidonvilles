import { Diff } from '#server/models/shantytownModel/_common/getDiff';
import { LocationDetails, CityLocationDetails } from '#server/models/locationModel/LocationDetails.d';
import { InterventionArea } from '#server/models/geoModel/Location.d';
import { ShantytownRawComment } from '#root/types/resources/ShantytownCommentRaw.d';
import { QuestionTag } from '#root/types/resources/QuestionGeneric.d';

// local types
type ActivityShantytown = {
    id: number,
    usename: string,
    city: CityLocationDetails,
    epci: LocationDetails,
    departement: LocationDetails,
    region: LocationDetails,
};

type ActivityShantytownWithResorption = ActivityShantytown & {
    resorptionTarget: number | null,

};

type ActivityShantytownWithClosedWithSolutions = ActivityShantytownWithResorption & {
    closedWithSolutions: boolean,

};


type ActionComment = {
    tags: string[],
    user_target_name: string[],
    organization_target_name: string[],
    description: string,
};


type ActivityAuthor = {
    name: string,
    organization: number,
};


export type BaseShantytownActivity = {
    entity: 'shantytown',
    date: number,
    author: ActivityAuthor,
    shantytown: ActivityShantytownWithResorption,
};


// exported types

export type UserActivity = {
    entity: 'user',
    action : 'creation',
    date: number,
    user: {
        name: string,
        organization: number,
        intervention_areas: {
            is_national: boolean,
            areas: InterventionArea[],
        },
    }
};

export type ShantytownActivityCreation = BaseShantytownActivity & {
    action: 'creation'
};


export type ShantytownActivityUpdate = BaseShantytownActivity & {
    action: 'update',
    diff: Diff[]
};

export type ShantytownActivityClosing = BaseShantytownActivity & {
    action: 'closing'
    shantytown: ActivityShantytownWithClosedWithSolutions
};

export type ShantytownActivity = ShantytownActivityCreation | ShantytownActivityUpdate | ShantytownActivityClosing;

export type ShantytownCommentActivity = {
    entity: 'comment',
    action : 'creation',
    date: number,
    author: ActivityAuthor,
    comment: ShantytownRawComment
    shantytown: ActivityShantytown
};

export type ActionCommentActivity = {
    entity: 'comment',
    action : 'creation',
    date: number,
    author: ActivityAuthor,
    actionEntity: {
        id: number,
        name: string,
    }
    comment: ActionComment
};

export type QuestionActivity = {
    entity: 'question',
    action : 'creation',
    date: number,
    author: ActivityAuthor,
    question: {
        id: number,
        question: string,
        people_affected: number,
        tags: QuestionTag[],
    }

};

export type AnswerActivity = {
    entity: 'answer',
    action: 'creation',
    date: number,
    question_author: ActivityAuthor,
    answer_author: ActivityAuthor,
    answer: {
        id: number,
        description: string,
    }
    question: {
        id: number,
        question: string,
    }
};
