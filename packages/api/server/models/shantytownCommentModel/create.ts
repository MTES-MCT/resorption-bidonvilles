import { sequelize } from '#db/sequelize';
import { insertCommentTargets } from '#server/utils/comment/insertCommentTargets';

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
export default async function create(data, transaction = undefined) {
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

    await insertCommentTargets(
        shantytown_comment_id,
        data.targets,
        {
            userTargetsTable: 'shantytown_comment_user_targets',
            organizationTargetsTable: 'shantytown_comment_organization_targets',
        },
        transaction,
    );

    return shantytown_comment_id;
}
