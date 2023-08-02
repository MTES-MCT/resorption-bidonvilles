import { sequelize } from '#db/sequelize';

export default async (user_id, transaction = undefined) => {
    await sequelize.query(
        `INSERT INTO
            user_deactivation_history(
                fk_user
            )

            VALUES(
                :user_id
            )
            `,
        {
            replacements: { user_id },
            transaction,
        },
    );
};
