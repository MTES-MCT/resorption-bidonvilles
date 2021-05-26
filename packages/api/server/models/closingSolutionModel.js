module.exports = database => ({
    findAll: () => database.query(
        `SELECT
            closing_solutions.closing_solution_id AS id,
            closing_solutions.label AS label
        FROM closing_solutions`,
        {
            type: database.QueryTypes.SELECT,
        },
    ),
});
