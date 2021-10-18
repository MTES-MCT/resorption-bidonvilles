const { sequelize } = require('#db/models');

module.exports = async (organization_id, transaction = undefined) => {
    const result = await sequelize.query(
        `SELECT
            fk_role
        FROM
            organization_types ot
        LEFT JOIN
            organizations o
                ON o.fk_type = ot.organization_type_id 
        WHERE
            o.organization_id = :organization_id`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                organization_id,
            },
            transaction,
        },
    );

    return result.length === 1 ? result[0].fk_role : null;
};
