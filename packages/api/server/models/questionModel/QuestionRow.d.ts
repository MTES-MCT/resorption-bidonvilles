type QuestionRow = {
    questionId: number,
    question: string,
    details: string,
    peopleAffected: number | null,
    tags: string[],
    other_tag: string | null,
    questionCreatedAt: Date,
    questionUpdatedAt: Date | null,
    questionSolvedAt: Date | null,
    questionCreatedBy: number,
    userId: number,
    userFirstName: string,
    userLastName: string,
    userPosition: string,
    userRole: string,
    organizationId: number,
    organizationName: string,
    organizationAbbreviation: string,
    attachments: string[],
};

export default QuestionRow;
