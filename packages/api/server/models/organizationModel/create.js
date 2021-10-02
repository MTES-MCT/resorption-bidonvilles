const { sequelize } = require('#db/models');

module.exports = async (name, abbreviation = null, type, region = null, departement = null, epci = null, city = null, active = false, argTransaction = undefined) => {
    let transaction = argTransaction;
    if (transaction === undefined) {
        transaction = await sequelize.transaction();
    }

    const response = await sequelize.query(
        `INSERT INTO
        organizations(name, abbreviation, fk_type, fk_region, fk_departement, fk_epci, fk_city, active)
    VALUES
        (:name, :abbreviation, :type, :region, :departement, :epci, :city, :active)
    RETURNING organization_id AS id`,
        {
            replacements: {
                name,
                abbreviation,
                type,
                region,
                departement,
                epci,
                city,
                active,
            },
            transaction,
        },
    );
    await sequelize.query(
        'REFRESH MATERIALIZED VIEW localized_organizations',
        {
            transaction,
        },
    );

    if (argTransaction === undefined) {
        await transaction.commit();
    }

    return response;
};
