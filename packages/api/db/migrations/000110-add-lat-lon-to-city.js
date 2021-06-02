// const parser = require('neat-csv');
// const fs = require('fs');
// const path = require('path');
// const { sequelize } = require('../models');

/**
 * Adds a column latitude to cities
 */
function addLatitudeColumnToCities(queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'cities',
        'latitude', {
            type: Sequelize.DOUBLE,
            allowNull: true,
        },
    );
}

/**
 * Adds a column longitude to cities
 */
function addLongitudeColumnToCities(queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'cities',
        'longitude', {
            type: Sequelize.DOUBLE,
            allowNull: true,
        },
    );
}

/**
 * Sets a value for each city's latitude
 */
//  function fillCitiesWithLatitude() {
//     return parser(
//         fs.readFileSync(path.resolve(__dirname, '..', 'data/cities-with-lat-and-lon.csv'), { encoding: 'utf8' }),
//         {
//             headers: ['code', 'codepostal', 'nom', 'latitude', 'longitude'],
//             separator: ';',
//         },
//     )
//         .then(cities => cities.filter(city => city.epciName !== 'Sans objet'))
//         .then(async (cities) => {
//             for (let i = 0; i < cities.length; i += 100) {
//                 /* eslint-disable no-await-in-loop */
//                 await Promise.all(
//                     cities.slice(i, i + 100).map(city => sequelize.query(`UPDATE "cities" SET latitude = ${city.latitude}, longitude = ${city.longitude} WHERE code = '${city.code}'`)),
//                 );
//             }

//             return cities;
//         })
//         .then(() => sequelize.query('UPDATE cities SET fk_departement = main.fk_departement FROM cities AS main WHERE cities.fk_main = main.code;'));
// }

module.exports = {
    up(queryInterface, Sequelize) {
        return Promise.all([
            addLatitudeColumnToCities(queryInterface, Sequelize),
            addLongitudeColumnToCities(queryInterface, Sequelize),
        ]);
    },

    down(queryInterface) {
        return Promise.all([
            queryInterface.removeColumn('cities', 'latitude'),
            queryInterface.removeColumn('cities', 'longitude'),
        ]);
    },
};
