/* eslint-disable newline-per-chained-call */
import { body, param } from 'express-validator';
import findQuestion from '#server/models/questionModel/findOne';
import findAnswer from '#server/models/answerModel/findOne';
import { RawAnswer } from '#root/types/resources/AnswerRaw.d';
import { RawQuestion } from '#root/types/resources/QuestionRaw.d';

export default [
    param('id')
        .custom(async (value, { req }) => {
            let question: RawQuestion;
            try {
                question = await findQuestion(value);
            } catch (error) {
                throw new Error('Impossible de retrouver la question concernée en base de données');
            }

            if (question === null) {
                throw new Error('La question concernée par la réponse n\'existe pas');
            }

            req.question = question;
            return true;
        }),

    param('answerId')
        .custom(async (value, { req }) => {
            let answer: RawAnswer;
            try {
                answer = await findAnswer(value);
            } catch (error) {
                throw new Error('Impossible de retrouver la réponse concernée en base de données');
            }

            if (answer === null) {
                throw new Error('La réponse à supprimer n\'existe pas');
            }

            if (req.question !== undefined && answer.question !== req.question.id) {
                throw new Error('La réponse et la question ne sont pas liées');
            }

            if (req.user.id !== answer.createdBy.id && !req.user.isAllowedTo('moderate', 'data')) {
                throw new Error('Vous n\'avez pas le droit de supprimer cette réponse');
            }

            req.answer = answer;
            return true;
        }),

    body('reason')
        .if((value, { req }) => req.answer !== undefined && req.user.id !== req.answer.createdBy.id)
        .isString().withMessage('La raison doit être une chaîne de caractères')
        .trim()
        .notEmpty().withMessage('La raison est obligatoire'),
];
