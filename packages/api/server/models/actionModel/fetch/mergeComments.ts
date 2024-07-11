import { ActionHash } from './hashActions';
import { ActionRowComment } from '../fetchComments/ActionCommentRow.d';
import serializeComment from '../fetchComments/serializeComment';

export default function mergeComments(hash: ActionHash, comments: ActionRowComment[]): void {
    comments.forEach(row => hash[row.action_id].comments.push(serializeComment(row)));
}
