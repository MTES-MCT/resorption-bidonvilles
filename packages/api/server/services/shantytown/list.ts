import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';
import shantytownDecree from '#server/services/shantytownDecree/findAll';
import { ShantytownDecree } from '#server/models/shantytownDecreeModel/shantytownDecrees.d';
import serializeAttachment from '#server/services/attachment/serializeAttachment';
import { Attachment } from '../attachment/Attachment';

export default async (user, search = undefined) => {
    const filters = search !== undefined ? [
        {
            name: {
                operator: 'ILIKE',
                value: `%${search}%`,
            },
            address: {
                operator: 'ILIKE',
                value: `%${search}%`,
            },
        },
    ] : [];
    let shantytowns;
    try {
        shantytowns = await shantytownModel.findAll(
            user,
            filters,
            'list',
        );

        if (user.permissions.shantytown_justice.access.allowed) {
            const decrees: ShantytownDecree[] = await shantytownDecree(user, shantytowns.map(town => town.id));

            shantytowns = await Promise.all(shantytowns.map(async (shantytown) => {
                const updatedShantytown = { ...shantytown };
                if (updatedShantytown.attachments === undefined) {
                    updatedShantytown.attachments = [];
                }

                const filteredDecrees = decrees.filter(filteredDecree => filteredDecree.shantytownId === updatedShantytown.id);
                if (filteredDecrees.length > 0) {
                    const attachments: Attachment[] = await Promise.all(filteredDecrees.map(async attachment => ({
                        ...await serializeAttachment([attachment.attachmentId, attachment.fileKey, attachment.previewFileKey, attachment.originalName, attachment.type, attachment.size, attachment.createdBy].join('@.;.@')),
                        type: attachment.attachmentType,
                        mimetype: attachment.type,
                    })));

                    updatedShantytown.attachments.push(...attachments);
                }

                return updatedShantytown;
            }));
        }
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    return shantytowns;
};
