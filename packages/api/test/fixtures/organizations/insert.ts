import sequelizeFactory from '#test/db/sequelize';

type OrganizationRow = {
    organization_id?: number,
    name?: string,
    abbreviation?: string,
    active?: boolean,
    fk_type?: number,
    fk_region?: string,
    fk_departement?: string,
    fk_epci?: string,
    fk_city?: string,
    created_at?: Date,
    updated_at?: Date,
    being_funded?: boolean,
    being_funded_at?: Date,
};

export default async (rows: OrganizationRow[]): Promise<void> => {
    const sequelize = sequelizeFactory();

    await sequelize.transaction(async (transaction) => {
        await sequelize
            .getQueryInterface()
            .bulkInsert(
                'organizations',
                rows.map(row => ({
                    name: 'Structure de test',
                    active: true,
                    fk_type: 1,
                    fk_departement: 35,
                    being_funded: false,
                    ...row,
                })),
                { transaction },
            );

        return sequelize.query('REFRESH MATERIALIZED VIEW localized_organizations', { transaction });
    });
};
