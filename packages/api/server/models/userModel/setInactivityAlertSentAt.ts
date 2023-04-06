import { sequelize } from '#db/sequelize';

export default async (userIds: number[]): Promise<void> => {
    await sequelize.query(
        'UPDATE users SET inactivity_alert_sent_at = NOW() WHERE user_id IN (:userIds)',
        {
            replacements: { userIds },
        },
    );
};
