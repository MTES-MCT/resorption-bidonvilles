import { sequelize } from '#db/sequelize';
import serializeRole from './_common/serializeRole';

export default async () => {
    const roles = await sequelize.query(
        `SELECT
            roles.role_id AS id,
            roles.name AS name
        FROM roles`,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    return roles.map(serializeRole);
};
