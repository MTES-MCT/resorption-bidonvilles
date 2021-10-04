const { sequelize } = require('#db/models');

module.exports = async (departement) => {
    const rows = await sequelize.query(
        `
            SELECT 
                SUM(amount) as total, 
                year,
                finance_rows.fk_finance_type as type
            FROM finance_rows
            LEFT JOIN finances on finance_rows.fk_finance = finances.finance_id
            LEFT JOIN plans2 on finances.fk_plan = plans2.plan_id
            LEFT JOIN plan_departements on plan_departements.fk_plan = plans2.plan_id
            ${departement ? `WHERE fk_departement = '${departement}'` : ''}
            GROUP BY year, type
        `,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    // transforms rows in a mapping { 2020: {[type]: total}}
    return rows.reduce((acc, obj) => ({
        ...acc,
        [obj.year]: {
            ...(acc[obj.year] || {}),
            [obj.type]: obj.total,
        },
    }), {});
};
