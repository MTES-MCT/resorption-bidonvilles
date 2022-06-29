const { trim } = require('validator');
const sequelize = require('#db/sequelize');
const userModel = require('#server/models/userModel');
const geoModel = require('#server/models/geoModel');
const organizationModel = require('#server/models/organizationModel')();

module.exports = async (req, res, next) => {
    // parse query
    const query = trim(req.query.query).replace(/\s+/g, ' ');
    if (query === null || query === '') {
        return res.status(400).send({
            error: {
                user_message: 'La recherche ne peut pas être vide',
            },
        });
    }

    const atoms = query.split(' ');
    const queryAtoms = atoms.map(a => `%${a}%`);

    function generateWhere(column, number) {
        let w = `${column} ILIKE ?`;
        if (number > 1) {
            w += ` AND ${column} ILIKE ?`.repeat(number - 1);
        }

        return w;
    }

    try {
        // list all organizations from users
        const users = await sequelize.query(
            `SELECT
                users.first_name,
                users.last_name,
                localized_organizations.organization_id,
                localized_organizations.abbreviation,
                localized_organizations.name,
                localized_organizations.location_type,
                localized_organizations.region_code,
                localized_organizations.region_name,
                localized_organizations.departement_code,
                localized_organizations.departement_name,
                localized_organizations.epci_code,
                localized_organizations.epci_name,
                localized_organizations.city_code,
                localized_organizations.city_name,
                organization_types.name_singular AS type_name,
                organization_types.abbreviation AS type_abbreviation
            FROM users
            LEFT JOIN localized_organizations ON users.fk_organization = localized_organizations.organization_id
            LEFT JOIN organization_types ON localized_organizations.fk_type = organization_types.organization_type_id
            WHERE
                users.fk_status = 'active'
                AND
                (
                    ${generateWhere('users.first_name', atoms.length)}
                    OR
                    ${generateWhere('users.last_name', atoms.length)}
                )
            LIMIT 10`,
            {
                replacements: [...queryAtoms, ...queryAtoms],
                type: sequelize.QueryTypes.SELECT,
            },
        );

        // look for locations
        const locations = await geoModel.search(query);

        // look for organizations
        const organizations = await sequelize.query(
            `SELECT
                localized_organizations.organization_id AS id,
                localized_organizations.abbreviation,
                localized_organizations.name,
                localized_organizations.location_type,
                localized_organizations.region_code,
                localized_organizations.region_name,
                localized_organizations.departement_code,
                localized_organizations.departement_name,
                localized_organizations.epci_code,
                localized_organizations.epci_name,
                localized_organizations.city_code,
                localized_organizations.city_name,
                organization_types.name_singular AS type_name,
                organization_types.abbreviation AS type_abbreviation
            FROM localized_organizations
            LEFT JOIN organization_types ON localized_organizations.fk_type = organization_types.organization_type_id
            WHERE
                active = TRUE
                AND
                (
                    ${generateWhere('localized_organizations.name', atoms.length)}
                    OR
                    ${generateWhere('localized_organizations.abbreviation', atoms.length)}
                )
            LIMIT 10`,
            {
                replacements: [...queryAtoms, ...queryAtoms],
                type: sequelize.QueryTypes.SELECT,
            },
        );

        const result = [];
        if (users.length > 0) {
            result.push(
                ...users.map(user => ({
                    type: {
                        id: 'user',
                        label: 'Acteurs',
                    },
                    id: user.id,
                    label: userModel.formatName(user),
                    organization: user.organization_id,
                })),
            );
        }

        if (locations.length > 0) {
            result.push(
                ...locations.map(({
                    label, type, code, name,
                }) => ({
                    type: {
                        id: 'location',
                        label: 'Territoires',
                    },
                    id: code,
                    label: `${label} - ${name}`,
                    location_type: type,
                })),
            );
        }

        if (organizations.length > 0) {
            result.push(
                ...organizations.map(organization => ({
                    type: {
                        id: 'organization',
                        label: 'Structures',
                    },
                    id: organization.id,
                    label: organizationModel.getName(organization),
                })),
            );
        }

        return res.status(200).send(result);
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de la lecture en base de données',
            },
        });
        return next(error);
    }
};
