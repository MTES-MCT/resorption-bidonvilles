import { File } from '#server/models/attachmentModel/File.d';
import { Answer } from '#root/types/resources/Answer.d';

export type Question = {
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
        organization: string,
        organization_id: number,
    },
    answers: Answer[],
    attachments: File[],
};

export type QuestionTag = {
    uid: string;
    name: string;
};
