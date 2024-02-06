import createOrganization from '#server/services/organization/create';
import { OrganizationRaw } from '#server/models/organizationModel/findByIds';

export default async (req, res) => {
    let organization: OrganizationRaw;
    try {
        organization = await createOrganization(
            req.user.id,
            {
                name: req.body.name,
                abbreviation: req.body.abbreviation,
                intervention_areas: req.body.intervention_areas,
                type: req.body.type,
                new_type_category: req.body.new_type_category,
                new_type_name: req.body.new_type_name,
                new_type_abbreviation: req.body.new_type_abbreviation,
                new_type_default_role: req.body.new_type_default_role,
            },
        );
    } catch (error) {
        return res.status(500).send({
            user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
        });
    }

    return res.status(200).send(organization);
};
