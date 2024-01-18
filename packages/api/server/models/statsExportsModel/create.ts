import { sequelize } from '#db/sequelize';

export default async ({
    fk_region,
    fk_departement,
    fk_epci,
    fk_city,
    closed_shantytowns,
    exported_by,
}: {
    fk_region: string,
    fk_departement: string,
    fk_epci: string,
    fk_city: string,
    closed_shantytowns: boolean,
    exported_by: number,
}): Promise<void> => {
    await sequelize.query(
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
};
