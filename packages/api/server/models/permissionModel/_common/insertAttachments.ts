import { sequelize } from '#db/sequelize';
import { Attachment } from '../types/Attachment.d';

export default (attachments: Attachment[], userPermissionId, transaction) => Promise.all(
    attachments.map(attachment => sequelize.query(
        `INSERT INTO user_permission_attachments(fk_user_permission, fk_region, fk_departement, fk_epci, fk_city, fk_shantytown, fk_plan, fk_action)
            VALUES (:permission_id, :region, :departement, :epci, :city, :shantytown, :plan, :action)`,
        {
            transaction,
            replacements: {
                permission_id: userPermissionId,
                region: attachment.type === 'region' ? attachment.id : null,
                departement: attachment.type === 'departement' ? attachment.id : null,
                epci: attachment.type === 'epci' ? attachment.id : null,
                city: attachment.type === 'city' ? attachment.id : null,
                shantytown: attachment.type === 'shantytown' ? attachment.id : null,
                plan: attachment.type === 'plan' ? attachment.id : null,
                action: attachment.type === 'action' ? attachment.id : null,
            },
        },
    )),
);
