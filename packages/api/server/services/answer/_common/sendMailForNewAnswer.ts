import mails from '#server/mails/mails';

export default async (questionId, answerAuthor, questionAuthor) => {
    mails.sendUserNewAnswerToQuestion(questionAuthor, {
        variables: {
            questionId,
            author: answerAuthor,
        },
        preserveRecipient: false,
    });
};
