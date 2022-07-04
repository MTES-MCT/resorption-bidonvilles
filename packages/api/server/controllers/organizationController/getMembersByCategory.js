const userModel = require('#server/models/userModel');

module.exports = async (req, res) => {
    let geographicFilter;
    if (req.query.departementId !== undefined) {
        geographicFilter = {
            type: 'departement',
            value: req.query.departementId,
        };
    } else if (req.query.regionId !== undefined) {
        geographicFilter = {
            type: 'region',
            value: req.query.regionId,
        };
    }

    const search = [];
    if (req.query.q !== undefined) {
        search.push({
            first_name: {
                query: 'users.first_name',
                operator: 'ILIKE',
                value: `${req.query.q}%`,
            },
            last_name: {
                query: 'users.last_name',
                operator: 'ILIKE',
                value: `${req.query.q}%`,
            },
            organization_name: {
                query: 'organizations.name',
                operator: 'ILIKE',
                value: `${req.query.q}%`,
            },
            organization_abbreviation: {
                query: 'organizations.abbreviation',
                operator: 'ILIKE',
                value: `${req.query.q}%`,
            },
        });
    }

    return res.status(200).send({
        success: true,
        response: {
            users: await userModel.findByOrganizationCategory(
                req.params.categoryId,
                geographicFilter,
                {},
                search,
            ),
        },
    });
};
