import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';
import findJusticeReaders from '#server/services/shantytown/findJusticeReaders';
import shantytownDecree from '#server/services/shantytownDecree/findAll';
import enrichCommentsAttachments from './_common/enrichCommentsAttachments';
import { Shantytown } from '#root/types/resources/Shantytown.d';

export default async (user, townId): Promise<Shantytown> => {
    const town = await shantytownModel.findOne(user, townId);

    /*
       Calculer les liens signés pour les fichiers joints et remplacer, dans les
       commentaires, les tableaux de chaînes par des tableaux d'objets `attachments`
    */
    if (town === null) {
        throw new ServiceError('fetch_failed', new Error('Impossible de retrouver le site en base de données'));
    }
    const { comments, ...townWithoutComments } = town;
    const commentsWithEnrichedAttachments = await Promise.all(comments.map(async comment => enrichCommentsAttachments(comment)));
    let decrees = null;
    if (user.role_id === 'national_admin' || (await findJusticeReaders(townId, user.id)).length > 0) {
        decrees = { decrees: await shantytownDecree(user, townId) };
    }
    return {
        ...townWithoutComments,
        comments: commentsWithEnrichedAttachments,
        ...decrees,
    };
};
