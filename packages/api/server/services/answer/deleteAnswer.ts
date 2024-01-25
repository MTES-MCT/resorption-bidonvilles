import deleteAnswer from '#server/models/answerModel/delete';
import getNationalAdmins from '#server/models/userModel/_common/getNationalAdmins';
import ServiceError from '#server/errors/ServiceError';
import mails from '#server/mails/mails';
import dateUtils from '#server/utils/date';
import { Answer } from '#root/types/resources/Answer.d';
import { Question } from '#root/types/resources/Question.d';
import { User } from '#root/types/resources/User.d';

export default async (question: Question, answer: Answer, reason?: string): Promise<void> => {
    try {
        await deleteAnswer(answer.id);
    } catch (error) {
        throw new ServiceError('delete_failed', error);
    }

    if (reason !== undefined && reason.length > 0) {
        let nationalAdmins: User[] = [];
        try {
            nationalAdmins = await getNationalAdmins();
        } catch (e) {
            // ignore
        }

        try {
            await mails.sendAnswerDeletionNotification(answer.createdBy, {
                variables: {
                    message: answer.description,
                    created_at: dateUtils.fromTsToFormat(answer.createdAt, 'd M Y'),
                    question: question.question,
                    reason,
                },
                bcc: nationalAdmins,
            });
        } catch (e) {
            // ignore
        }
    }
};
