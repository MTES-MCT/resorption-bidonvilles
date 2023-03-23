import QuestionRow from './QuestionRow.d';
import Question from './Question.d';

export default (question: QuestionRow): Question => ({
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
        organization: question.organizationAbbreviation || question.organizationName,
        organization_id: question.organizationId,
    },
    answers: [],
});
