import { CommentTagRow } from './CommentTagRow';

export type CommentTag = {
    uid: string,
    label: string,
};

export default (tag: CommentTagRow): CommentTag => ({
    uid: tag.uid,
    label: tag.label,
});
