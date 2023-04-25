import { QuestionSubscriberRow } from '#server/models/userModel/getQuestionSubscribers';

export function row(override: Partial<QuestionSubscriberRow> = {}): QuestionSubscriberRow {
    const defaultObj:QuestionSubscriberRow = {
        user_id: 1,
        email: 'jean.dupont@gouv.fr',
        first_name: 'Jean',
        last_name: 'Dupont',
        is_author: true,
    };

    return Object.assign(defaultObj, override);
}

export default row;
