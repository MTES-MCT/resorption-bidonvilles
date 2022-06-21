const sequelize = require('#db/sequelize');

/**
 * @typedef {Object} Model_ShantytownComment_Data
 * @property {String}  description   Contenu du commentaire
 * @property {Number}  fk_shantytown `shantytown_id` du site rattaché au commentaire
 * @property {Number}  created_by    `user_id` de l'auteur du commentaire
 * @property {Boolean} private       `true` si le commentaire est privé
 */

/**
 * @param {Model_ShantytownComment_Data} data
 */
module.exports = async (data) => {
    const isPrivate = data.private || data.privateChooseTarget;
    const [[{ shantytown_comment_id }]] = await sequelize.query(
        `INSERT INTO shantytown_comments(
            description,
            fk_shantytown,
            created_by,
            private
        )
        VALUES (
            :description,
            :fk_shantytown,
            :created_by,
            :isPrivate
        )
        RETURNING shantytown_comment_id`,
        {
            replacements: { ...data, isPrivate },
        },
    );
    if (data.private) {
        const [collaborator_organizations] = await sequelize.query(
            `WITH shantytown_location AS (
                SELECT departements.code as departementCode, departements.fk_region as regionCode 
                FROM shantytowns
                LEFT JOIN cities ON shantytowns.fk_city = cities.code 
                LEFT JOIN departements ON departements.code = cities.fk_departement
                WHERE shantytowns.shantytown_id = :shantytown_id
            )
            SELECT * FROM localized_organizations lo
            LEFT JOIN organization_types ot ON ot.organization_type_id = lo.fk_type
            LEFT JOIN shantytown_location ON lo.region_code = shantytown_location.regionCode
            WHERE ot.fk_role = 'direct_collaborator'
            AND (
                lo.location_type = 'nation'
                OR (lo.location_type = 'region' AND lo.region_code = shantytown_location.regionCode)
                OR lo.departement_code = shantytown_location.departementCode
            )
            `,
            {
                replacements: { shantytown_id: data.fk_shantytown },
            },
        );
        await sequelize.getQueryInterface().bulkInsert(
            'shantytown_comment_organization_access',
            collaborator_organizations.map(organization => ({
                fk_organization: organization.organization_id,
                fk_comment: shantytown_comment_id,
            })),
        );
    }
    if (data.privateChooseTarget) {
        await Promise.all(
            [
                sequelize.getQueryInterface().bulkInsert(
                    'shantytown_comment_user_access',
                    data.targets.users.map(user => ({
                        fk_user: user.id,
                        fk_comment: shantytown_comment_id,
                    })),
                ),
                sequelize.getQueryInterface().bulkInsert(
                    'shantytown_comment_organization_access',
                    data.targets.organizations.map(organization => ({
                        fk_organization: organization.id,
                        fk_comment: shantytown_comment_id,
                    })),
                ),
            ],
        );
    }

    return shantytown_comment_id;
};
