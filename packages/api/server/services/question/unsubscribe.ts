import ServiceError from '#server/errors/ServiceError';
import { SerializedUser } from '#server/models/userModel/_common/serializeUser';
import userQuestionSubscriptionModel from '#server/models/userQuestionSubscriptionModel';

export default async (user: SerializedUser, questionId: number): Promise<void> => {
    if (user.question_subscriptions[questionId] !== true) {
        return;
    }

    try {
        await userQuestionSubscriptionModel.setSubscriptionState(user.id, questionId, false);
    } catch (error) {
        throw new ServiceError('write_failed', error);
    }
};
