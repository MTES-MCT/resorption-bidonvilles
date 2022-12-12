// import mattermostUtils from '#server/utils/mattermost';
import ServiceError from '#server/errors/ServiceError';
import questionModel from '#server/models/questionModel';

export default async (question, author) => {
    // on insère la question
    let questionId;
    try {
        questionId = await questionModel.create({
            question: question.question,
            details: question.details,
            people_affected: question.people_affected,
            tags: question.tags,
            other_tags: question.other_tag || null,
            created_by: author.id,
        });
    } catch (error) {
        throw new ServiceError('insert_failed', error);
    }

    // on tente d'envoyer une notification Mattermost
    try {
        // TODO
    } catch (error) {
        // ignore
    }

    // on retourne le commentaire
    let serializedQuestion;
    try {
        serializedQuestion = await questionModel.findOne(questionId);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    return serializedQuestion;
};
