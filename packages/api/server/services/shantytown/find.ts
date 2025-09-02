import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';
import findJusticeReaders from '#server/services/shantytown/findJusticeReaders';
import shantytownDecree from '#server/services/shantytownDecree/findAll';
import serializeAttachment from '#server/services/attachment/serializeAttachment';
import enrichCommentsAttachments from './_common/enrichCommentsAttachments';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import { Attachment } from '../attachment/Attachment';

export default async (user: AuthUser, townId: number): Promise<Shantytown> => {
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
    let decrees = [];
    let enrichedDecrees: Attachment[] = [];
    if (user.role_id === 'national_admin' || (await findJusticeReaders(townId, user.id)).length > 0) {
        decrees = await shantytownDecree(user, townId);
        enrichedDecrees = await Promise.all((decrees || []).map(async (decree) => {
            const decreeArray = [decree.attachmentId, decree.fileKey, decree.previewFileKey, decree.originalName, decree.type, decree.size, decree.createdBy].join('@.;.@');

            return { ...await serializeAttachment(decreeArray), type: decree.attachmentType, mimetype: decree.type };
        }));
    }

    return {
        ...townWithoutComments,
        comments: commentsWithEnrichedAttachments,
        attachments: enrichedDecrees,
    };
};
