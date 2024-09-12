import { GenericQuestion } from '#root/types/resources/QuestionGeneric.d';

export type RawQuestion = GenericQuestion & {
    attachments: string[];
};
