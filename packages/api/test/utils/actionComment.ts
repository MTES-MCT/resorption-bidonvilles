import { ActionRowComment } from '#server/models/actionModel/fetchComments/ActionCommentRow.d';
import { Comment } from '#root/types/resources/Action.d';

export function row(override: Partial<ActionRowComment> = {}): ActionRowComment {
    const defaultObj: ActionRowComment = {
        action_id: 1,
        id: 1,
        description: 'Un commentaire',
        created_at: new Date(2020, 0, 1, 0, 0, 0),
        creator_id: 2,
        creator_first_name: 'Jean',
        creator_last_name: 'Dupont',
        creator_organization_id: 2,
        creator_organization_name: 'Délégation Interministérielle à l\'Hébergement et à l\'Accès au Logement',
        creator_organization_abbreviation: 'DIHAL',
        creator_user_role: 'collaborator',
        attachments: [],
    };

    return Object.assign(defaultObj, override);
}

export function serialized(override: Partial<Comment> = {}): Comment {
    const defaultObj: Comment = {
        id: 1,
        description: 'Un commentaire',
        createdAt: (new Date(2020, 0, 1, 0, 0, 0)).getTime() / 1000,
        createdBy: {
            id: 2,
            first_name: 'Jean',
            last_name: 'Dupont',
            organization_id: 2,
            organization: 'DIHAL',
        },
        attachments: [],
    };

    return Object.assign(defaultObj, override);
}

export default serialized;
