import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

export default async (id: number, transaction: Transaction = undefined): Promise<void> => {
    await sequelize.query(
        `UPDATE
            users
        SET
            fk_status = CASE
                WHEN users.password IS NULL THEN 'new'
                ELSE 'active'
            END,
            updated_at = NOW(),
            anonymization_requested = NULL,
            deactivated_at = NULL,
            deactivation_type = NULL,

            -- les deux lignes suivantes sont nécessaires pour éviter
            -- que l'utilisateur ne soit identifié comme utilisateur inactif
            -- depuis trop longtemps et qu'il se retrouve automatiquement désactivé
            last_access = CASE
                WHEN users.password IS NULL THEN NULL
                ELSE NOW()
            END,
            inactivity_alert_sent_at = NULL
        WHERE
            user_id = :id
        `,
        {
            replacements: {
                id,
            },
            transaction,
        },
    );
};
