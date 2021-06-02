const parser = require('neat-csv');
const fs = require('fs');
const path = require('path');
const { sequelize } = require('../models');

/**
 * Sets a value for each city's latitude and longitude
 */
function fillCitiesWithLatitudelongitude() {
    return parser(
        fs.readFileSync(path.resolve(__dirname, '..', 'data/cities-with-lat-and-lon.csv'), { encoding: 'utf8' }),
        {
            headers: ['code', 'codepostal', 'nom', 'latitude', 'longitude'],
            separator: ';',
        },
    )
        .then(async (cities) => {
            for (let i = 0; i < cities.length; i += 100) {
                /* eslint-disable no-await-in-loop */
                await Promise.all(
                    cities.slice(i, i + 100).map(city => sequelize.query(`UPDATE "cities" SET latitude = ${city.latitude},  longitude = ${city.longitude} WHERE code = '${city.code}'`)),
                );
            }
            return cities;
        });
}

module.exports = {
    up: (queryInterface, Sequelize) => fillCitiesWithLatitudelongitude(queryInterface, Sequelize),
    down: queryInterface => queryInterface.sequelize.query('UPDATE cities set latitude = null, longitude = null ;'),
};
