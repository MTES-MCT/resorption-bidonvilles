import ServiceError from '#server/errors/ServiceError';
import { SerializedUser } from '#server/models/userModel/_common/types/SerializedUser.d';
import userQuestionSubscriptionModel from '#server/models/userQuestionSubscriptionModel';

export default async (user: SerializedUser, questionId: number): Promise<void> => {
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
