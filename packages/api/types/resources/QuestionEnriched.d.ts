import { Attachment } from '#server/services/attachment/Attachment.d';
import { GenericQuestion } from '#root/types/resources/QuestionGeneric.d';

export type EnrichedQuestion = GenericQuestion & {
    attachments: Attachment[];
};
