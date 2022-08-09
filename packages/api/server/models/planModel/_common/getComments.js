const sequelize = require('#db/sequelize');
const serializeComment = require('./serializeComment');

module.exports = async (user, planIds) => {
    const comments = planIds.reduce((acc, id) => Object.assign({}, acc, {
        [id]: [],
    }), {});

    if (!user.isAllowedTo('list', 'plan_comment')) {
        return comments;
    }

    const rows = await sequelize.query(
        `
        SELECT
            plan_comments.plan_comment_id AS "commentId",
            plan_comments.fk_plan AS "planId",
            plan_comments.description AS "commentDescription",
            plan_comments.created_at AS "commentCreatedAt",
            plan_comments.created_by AS "commentCreatedBy",
            users.first_name AS "userFirstName",
            users.last_name AS "userLastName",
            users.position AS "userPosition",
            organizations.organization_id AS "organizationId",
            organizations.name AS "organizationName",
            organizations.abbreviation AS "organizationAbbreviation"
        FROM plan_comments
        LEFT JOIN users ON plan_comments.created_by = users.user_id
        LEFT JOIN organizations ON users.fk_organization = organizations.organization_id
        WHERE
            plan_comments.fk_plan IN (:ids) 
        ORDER BY plan_comments.created_at DESC`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                ids: planIds,
                userId: user.id,
                organizationId: user.organization.id,
            },
        },
    );

    rows.forEach((comment) => {
        comments[comment.planId].push(
            serializeComment(comment),
        );
    }, {});

    return comments;
};
