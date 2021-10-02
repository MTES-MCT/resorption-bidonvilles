const { sequelize } = require('#db/models');

module.exports = async (organizationId) => {
    const transaction = await sequelize.transaction();

    await sequelize.query('UPDATE organizations SET fk_type = (SELECT organization_type_id FROM organization_types WHERE uid = \'intervenant\') WHERE organization_id = :organizationId', {
        replacements: {
            organizationId,
        },
        transaction,
    });
    await sequelize.query('REFRESH MATERIALIZED VIEW localized_organizations',
        {
            transaction,
        });

    return transaction.commit();
};
