const parser = require('neat-csv');
const fs = require('fs');
const path = require('path');

/**
 * Sets a value for each city's latitude and longitude
 */
function fillCitiesWithLatitudelongitude(queryInterface) {
    return parser(
        fs.readFileSync(path.resolve(__dirname, '..', 'data/cities-with-lat-and-lon.csv'), { encoding: 'utf8' }),
        {
            headers: ['code', 'codepostal', 'nom', 'latitude', 'longitude'],
            separator: ';',
        },
    )
        .then(cities => Promise.all(
            cities.map(city => queryInterface.sequelize.query(`UPDATE "cities" SET latitude = ${city.latitude},  longitude = ${city.longitude} WHERE code = '${city.code}'`)),
        ));
}

module.exports = {
    up: (queryInterface, Sequelize) => fillCitiesWithLatitudelongitude(queryInterface, Sequelize),
    down: queryInterface => queryInterface.sequelize.query('UPDATE cities set latitude = null, longitude = null ;'),
};
