export type ActionRowComment = {
    action_id: number,
    id: number,
    description: string,
    created_at: Date,
    creator_id: number,
    creator_first_name: string,
    creator_last_name: string,
    creator_user_role: string,
    creator_organization_id: number,
    creator_organization_name: string,
    creator_organization_abbreviation: string | null,
    attachments: string[],
};
