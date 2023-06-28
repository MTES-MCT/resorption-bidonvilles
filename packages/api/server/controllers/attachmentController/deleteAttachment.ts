import attachmentService from '#server/services/attachment';
import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

const ERROR_RESPONSES = {
    delete_failed: { code: 500, message: 'Une erreur est survenue lors de l\'écriture en base de données' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        await attachmentService.deleteAttachment(req.body.keys, transaction);
    } catch (error) {
        await transaction.rollback();
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        next(error.nativeError || error);
    }
    // Si tout aucune opération en bdd n'est en échec, on commit
    await transaction.commit();
    return res.status(200).send(req.body.keys);
};
