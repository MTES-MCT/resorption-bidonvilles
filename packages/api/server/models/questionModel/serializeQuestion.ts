export default question => Object.assign(
    {
        id: question.commentId,
        question: question.question,
        details: question.details,
        peopleAffected: question.peopleAffected,
        createdAt: question.questionCreatedAt !== null ? (question.questionCreatedAt.getTime() / 1000) : null,
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
    },
);
