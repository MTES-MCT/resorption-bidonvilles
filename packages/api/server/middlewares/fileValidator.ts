/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-param-reassign */
import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import extensions from '#common/utils/allowed_file_extensions';
import { MAX_FILE_SIZE } from '#common/utils/max_file_size';

export default async (req: Request, res: Response, next: NextFunction) => {
    const { files } = req;
    if (Array.isArray(files)) {
        files.forEach((f) => {
            f.originalname = Buffer.from(f.originalname, 'latin1').toString('utf8');
        });

        const fn = body('attachments')
            .custom(async () => {
                const { fileTypeFromBuffer } = await import('file-type');
                // si un des fichiers a un type interdit : générer une erreur
                const types = await Promise.all(
                    files.map(f => fileTypeFromBuffer(f.buffer)),
                );

                const wrongTypeFiles = types
                    .map((type, index) => ({
                        ...type,
                        file: files[index].originalname,
                    }))
                    .filter(type => !extensions.includes(type.ext));
                if (wrongTypeFiles.length > 0) {
                    throw new Error(
                        `Un ou plusieurs fichiers sont d'un type non autorisé : ${wrongTypeFiles.map(f => f.file).join(', ')}`,
                    );
                }

                // si un des fichiers est trop gros : générer une erreur
                const tooBigFiles = files.filter(f => f.size > MAX_FILE_SIZE);
                if (tooBigFiles.length > 0) {
                    throw new Error(
                        `Un ou plusieurs fichiers dépassent le poids maximal autorisé : ${tooBigFiles.map(f => f.originalname).join(', ')}`,
                    );
                }
            });

        await fn(req, res, next);
    } else if (req.files === undefined || req.files === null) {
        req.files = [];
    }
};
