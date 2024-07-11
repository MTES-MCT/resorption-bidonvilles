import QuestionRow from './QuestionRow.d';
import { RawQuestion } from '#root/types/resources/QuestionRaw.d';

export default (question: QuestionRow): RawQuestion => ({
    id: question.questionId,
    question: question.question,
    details: question.details,
    peopleAffected: question.peopleAffected,
    tags: [...question.tags, question.other_tag ? `other.${question.other_tag}` : null]
        .filter(tag => tag !== null)
        .map((tag) => {
            const [uid, name] = tag.split(/\.(.*)/s);
            return { uid, name };
        }),
    createdAt: question.questionCreatedAt.getTime() / 1000,
    updatedAt: question.questionUpdatedAt !== null ? (question.questionUpdatedAt.getTime() / 1000) : null,
    solvedAt: question.questionSolvedAt !== null ? (question.questionSolvedAt.getTime() / 1000) : null,
    createdBy: {
        id: question.questionCreatedBy,
        first_name: question.userFirstName,
        last_name: question.userLastName,
        role: question.userRole,
        position: question.userPosition,
        organization: {
            id: question.organizationId,
            name: question.organizationName,
            abbreviation: question.organizationAbbreviation,
        },
    },
    updatedBy: question.questionUpdatedBy !== null ? {
        id: question.questionUpdatedBy,
        first_name: question.userUpdateFirstName,
        last_name: question.userUpdateLastName,
        role: question.userUpdateRole,
        position: question.userUpdatePosition,
        organization: {
            id: question.updateOrganizationId,
            name: question.updateOrganizationName,
            abbreviation: question.updateOrganizationAbbreviation,
        },
    } : null,
    answers: [],
    attachments: question.attachments?.length
        ? question.attachments : [],
});
