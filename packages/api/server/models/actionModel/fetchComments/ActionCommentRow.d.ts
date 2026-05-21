import { CreatorInfo } from '#server/models/_common/types/UserInfoTypes.d';

export type ActionRowComment = {
    action_id: number,
    id: number,
    description: string,
    creator_user_role: string,
    attachments: string[],
} & CreatorInfo;
