import { sequelize } from '#db/sequelize';

export default async (userId: number): Promise<void> => {
    await sequelize.query(
        'UPDATE users SET inactivity_alert_sent_at = NULL, updated_at = NOW() WHERE user_id = :userId',
        {
            replacements: { userId },
        },
    );
};
