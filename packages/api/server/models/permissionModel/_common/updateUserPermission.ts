import { sequelize } from '#db/sequelize';

export default async (userPermissionId, data, transaction = undefined) => {
    const { sql, replacements } = Object.keys(data)
        .filter(key => ['allowed', 'allow_all'].includes(key))
        .reduce((acc, key) => ({
            sql: [...acc.sql, `${key} = :${key}`],
            replacements: {
                ...acc.replacements,
                [key]: data[key],
            },
        }), {
            sql: [],
            replacements: {},
        });

    if (sql.length === 0) {
        return;
    }

    await sequelize.query(
        `UPDATE user_permissions
        SET ${sql.join(', ')}
        WHERE user_permission_id = :userPermissionId`,
        {
            transaction,
            replacements: {
                ...replacements,
                userPermissionId,
            },
        },
    );
};