const sequelize = require('#db/sequelize');

module.exports = (financeIds, index, type, amount, realAmount, details, createdBy, transaction = undefined) => sequelize.query(
    `INSERT INTO finance_rows(fk_finance, fk_finance_type, amount, real_amount, comments, created_by)
    VALUES (:financeId, :type, :amount, :realAmount, :comments, :createdBy)`,
    {
        replacements: {
            financeId: financeIds[index][0][0].id,
            type,
            amount,
            realAmount,
            comments: details,
            createdBy,
        },
        transaction,
    },
);
