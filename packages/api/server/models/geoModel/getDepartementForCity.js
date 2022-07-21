const sequelize = require('#db/sequelize');

module.exports = async (code) => {
    const departement = await sequelize.query(
        `SELECT departements.code, departements.name 
         FROM cities 
         LEFT JOIN departements ON cities.fk_departement = departements.code
         WHERE cities.code = :code`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                code,
            },
        },
    );

    return departement.length > 0 ? departement[0] : null;
};
