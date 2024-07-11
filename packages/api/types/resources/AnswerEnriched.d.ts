import { Attachment } from '#server/services/attachment/Attachment.d';
import { GenericAnswer } from '#root/types/resources/AnswerGeneric.d';

export type EnrichedAnswer = GenericAnswer & {
    attachments: Attachment[];
};
