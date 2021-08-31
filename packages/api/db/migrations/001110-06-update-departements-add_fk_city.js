const parser = require('neat-csv');
const fs = require('fs');
const path = require('path');
const { sequelize } = require('../models');

/**
 * * Adds fk_city (chief_town) values for each departement
 */
function updateFkCityDepartements() {
    return parser(
        fs.readFileSync(path.resolve(__dirname, '..', 'data/departements-with-fk_city.csv'), { encoding: 'utf8' }),
        {
            headers: ['code', 'name', 'fk_city'],
            separator: ';',
        },
    )
        .then(departements => Promise.all(
            departements.map(departement => sequelize.query(`UPDATE "departements" SET fk_city = '${departement.fk_city}' WHERE code = '${departement.code}'`)),
        ));
}

module.exports = {
    up: (queryInterface, Sequelize) => updateFkCityDepartements(queryInterface, Sequelize),
    down: queryInterface => queryInterface.sequelize.query('UPDATE departements set fk_city = null ;'),
};
