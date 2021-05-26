module.exports = database => ({
    findAll: () => database.query(
        `SELECT
            etp_types.uid AS uid,
            etp_types.name AS name
        FROM etp_types`,
        {
            type: database.QueryTypes.SELECT,
        },
    ),
});
