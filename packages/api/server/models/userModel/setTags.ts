import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

export default async (userId: number, tags: string[], argTransaction: Transaction = undefined): Promise<void> => {
    let transaction = argTransaction;
    let commitTransaction = false;
    if (!transaction) {
        transaction = await sequelize.transaction();
        commitTransaction = true;
    }

    try {
        await sequelize.query('DELETE FROM user_to_tags WHERE fk_user = :userId', {
            transaction,
            replacements: {
                userId,
            },
        });

        if (tags.length > 0) {
            await sequelize.query(
                `INSERT INTO user_to_tags(fk_user, fk_question_tag)
                VALUES ${tags.map(() => '(?, ?)').join(', ')}`,
                {
                    transaction,
                    replacements: tags.map(tag => [userId, tag]).flat(),
                },
            );
        }

        if (commitTransaction === true) {
            await transaction.commit();
        }
    } catch (error) {
        if (commitTransaction === true) {
            await transaction.rollback();
        }

        throw error;
    }
};
