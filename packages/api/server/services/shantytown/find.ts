import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';
import enrichCommentsAttachments from './_common/enrichCommentsAttachments';

export default async (user, townId) => {
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
    return {
        ...townWithoutComments,
        comments: commentsWithEnrichedAttachments,
    };
};
