import attachmentModel from '#server/models/attachmentModel';
import AnswerRow from '../AnswerRow.d';
import { Answer } from '#root/types/resources/Answer.d';

export default (answer: AnswerRow): Answer => ({
    id: answer.answerId,
    description: answer.answerDescription,
    createdAt: answer.answerCreatedAt !== null ? (answer.answerCreatedAt.getTime() / 1000) : null,
    createdBy: {
        id: answer.answerCreatedBy,
        first_name: answer.userFirstName,
        last_name: answer.userLastName,
        role: answer.userRole,
        position: answer.userPosition,
        organization: answer.organizationAbbreviation || answer.organizationName,
        organization_id: answer.organizationId,
    },
    question: answer.questionId,
    attachments: answer.attachments?.length
        ? answer.attachments.map(attachmentModel.serializeAttachment)
        : [],
});
