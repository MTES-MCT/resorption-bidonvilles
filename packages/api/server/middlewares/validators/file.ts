/* eslint-disable no-param-reassign */
import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import fileType from 'file-type';
// eslint-disable-next-line import/no-extraneous-dependencies
import extensions from '#common/utils/allowed_file_extensions';

export default async (req: Request, res: Response, next: NextFunction) => {
    const { files } = req;
    if (Array.isArray(files)) {
        files.forEach((f) => {
            f.originalname = Buffer.from(f.originalname, 'latin1').toString('utf8');
        });

        // si un des fichiers a un type interdit : générer une erreur
        const fn = body('attachments')
            .custom(async () => {
                const types = await Promise.all(
                    files.map(f => fileType.fromBuffer(f.buffer)),
                );

                if (types.some(type => !extensions.includes(type.ext))) {
                    throw new Error('Un des fichiers est d\'un type non autorisé');
                }
            });
        await fn(req, res, next);
    } else if (req.files === undefined || req.files === null) {
        req.files = [];
    }

    next();
};
