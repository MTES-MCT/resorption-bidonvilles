import { sequelize } from '#db/sequelize';

export default ({
    fk_region, fk_departement, fk_epci, fk_city, closed_shantytowns, exported_by,
}) => sequelize.query(
    `INSERT INTO stats_exports(
        fk_region,
        fk_departement,
        fk_epci,
        fk_city,
        closed_shantytowns,
        exported_by
    ) VALUES (
        :fk_region,
        :fk_departement,
        :fk_epci,
        :fk_city,
        :closed_shantytowns,
        :exported_by
    )`, {
        replacements: {
            fk_region,
            fk_departement,
            fk_epci,
            fk_city,
            closed_shantytowns,
            exported_by,
        },
    },
);
