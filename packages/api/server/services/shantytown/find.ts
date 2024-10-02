import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';
import findJusticeReaders from '#server/services/shantytown/findJusticeReaders';
// import findJusticeReadersByShantytown from '#server/models/organizationModel/findJusticeReadersByShantytown';
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
    // const decrees = await shantytownDecree.findAll(user, townId);
    // console.log((await findJusticeReaders(townId, 2588)).length);
    console.log('User: ', user);

    if (user.role_id === 'national_admin' || (await findJusticeReaders(townId, user.id)).length > 0) {
        console.log("L'utilisateur a accès, on va chercher les arrêtés");
    } else {
        console.log("L'utilisateur n'a pas accès");
    }
    return {
        ...townWithoutComments,
        comments: commentsWithEnrichedAttachments,
    };
};
