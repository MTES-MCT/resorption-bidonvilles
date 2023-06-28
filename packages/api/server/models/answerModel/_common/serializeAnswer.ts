import attachmentModel from '#server/models/attachmentModel';
import AnswerRow from '../AnswerRow.d';
import Answer from '../Answer.d';

export default async (answer: AnswerRow): Promise<Answer> => {
    const attachments = await Promise.all(
        answer.attachments?.length
            ? answer.attachments.map(attachmentModel.serializeAttachment)
            : [],
    );
    return {
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
        attachments,
    };
};
