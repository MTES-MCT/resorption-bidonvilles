const parser = require('neat-csv');
const fs = require('fs');
const path = require('path');
const { sequelize } = require('../models');

/**
 * Updates latitude and longitude values for each departement
 */
function updateLatLongDepartements() {
    return parser(
        fs.readFileSync(path.resolve(__dirname, '..', 'data/deptartements-with-lat-and-lon.csv'), { encoding: 'utf8' }),
        {
            headers: ['code', 'name', 'latitude', 'longitude'],
            separator: ';',
        },
    )
        .then(cities => Promise.all(
            cities.map(city => sequelize.query(`UPDATE "cities" SET latitude = ${city.latitude},  longitude = ${city.longitude} WHERE code = '${city.code}'`)),
        ));
}

function revertUpdateLatLongDepartements() {
    return parser(
        fs.readFileSync(path.resolve(__dirname, '..', 'data/departements-with-lat-and-lon-origin.csv'), { encoding: 'utf8' }),
        {
            headers: ['code', 'name', 'latitude', 'longitude'],
            separator: ';',
        },
    )
        .then(cities => Promise.all(
            cities.map(city => sequelize.query(`UPDATE "cities" SET latitude = ${city.latitude},  longitude = ${city.longitude} WHERE code = '${city.code}'`)),
        ));
}

module.exports = {
    up: (queryInterface, Sequelize) => updateLatLongDepartements(queryInterface, Sequelize),
    down: (queryInterface, Sequelize) => revertUpdateLatLongDepartements(queryInterface, Sequelize),
};
