const parser = require('neat-csv');
const fs = require('fs');
const path = require('path');

/**
 * Updates latitude and longitude values for each departement
 */
function updateLatLongDepartements(sequelize, filepath) {
    return sequelize.transaction(
        transaction => parser(
            fs.readFileSync(filepath, { encoding: 'utf8' }),
            {
                headers: ['code', 'name', 'latitude', 'longitude'],
                separator: ';',
            },
        )
            .then(departements => Promise.all(
                departements.map(departement => sequelize.query(
                    `UPDATE "departements" SET latitude = ${departement.latitude},  longitude = ${departement.longitude} WHERE code = '${departement.code}'`,
                    { transaction },
                )),
            )),
    );
}

module.exports = {
    up: queryInterface => updateLatLongDepartements(
        queryInterface.sequelize,
        path.resolve(__dirname, '..', 'data/departements-with-lat-and-lon.csv'),
    ),

    down: queryInterface => updateLatLongDepartements(
        queryInterface.sequelize,
        path.resolve(__dirname, '..', 'data/departements-with-lat-and-lon-origin.csv'),
    ),
};
