import { EnrichedAnswer } from '#root/types/resources/AnswerEnriched.d';

export type GenericQuestion = {
    id: number,
    question: string,
    details: string,
    peopleAffected: number | null,
    tags: QuestionTag[],
    createdAt: number,
    updatedAt: number | null,
    solvedAt: number | null,
    createdBy: {
        id: number,
        first_name: string,
        last_name: string,
        role: string,
        position: string,
        organization: {
            id: number,
            name: string,
            abbreviation: string,
        },
    },
    updatedBy: {
        id: number,
        first_name: string,
        last_name: string,
        role: string | null,
        position: string,
        organization: {
            id: number,
            name: string,
            abbreviation: string,
        },
    } | null,
    answers: EnrichedAnswer[],
};

export type QuestionTag = {
    uid: string;
    name: string;
};
