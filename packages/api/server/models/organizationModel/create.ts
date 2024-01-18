import { sequelize } from '#db/sequelize';
import { type Transaction } from 'sequelize';

export default async (
    type: string,
    name: string,
    abbreviation: string = null,
    region: string = null,
    departement: string = null,
    epci: string = null,
    city: string = null,
    active: boolean = false,
    transaction: Transaction = undefined,
): Promise<number> => {
    const data = await sequelize.query(
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

    type ReturnValue = { id: number };
    const rows: ReturnValue[] = (data[0] as unknown) as ReturnValue[];

    return rows[0].id;
};
