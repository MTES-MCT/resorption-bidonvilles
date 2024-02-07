import { sequelize } from '#db/sequelize';
import { LocationType } from '#server/models/geoModel/LocationType.d';
import { type Transaction } from 'sequelize';

type OrganizationCreateData = {
    type: number,
    name: string,
    abbreviation: string,
    intervention_areas: { type: LocationType, code: string | null }[],
};

export default async (createdBy: number, data: OrganizationCreateData, argTransaction?: Transaction): Promise<number> => {
    const isExternalTransaction = argTransaction !== undefined;

    let transaction: Transaction = argTransaction;
    if (!isExternalTransaction) {
        transaction = await sequelize.transaction();
    }

    const response = await sequelize.query(
        `INSERT INTO
            organizations(name, abbreviation, active, fk_type, created_by)
        VALUES
            (:name, :abbreviation, TRUE, :type, :createdBy)
        RETURNING organization_id`,
        {
            replacements: {
                name: data.name,
                abbreviation: data.abbreviation,
                type: data.type,
                createdBy,
            },
            transaction,
        },
    );

    type ReturnValue = { organization_id: number };
    const rows: ReturnValue[] = (response[0] as unknown) as ReturnValue[];
    const { organization_id: organizationId } = rows[0];

    await Promise.all(
        data.intervention_areas.map(({ type, code }) => sequelize.query(
            `INSERT INTO
                intervention_areas(fk_organization, type, is_main_area, fk_region, fk_departement, fk_epci, fk_city)
            VALUES
                (:organizationId, :type, TRUE, :region, :departement, :epci, :city)`,
            {
                replacements: {
                    organizationId,
                    type,
                    region: type === 'region' ? code : null,
                    departement: type === 'departement' ? code : null,
                    epci: type === 'epci' ? code : null,
                    city: type === 'city' ? code : null,
                },
                transaction,
            },
        )),
    );

    if (!isExternalTransaction) {
        await transaction.commit();
    }

    return organizationId;
};
