import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

export default async (transaction: Transaction = undefined): Promise<void> => {
    await sequelize.query(
        `UPDATE
            users
        SET
            anonymized_at = NOW(),
            first_name = 'Utilisateur',
            last_name = 'Désactivé',
            email = CONCAT('utilisateur.desactive.', user_id, '@anonyme.fr'),
            password = '',
            salt = '',
            phone = NULL,
            fk_status = 'inactive'
        WHERE
            (fk_status = 'inactive' AND DATE(deactivated_at) < DATE(NOW() - INTERVAL '6 months'))
            OR
            anonymization_requested = true
        `,
        {
            transaction,
        },
    );
};
