/* eslint-disable no-param-reassign */
import { NextFunction, Request, Response } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
    if (Array.isArray(req.files)) {
        req.files.forEach((f) => {
            f.originalname = Buffer.from(f.originalname, 'latin1').toString('utf8');
        });
    } else if (req.files === undefined || req.files === null) {
        req.files = [];
    }

    next();
};
