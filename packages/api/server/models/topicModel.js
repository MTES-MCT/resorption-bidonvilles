module.exports = database => ({
    findAll: () => database.query(
        `SELECT
            topics.uid AS uid,
            topics.name AS name
        FROM topics`,
        {
            type: database.QueryTypes.SELECT,
        },
    ),
});
