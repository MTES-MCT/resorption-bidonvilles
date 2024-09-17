import actionModel from '#server/models/actionModel/index';
import ServiceError from '#server/errors/ServiceError';
import { EnrichedAction } from '#root/types/resources/ActionEnriched.d';
import { User } from '#root/types/resources/User.d';
import enrichCommentsAttachments from './enrichCommentsAttachments';

export default async (user: User, actionIds: number[] = null): Promise<EnrichedAction[]> => {
    const actions = await actionModel.fetch(user, actionIds);

    /*
       Calculer les liens signés pour les fichiers joints et remplacer, dans les
       commentaires, les tableaux de chaînes par des tableaux d'objets `attachments`
    */
    if (actions === null) {
        throw new ServiceError('fetch_failed', new Error('Impossible de retrouver les données'));
    }

    const enrichedActions: EnrichedAction[] = await Promise.all(actions.map(async (action) => {
        const { comments, ...actionWithoutComments } = action;
        const commentsWithEnrichedAttachments = await Promise.all(comments.map(async comment => enrichCommentsAttachments(comment)));
        return {
            ...actionWithoutComments,
            comments: commentsWithEnrichedAttachments,
        };
    }));
    return enrichedActions;
};
