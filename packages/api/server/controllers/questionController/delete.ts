import Question from '#server/models/questionModel/Question';
import questionService from '#server/services/question';
import { NextFunction, Request, Response } from 'express';
import { Result } from 'express-validator';

interface QuestionDeleteRequest extends Request {
    question:Question
}

export default async (req:QuestionDeleteRequest, res:Response, next:NextFunction) => {

    try {
        await questionService.deleteQuestion(
            req.question.id,
        );
    } catch (error) {
        return next((error && error.nativeError) || error);
    }
    //     let message;
    //     switch (error && error.code) {
    //         case 'insert_failed':
    //             message = 'Votre question n\'a pas pu être enregistrée.';
    //             break;

    //         case 'fetch_failed':
    //             message = 'Votre question a bien été enregistrée mais la liste des questions n\'a pas pu être actualisée.';
    //             break;

    //         default:
    //             message = 'Une erreur inconnue est survenue.';
    //     }

    //     res.status(500).send({
    //         user_message: message,
    //     });
    //     return next((error && error.nativeError) || error);
    // }

    // return res.status(201).send(
    //     question,
    // );
};
