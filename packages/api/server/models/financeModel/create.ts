const sequelize = require('#db/sequelize');

module.exports = (planId, year, createdBy, transaction = undefined) => sequelize.query(
    'INSERT INTO finances(fk_plan, year, created_by) VALUES (:planId, :year, :createdBy) RETURNING finance_id AS id',
    {
        replacements: {
            planId,
            year,
            createdBy,
        },
        transaction,
    },
);
