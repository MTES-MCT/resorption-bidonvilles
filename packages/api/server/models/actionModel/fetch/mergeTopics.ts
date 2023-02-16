import { ActionHash } from './hashActions';
import { ActionTopicRow } from './fetchTopics';

export default function mergeTopics(hash: ActionHash, topics: ActionTopicRow[]): void {
    topics.forEach((row) => {
        hash[row.action_id].topics.push({
            uid: row.uid,
            name: row.name,
        });
    });
}
