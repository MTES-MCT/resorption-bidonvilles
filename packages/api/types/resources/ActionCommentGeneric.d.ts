import { CommentAuthor } from '#root/types/resources/CommentAuthor.d';

export type ActionGenericComment = {
    id: number,
    description: string,
    createdAt: number,
    createdBy: CommentAuthor,
};
