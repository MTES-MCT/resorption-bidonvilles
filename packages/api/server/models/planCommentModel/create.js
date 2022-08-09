const sequelize = require('#db/sequelize');

/**
 * @typedef {Object} Model_PlanComment_Data
 * @property {String}  description   Contenu du commentaire
 * @property {Number}  fk_plan `plan_id` de l'action rattachée au commentaire
 * @property {Number}  created_by    `user_id` de l'auteur du commentaire
 */

/**
 * @param {Model_PlanComment_Data} data
 */
module.exports = async data => sequelize.transaction(async (transaction) => {
    const [[{ plan_comment_id }]] = await sequelize.query(
        `INSERT INTO plan_comments(
            description,
            fk_plan,
            created_by
        )
        VALUES (
            :description,
            :fk_plan,
            :created_by
        )
        RETURNING plan_comment_id`,
        {
            replacements: data,
        },
        transaction,
    );

    return plan_comment_id;
});
