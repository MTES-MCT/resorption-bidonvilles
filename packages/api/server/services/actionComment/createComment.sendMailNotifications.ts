import { ActionCommentTargets } from '#server/models/actionModel/createComment/createComment';
import mails from '#server/mails/mails';
import userModel from '#server/models/userModel/index';
import Action, { Comment } from '#root/types/resources/Action.d';

export default async (action: Action, comment: Comment, targets?: ActionCommentTargets): Promise<number> => {
    let observers = await userModel.getActionObservers(action.id);

    // Si le mode n'est pas public, on filtre les observers selon les targets
    if (targets && targets.mode !== 'public') {
        const targetUserIds = new Set((targets.users || []).map(u => u.id));
        const targetOrganizationIds = new Set((targets.organizations || []).map(o => o.id));

        observers = observers.filter(
            observer => targetUserIds.has(observer.user_id) || targetOrganizationIds.has(observer.organization_id),
        );
    }

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
