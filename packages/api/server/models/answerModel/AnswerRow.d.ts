type AnswerRow = {
    answerId: number,
    questionId: number,
    answerDescription: string,
    answerCreatedAt: Date,
    answerCreatedBy: number,
    userFirstName: string,
    userLastName: string,
    userPosition: string,
    userRole: string,
    organizationId: number,
    organizationName: string,
    organizationAbbreviation: string | null,
    attachments: string[],
};

export default AnswerRow;
