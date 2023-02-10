import { ActionHash } from './hashActions';
import { ActionCommentRow } from '../fetchComments/fetchComments';
import serializeComment from '../fetchComments/serializeComment';

export default function mergeComments(hash: ActionHash, comments: ActionCommentRow[]): void {
    comments.forEach((row) => {
        hash[row.action_id].comments.push(serializeComment(row));
    });
}
