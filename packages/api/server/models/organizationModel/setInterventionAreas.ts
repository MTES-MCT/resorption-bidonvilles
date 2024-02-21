import { type Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import { InputInterventionArea } from '#root/types/inputs/InterventionArea.d';

export default async (organizationId: number, interventionAreas: InputInterventionArea[], argTransaction?: Transaction): Promise<void> => {
    const isLocalTransaction = argTransaction === undefined;
    let transaction = argTransaction;
    if (isLocalTransaction) {
        transaction = await sequelize.transaction();
    }

    try {
        await sequelize.query(
            'DELETE FROM intervention_areas WHERE fk_organization = :organizationId AND is_main_area IS TRUE',
            {
                replacements: {
                    organizationId,
                },
                transaction,
            },
        );
        if (interventionAreas.length === 0) {
            throw new Error('Cannot set an empty list of areas for an organization');
        }

        await sequelize.getQueryInterface().bulkInsert(
            'intervention_areas',
            interventionAreas.map(({ type, code }) => ({
                fk_organization: organizationId,
                is_main_area: true,
                type,
                fk_region: type === 'region' ? code : null,
                fk_departement: type === 'departement' ? code : null,
                fk_epci: type === 'epci' ? code : null,
                fk_city: type === 'city' ? code : null,
            })),
            { transaction },
        );

        if (isLocalTransaction) {
            await transaction.commit();
        }
    } catch (error) {
        if (isLocalTransaction) {
            await transaction.rollback();
        }

        throw error;
    }
};
