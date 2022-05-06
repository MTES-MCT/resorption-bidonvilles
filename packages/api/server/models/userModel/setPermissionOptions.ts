import { sequelize } from '#db/sequelize';

export default async (userId, options, argTransaction) => {
    let transaction = argTransaction;
    let commitTransaction = false;
    if (!transaction) {
        transaction = await sequelize.transaction();
        commitTransaction = true;
    }

    await sequelize.query('DELETE FROM user_permission_options WHERE fk_user = :userId', {
        transaction,
        replacements: {
            userId,
        },
    })
        .then(() => Promise.all(
            options.map(option => sequelize.query(
                'INSERT INTO user_permission_options(fk_user, fk_option) VALUES (:userId, :option)',
                {
                    transaction,
                    replacements: {
                        userId,
                        option,
                    },
                },
            )),
        ));

    if (commitTransaction === true) {
        await transaction.commit();
    }
};
