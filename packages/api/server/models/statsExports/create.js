const sequelize = require('#db/sequelize');

module.exports = async ({
    fk_region, fk_departement, fk_epci, fk_city, closed_shantytowns, exported_by,
}, transaction = undefined) => {
    await sequelize.query(
        `INSERT INTO stats_exports(
            fk_region,
            fk_departement,
            fk_epci,
            fk_city,
            closed_shantytowns,
            exported_by,
        ) VALUES (
            :fk_region,
            :fk_departement,
            :fk_epci,
            :fk_city,
            :closed_shantytowns,
            :exported_by,
        ) RETURNING user_access_id AS id`, {
            replacements: {
                fk_region,
                fk_departement,
                fk_epci,
                fk_city,
                closed_shantytowns,
                exported_by,
            },
            transaction,
        },
    );
};
