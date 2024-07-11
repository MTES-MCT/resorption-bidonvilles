import { ActionRowComment } from './ActionCommentRow.d';
import { ActionRawComment } from '#root/types/resources/ActionCommentRaw.d';

export default (row: ActionRowComment): ActionRawComment => ({
    id: row.id,
    description: row.description,
    createdAt: row.created_at.getTime() / 1000,
    createdBy: {
        id: row.creator_id,
        first_name: row.creator_first_name,
        last_name: row.creator_last_name,
        organization_id: row.creator_organization_id,
        organization: row.creator_organization_abbreviation || row.creator_organization_name,
    },
    attachments: row.attachments?.length
        ? row.attachments
        : [],
});
