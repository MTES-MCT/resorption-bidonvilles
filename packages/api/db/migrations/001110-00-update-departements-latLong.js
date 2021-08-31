const parser = require('neat-csv');
const fs = require('fs');
const path = require('path');
const { sequelize } = require('../models');

/**
 * Updates latitude and longitude values for each departement
 */
function updateLatLongDepartements() {
    return parser(
        fs.readFileSync(path.resolve(__dirname, '..', 'data/departements-with-lat-and-lon.csv'), { encoding: 'utf8' }),
        {
            headers: ['code', 'name', 'latitude', 'longitude'],
            separator: ';',
        },
    )
        .then(departements => Promise.all(
            departements.map(departement => sequelize.query(`UPDATE "departements" SET latitude = ${departement.latitude},  longitude = ${departement.longitude} WHERE code = '${departement.code}'`)),
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
        .then(departements => Promise.all(
            departements.map(departement => sequelize.query(`UPDATE "departements" SET latitude = ${departement.latitude},  longitude = ${departement.longitude} WHERE code = '${departement.code}'`)),
        ));
}

module.exports = {
    up: (queryInterface, Sequelize) => updateLatLongDepartements(queryInterface, Sequelize),
    down: (queryInterface, Sequelize) => revertUpdateLatLongDepartements(queryInterface, Sequelize),
};
