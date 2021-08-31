const parser = require('neat-csv');
const fs = require('fs');
const path = require('path');
const { sequelize } = require('../models');

/**
 * Adds fk_city (chief_town) values for each region
 */
function updateFkCityRegions() {
    return parser(
        fs.readFileSync(path.resolve(__dirname, '..', 'data/regions-with-fk_city.csv'), { encoding: 'utf8' }),
        {
            headers: ['code', 'name', 'fk_city'],
            separator: ';',
        },
    )
        .then(regions => Promise.all(
            regions.map(region => sequelize.query(`UPDATE "regions" SET fk_city = '${region.fk_city}' WHERE code = '${region.code}'`)),
        ));
}

module.exports = {
    up: (queryInterface, Sequelize) => updateFkCityRegions(queryInterface, Sequelize),
    down: queryInterface => queryInterface.sequelize.query('UPDATE regions set fk_city = null ;'),
};
