import { sequelize } from '#db/sequelize';
import { type Transaction } from 'sequelize';
import createOrganizationType from '#server/models/organizationTypeModel/create';
import createOrganization from '#server/models/organizationModel/create';
import findOrganizationById from '#server/models/organizationModel/findOneById';
import { type OrganizationRaw } from '#server/models/organizationModel/findByIds';
import ServiceError from '#server/errors/ServiceError';

type OrganizationCreateInput = {
    name: string,
    abbreviation: string | null,
    intervention_areas: { type: 'city' | 'epci' | 'departement' | 'region', code: string }[],
} & ({
    type: number,
    new_type_category: null,
    new_type_name: null,
    new_type_abbreviation: null,
    new_type_default_role: null,
} | {
    type: 'new',
    new_type_category: string,
    new_type_name: string,
    new_type_abbreviation: string | null,
    new_type_default_role: string,
});

function createNewOrganizationType(createdBy: number, input: OrganizationCreateInput, transaction: Transaction): Promise<number> {
    if (input.type !== 'new') {
        return Promise.resolve(input.type);
    }

    return createOrganizationType(
        createdBy,
        {
            category: input.new_type_category,
            name: input.new_type_name,
            abbreviation: input.new_type_abbreviation,
            default_role: input.new_type_default_role,
        },
        transaction,
    );
}

export default async (createdBy: number, input: OrganizationCreateInput): Promise<OrganizationRaw> => {
    const transaction = await sequelize.transaction();
    let organization: OrganizationRaw;

    try {
        const typeId = await createNewOrganizationType(createdBy, input, transaction);
        const organizationId = await createOrganization(createdBy, {
            type: typeId,
            name: input.name,
            abbreviation: input.abbreviation,
            intervention_areas: input.intervention_areas,
        }, transaction);

        organization = await findOrganizationById(organizationId, transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('database_error', error);
    }

    return organization;
};
