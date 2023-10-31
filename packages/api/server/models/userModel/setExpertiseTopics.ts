import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

export default async (userId: number, expertiseTopics: string[], interestTopics: string[], argTransaction: Transaction = undefined): Promise<void> => {
    let transaction = argTransaction;
    let commitTransaction = false;
    if (!transaction) {
        transaction = await sequelize.transaction();
        commitTransaction = true;
    }

    try {
        await sequelize.query('DELETE FROM user_to_expertise_topics WHERE fk_user = :userId', {
            transaction,
            replacements: {
                userId,
            },
        });

        const topics = [
            ...expertiseTopics.map(topic => ({ uid: topic, type: 'expertise' })),
            ...interestTopics.map(topic => ({ uid: topic, type: 'interest' })),
        ];
        if (topics.length > 0) {
            await sequelize.query(
                `INSERT INTO user_to_expertise_topics(fk_user, fk_expertise_topic, type)
                VALUES ${topics.map(() => '(?, ?, ?)').join(', ')}`,
                {
                    transaction,
                    replacements: topics.map(topic => [userId, topic.uid, topic.type]).flat(),
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
