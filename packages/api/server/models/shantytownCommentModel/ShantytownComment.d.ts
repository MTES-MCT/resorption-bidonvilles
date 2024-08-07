import { File } from '#server/models/attachmentModel/File.d';
import { CommentTag } from '../shantytownCommentTagModel/serializeCommentTag';

type CommentAuthor = {
    id:number,
    first_name: string,
    last_name: string,
    position: string,
    organization: string,
    organization_id: number
};

type ShantytownComment = {
    id: number,
    description: string,
    createdAt: number,
    organization_target_name: string[],
    user_target_name: string[],
    shantytown: number,
    tags: CommentTag[],
    createdBy: CommentAuthor,
    attachments: File[]
};

export default ShantytownComment;
