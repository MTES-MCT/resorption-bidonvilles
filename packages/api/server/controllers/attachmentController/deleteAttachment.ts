import { AttachmentKeys } from '#server/models/attachmentModel/findKeys';
import attachmentService from '#server/services/attachment';
import { NextFunction, Response } from 'express';

const ERROR_RESPONSES = {
    delete_failed: { code: 500, message: 'Une erreur est survenue lors de l\'écriture en base de données' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

interface DeleteAttachmentRequest extends Request {
    keys: AttachmentKeys,
}

export default async (req: DeleteAttachmentRequest, res: Response, next: NextFunction) => {
    try {
        await attachmentService.deleteAttachment(req.keys);
        res.status(204).send({});
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        next(error.nativeError || error);
    }
};
