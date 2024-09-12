import { sequelize } from '#db/sequelize';

/**
 * @typedef {Object} Model_ShantytownComment_Data
 * @property {String}  description   Contenu du commentaire
 * @property {Object}  targets       Cibles du commentaire
 * @property {Number}  fk_shantytown `shantytown_id` du site rattaché au commentaire
 * @property {Number}  created_by    `user_id` de l'auteur du commentaire
 */

/**
 * @param {Model_ShantytownComment_Data} data
 */
export default async (data, transaction = undefined) => {
    const [[{ shantytown_comment_id }]]: any = await sequelize.query(
        `INSERT INTO shantytown_comments(
            description,
            fk_shantytown,
            created_by
        )
        VALUES (
            :description,
            :fk_shantytown,
            :created_by
        )
        RETURNING shantytown_comment_id`,
        {
            replacements: data,
            transaction,
        },
    );

    const promises = [];
    if (data.targets.users.length > 0) {
        promises.push(
            sequelize.getQueryInterface().bulkInsert(
                'shantytown_comment_user_targets',
                data.targets.users.map(user => ({
                    fk_user: user.id,
                    fk_comment: shantytown_comment_id,
                })),
                {
                    transaction,
                },
            ),
        );
    }

    if (data.targets.organizations.length > 0) {
        promises.push(
            sequelize.getQueryInterface().bulkInsert(
                'shantytown_comment_organization_targets',
                data.targets.organizations.map(organization => ({
                    fk_organization: organization.id,
                    fk_comment: shantytown_comment_id,
                })),
                {
                    transaction,
                },
            ),
        );
    }

    if (promises.length > 0) {
        await Promise.all(promises);
    }

    return shantytown_comment_id;
};
