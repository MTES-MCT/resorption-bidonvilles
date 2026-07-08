import { ShantytownGenericComment } from '#root/types/resources/ShantytownCommentGeneric.d';

export type ShantytownRawComment = ShantytownGenericComment & {
    attachments: string[];
};
