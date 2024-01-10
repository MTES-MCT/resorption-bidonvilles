import ServiceError from '#server/errors/ServiceError';
import userQuestionSubscriptionModel from '#server/models/userQuestionSubscriptionModel';
import { User } from '#root/types/resources/User.d';

export default async (user: User, questionId: number): Promise<void> => {
    if (user.question_subscriptions[questionId] === true) {
        return;
    }

    try {
        if (user.question_subscriptions[questionId] === false) {
            await userQuestionSubscriptionModel.setSubscriptionState(user.id, questionId, true);
        } else {
            await userQuestionSubscriptionModel.createSubscription(user.id, questionId);
        }
    } catch (error) {
        throw new ServiceError('write_failed', error);
    }
};
