import AnswerRow from '../AnswerRow.d';
import { RawAnswer } from '#root/types/resources/AnswerRaw.d';

export default (answer: AnswerRow): RawAnswer => ({
    id: answer.answerId,
    description: answer.answerDescription,
    createdAt: answer.answerCreatedAt !== null ? (answer.answerCreatedAt.getTime() / 1000) : null,
    createdBy: {
        id: answer.answerCreatedBy,
        email: answer.userEmail,
        first_name: answer.userFirstName,
        last_name: answer.userLastName,
        role: answer.userRole,
        position: answer.userPosition,
        organization: answer.organizationAbbreviation || answer.organizationName,
        organization_id: answer.organizationId,
    },
    question: answer.questionId,
    attachments: answer.attachments?.length
        ? answer.attachments : [],
});
