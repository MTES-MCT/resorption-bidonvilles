const { sequelize } = require('#db/models');
const { formatName } = require('#server/models/userModel')(sequelize);
const updateWhereClauseForPermissions = require('#server/models/common/updateWhereClauseForPermissions');

module.exports = (database) => {
    // eslint-disable-next-line global-require
    const geoModel = require('#server/models/geoModel')(database);

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

    const methods = {};

    methods.findAll = async (user) => {
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

        const rows = await database.query(
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
                type: database.QueryTypes.SELECT,
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

    methods.create = async (user, data) => database.transaction(async (transaction) => {
        // comment
        const [[{ id }]] = await database.query(
            `INSERT INTO
                    high_covid_comments(
                        description,
                        created_by
                    )
                    
                VALUES
                    (
                        :description,
                        :userId
                    )
                
                RETURNING high_covid_comment_id AS id`,
            {
                replacements: {
                    description: data.description,
                    userId: user.id,
                },
                transaction,
            },
        );

        // territories
        const query = data.departements.map(() => '(?, ?, ?)').join(', ');
        const values = data.departements.reduce((acc, code) => [...acc, id, code, user.id], []);

        return database.query(
            `INSERT INTO
                    high_covid_comment_territories(
                        fk_comment,
                        fk_departement,
                        created_by
                    )
                    
                VALUES
                    ${query}`,
            {
                replacements: values,
                transaction,
            },
        );
    });

    methods.getHistory = async (userLocation, permissions, location) => {
        // apply geographic level restrictions
        const where = [];
        const replacements = {};

        updateWhereClauseForPermissions({
            permissions,
            permission: 'covid_comment.list',
            requestedLocation: location,
            userLocation,
            whereFn: (loc) => {
                if (!loc) {
                    where.push('false');
                    return;
                }

                if (loc.type === 'nation') {
                    return;
                }

                switch (loc.type) {
                    case 'region':
                        where.push('departements.fk_region = :locationCode');
                        replacements.locationCode = loc.region.code;
                        break;

                    case 'departement':
                    case 'epci':
                    case 'city':
                        where.push('departements.code = :locationCode');
                        replacements.locationCode = loc.departement.code;
                        break;

                    default:
                }
            },
        });

        const activities = await database.query(
            `
                SELECT
                    comments.high_covid_comment_id AS "highCommentId",
                    comments.created_at AS "date",
                    author.first_name AS author_first_name,
                    author.last_name AS author_last_name,
                    author.fk_organization AS author_organization,
                    comments.description AS description,
                    departements.name AS "highCommentDptName",
                    departements.code AS "highCommentDptCode"
                FROM high_covid_comments comments
                LEFT JOIN users author ON comments.created_by = author.user_id
                LEFT JOIN high_covid_comment_territories territories ON territories.fk_comment = comments.high_covid_comment_id
                LEFT JOIN departements ON territories.fk_departement = departements.code
                ${where.length > 0 ? `WHERE (${where.join(') AND (')})` : ''}
                ORDER BY comments.created_at DESC
                `,
            {
                type: database.QueryTypes.SELECT,
                replacements,
            },
        );

        const highCovidComments = {};

        return activities
            .map((activity) => {
                if (highCovidComments[activity.highCommentId] !== undefined) {
                    highCovidComments[activity.highCommentId].highCovidComment.departements.push({
                        code: activity.highCommentDptCode,
                        name: activity.highCommentDptName,
                    });
                    return null;
                }

                const o = {
                    entity: 'comment',
                    action: 'creation',
                    date: activity.date.getTime() / 1000,
                    author: {
                        name: formatName({
                            first_name: activity.author_first_name,
                            last_name: activity.author_last_name,
                        }),
                        organization: activity.author_organization,
                    },
                    highCovidComment: {
                        description: activity.description,
                        departements: [{
                            code: activity.highCommentDptCode,
                            name: activity.highCommentDptName,
                        }],
                    },
                };

                highCovidComments[activity.highCommentId] = o;
                return o;
            })
            .filter(activity => activity !== null);
    };

    return methods;
};
