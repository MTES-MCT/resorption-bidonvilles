import { ActionCommentRow } from './fetchComments';
import { Comment } from '../fetch/Action';

export default (row: ActionCommentRow): Comment => ({
    id: row.id,
    description: row.description,
    tags: [],
    user_target_name: [],
    organization_target_name: [],
    createdAt: row.created_at.getTime() / 1000,
    createdBy: {
        id: row.creator_id,
        first_name: row.creator_first_name,
        last_name: row.creator_last_name,
        organization_id: row.creator_organization_id,
        organization: row.creator_organization_abbreviation || row.creator_organization_name,
    },
});