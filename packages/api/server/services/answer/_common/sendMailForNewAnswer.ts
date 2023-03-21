import mails from '#server/mails/mails';
import { SerializedUser } from '#server/models/userModel/_common/serializeUser';

export default (questionId: number, answerAuthor: SerializedUser, questionAuthor: SerializedUser): Promise<any> => mails.sendUserNewAnswerToQuestion(questionAuthor, {
    variables: {
        questionId,
        author: answerAuthor,
    },
    preserveRecipient: false,
});
