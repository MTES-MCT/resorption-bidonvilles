import type { QuestionUpdatedBy } from './QuestionUpdatedBy';

export type UpdatedQuestion = {
    id: number,
    details: string,
    updatedAt: Date,
    updatedBy: QuestionUpdatedBy
};
