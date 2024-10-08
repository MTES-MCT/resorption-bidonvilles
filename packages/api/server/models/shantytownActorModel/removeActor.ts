import { sequelize } from '#db/sequelize';

export default (shantytownId, userId, transaction = undefined) => sequelize.query(
    `DELETE
            FROM shantytown_actors
            WHERE fk_shantytown = :fk_shantytown AND fk_user = :fk_user`,
    {
        replacements: {
            fk_shantytown: shantytownId,
            fk_user: userId,
        },
        transaction,
    },
);
