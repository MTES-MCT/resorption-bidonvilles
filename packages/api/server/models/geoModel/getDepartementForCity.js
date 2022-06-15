const sequelize = require('#db/sequelize');

module.exports = async (code) => {
    const departement = await sequelize.query(
        `SELECT * FROM departements
         WHERE code = (SELECT fk_departement FROM cities
         WHERE code = :code);`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                code,
            },
        },
    );

    return departement.length > 0 ? departement[0] : null;
};
