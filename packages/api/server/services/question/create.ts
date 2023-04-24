import ServiceError from '#server/errors/ServiceError';
import questionModel from '#server/models/questionModel';
import Question from '#server/models/questionModel/Question.d';
import QuestionInput from '#server/models/questionModel/QuestionInput.d';
import userModel from '#server/models/userModel';
import mails from '#server/mails/mails';
import config from '#server/config';

type AuthorData = {
    id: number
};

const { testEmail } = config;

export default async (question: QuestionInput, author: AuthorData): Promise<Question> => {
    // on insère la question
    let questionId: number;
    try {
        questionId = await questionModel.create({
            question: question.question,
            details: question.details,
            people_affected: question.people_affected,
            tags: question.tags,
            other_tag: question.other_tag || null,
            created_by: author.id,
        });
    } catch (error) {
        throw new ServiceError('insert_failed', error);
    }

    // on retourne la question
    let serializedQuestion: Question;
    try {
        serializedQuestion = await questionModel.findOne(questionId);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    // on notifie tous les utilisateurs concernés
    try {
        const watchers = await userModel.getQuestionWatchers(author.id);
        await Promise.all(
            (testEmail ? watchers.slice(0, 1) : watchers).map(watcher => mails.sendCommunityNewQuestion(watcher, {
                preserveRecipient: false,
                variables: {
                    question: serializedQuestion,
                },
            })),
        );
    } catch (error) {
        // ignore
    }

    return serializedQuestion;
};
