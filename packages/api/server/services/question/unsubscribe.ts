import ServiceError from '#server/errors/ServiceError';
import userQuestionSubscriptionModel from '#server/models/userQuestionSubscriptionModel';
import { User } from '#root/types/resources/User.d';

export default async (user: User, questionId: number): Promise<void> => {
    if (user.question_subscriptions[questionId] !== true) {
        return;
    }

    try {
        await userQuestionSubscriptionModel.setSubscriptionState(user.id, questionId, false);
    } catch (error) {
        throw new ServiceError('write_failed', error);
    }
};
