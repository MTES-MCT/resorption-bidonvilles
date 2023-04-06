import mails from '#server/mails/mails';
import userModel from '#server/models/userModel/index';
import Action, { Comment } from '#server/models/actionModel/fetch/Action.d';

export default async (action: Action, comment: Comment): Promise<number> => {
    const observers = await userModel.getActionObservers(
        action.id,
        comment.id,
    );

    if (observers.length > 0) {
        await Promise.all(
            observers.map(user => mails.sendUserNewActionComment(
                user,
                {
                    variables: {
                        action,
                        comment,
                    },
                },
            )),
        );
    }
    return observers.length;
};
