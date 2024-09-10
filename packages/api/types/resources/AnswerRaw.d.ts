import { GenericAnswer } from '#root/types/resources/AnswerGeneric.d';

export type RawAnswer = GenericAnswer & {
    attachments: string[];
};
