module.exports = database => ({
    findAll: () => database.query(
        `SELECT
            plan_types.plan_type_id AS id,
            plan_types.label AS label
        FROM plan_types`,
        {
            type: database.QueryTypes.SELECT,
        },
    ),
});
