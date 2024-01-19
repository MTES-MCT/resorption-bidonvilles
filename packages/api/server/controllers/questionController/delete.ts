import Question from '#server/models/questionModel/Question';
import questionService from '#server/services/question';
import { NextFunction, Request, Response } from 'express';

interface QuestionDeleteRequest extends Request {
    question:Question
}

export default async (req:QuestionDeleteRequest, res:Response, next:NextFunction) => {
    try {
        await questionService.deleteQuestion(req.question.id);
        return res.status(204).send({});
    } catch (error) {
        return next((error?.nativeError) || error);
    }
};
