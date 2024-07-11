import { ShantytownCommentTag } from '#root/types/resources/ShantytownCommentTag.d';
import { CommentAuthor } from '#root/types/resources/CommentAuthor.d';

type ShantytownComentAuthor = CommentAuthor & {
    position: string,
};

export type ShantytownGenericComment = {
    id: number,
    description: string,
    createdAt: number | null,
    organization_target_name: string[],
    user_target_name: string[],
    createdBy: ShantytownComentAuthor,
    shantytown: number,
    tags: ShantytownCommentTag[],
};
