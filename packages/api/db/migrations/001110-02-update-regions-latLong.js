const parser = require('neat-csv');
const fs = require('fs');
const path = require('path');
const { sequelize } = require('../models');

/**
 * Updates latitude and longitude values for each region
 */
function updateLatLongRegions() {
    return parser(
        fs.readFileSync(path.resolve(__dirname, '..', 'data/regions-with-lat-and-lon.csv'), { encoding: 'utf8' }),
        {
            headers: ['code', 'name', 'latitude', 'longitude'],
            separator: ';',
        },
    )
        .then(regions => Promise.all(
            regions.map(region => sequelize.query(`UPDATE "regions" SET latitude = ${region.latitude},  longitude = ${region.longitude} WHERE code = '${region.code}'`)),
        ));
}

module.exports = {
    up: (queryInterface, Sequelize) => updateLatLongRegions(queryInterface, Sequelize),
    down: queryInterface => queryInterface.sequelize.query('UPDATE regions set latitude = NULL, longitude = NULL ;'),
};
