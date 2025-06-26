/* eslint-disable newline-per-chained-call */
import attachmentModel from '#server/models/attachmentModel';
import { AttachmentKeys } from '#server/models/attachmentModel/findKeys';
import { param } from 'express-validator';

export default [
    param('id')
        .toInt()
        .isInt().bail().withMessage('L\'identifiant de la pièce-jointe est invalide')
        .custom(async (value, { req }) => {
            let keys: AttachmentKeys;
            try {
                keys = await attachmentModel.findKeys(value);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                throw new Error('Une erreur de lecture en base de données est survenue');
            }

            if (keys === null) {
                throw new Error('La pièce-jointe à supprimer n\'existe pas');
            }

            if (keys.created_by !== req.user.id && !req.user.is_admin) {
                throw new Error('Vous n\'avez pas le droit de supprimer cette pièce-jointe');
            }

            req.keys = keys;
            return true;
        }),
];
