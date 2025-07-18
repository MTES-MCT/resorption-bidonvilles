import deleteAnswer from '#server/models/answerModel/delete';
import getNationalAdmins from '#server/models/userModel/_common/getNationalAdmins';
import ServiceError from '#server/errors/ServiceError';
import mails from '#server/mails/mails';
import dateUtils from '#server/utils/date';
import userModel from '#server/models/userModel';
import { RawAnswer } from '#root/types/resources/AnswerRaw.d';
import { EnrichedQuestion } from '#root/types/resources/QuestionEnriched.d';
import { User } from '#root/types/resources/User.d';

export default async (question: EnrichedQuestion, answer: RawAnswer, reason?: string): Promise<void> => {
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
            // eslint-disable-next-line no-console
            console.error(e);
        }

        try {
            const fullUser = await userModel.findOne(answer.createdBy.id);
            if (fullUser === null || fullUser.status !== 'active') {
                return;
            }

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
            // eslint-disable-next-line no-console
            console.error(e);
        }
    }
};
