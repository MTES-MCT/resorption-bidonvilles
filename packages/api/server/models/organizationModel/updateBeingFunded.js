const { sequelize } = require('#db/models');

module.exports = async (organizationId, data) => {
    const { being_funded, being_funded_at } = data;

    const transaction = await sequelize.transaction();
    await sequelize.query(
        `UPDATE
            organizations
        SET
            being_funded = ${being_funded},
            being_funded_at = '${being_funded_at}'

        WHERE
            organizations.organization_id = ${organizationId}`,
        {
            transaction,
        },
    );

    await sequelize.query(
        'REFRESH MATERIALIZED VIEW localized_organizations',
        {
            transaction,
        },
    );
    return transaction.commit();
};
