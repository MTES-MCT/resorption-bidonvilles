import { sequelize } from '#db/sequelize';

export default async (data, transaction = undefined) => {
    const [[{ user_permission_id }]] = await sequelize.query(
        `INSERT INTO user_permissions(fk_feature, fk_entity, fk_user, fk_organization, allowed, allow_all, is_cumulative)
        VALUES (:feature, :entity, :fk_user, :fk_organization, :allowed, :allow_all, :is_cumulative)
        RETURNING user_permission_id`,
        {
            transaction,
            replacements: {
                feature: data.feature,
                entity: data.entity,
                fk_user: data.fk_user || null,
                fk_organization: data.fk_organization || null,
                allowed: data.allowed,
                allow_all: typeof data.allow_all === 'boolean' ? data.allow_all : null,
                is_cumulative: typeof data.is_cumulative === 'boolean' ? data.is_cumulative : null,
            },
        },
    );

    return user_permission_id;
};
