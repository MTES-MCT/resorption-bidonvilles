const sequelize = require('#db/sequelize');
const geoModel = require('#server/models/geoModel');

function serialize(comment) {
    return {
        id: comment.id,
        description: comment.description,
        createdAt: comment.createdAt.getTime() / 1000,
        createdBy: {
            id: comment.userId,
            firstName: comment.userFirstName,
            lastName: comment.userLastName,
            position: comment.userPosition,
            organization: comment.organizationAbbreviation || comment.organizationName,
            organizationId: comment.organizationId,
        },
        covid: {
            departements: [],
        },
    };
}

module.exports = async (user) => {
    const where = {
        prop: null,
        value: null,
    };
    switch (user.organization.location.type) {
        case 'region':
            where.prop = 'departements.fk_region';
            where.value = [user.organization.location.region.code];
            break;

        case 'departement':
            where.prop = 'departements.code';
            where.value = [user.organization.location.departement.code];
            break;

        case 'epci':
            where.prop = 'departements.code';
            where.value = (
                await geoModel.getDepartementsFor('epci', user.organization.location.epci.code)
            ).map(({ code }) => code);
            break;

        case 'city':
            where.prop = 'departements.code';
            where.value = [user.organization.location.departement.code];
            break;

        default:
        case 'nation':
    }

    const rows = await sequelize.query(
        `SELECT
            high_covid_comment_id AS id,
            description,
            comments.created_at AS "createdAt",
            departements.code AS "dptCode",
            departements.name  AS "dptName",
            users.user_id AS "userId",
            users.first_name AS "userFirstName",
            users.last_name AS "userLastName",
            users.position AS "userPosition",
            organizations.organization_id AS "organizationId",
            organizations.name AS "organizationName",
            organizations.abbreviation AS "organizationAbbreviation"
        FROM high_covid_comments comments
        LEFT JOIN high_covid_comment_territories territories ON territories.fk_comment = comments.high_covid_comment_id
        LEFT JOIN departements ON territories.fk_departement = departements.code
        LEFT JOIN users ON comments.created_by = users.user_id
        LEFT JOIN organizations ON users.fk_organization = organizations.organization_id
        ${where.prop !== null ? `WHERE ${where.prop} IN :territory` : ''}`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                territory: where.value,
            },
        },
    );

    const comments = [];
    rows.reduce((acc, row) => {
        if (acc[row.id] === undefined) {
            acc[row.id] = serialize(row);
            comments.push(acc[row.id]);
        }

        acc[row.id].covid.departements.push({
            code: row.dptCode,
            name: row.dptName,
        });
        return acc;
    }, {});

    return comments;
};
