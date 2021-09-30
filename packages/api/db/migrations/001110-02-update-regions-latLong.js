const parser = require('neat-csv');
const fs = require('fs');
const path = require('path');

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => parser(
            fs.readFileSync(path.resolve(__dirname, '..', 'data/regions-with-lat-and-lon.csv'), { encoding: 'utf8' }),
            {
                headers: ['code', 'name', 'latitude', 'longitude'],
                separator: ';',
            },
        )
            .then(regions => Promise.all(
                regions.map(region => queryInterface.sequelize.query(
                    `UPDATE "regions" SET latitude = ${region.latitude},  longitude = ${region.longitude} WHERE code = '${region.code}'`,
                    {
                        transaction,
                    },
                )),
            ))
            .then(() => Promise.all([
                queryInterface.changeColumn(
                    'regions',
                    'latitude',
                    {
                        type: Sequelize.DOUBLE,
                        allowNull: false,
                    },
                    { transaction },
                ),
                queryInterface.changeColumn(
                    'regions',
                    'longitude',
                    {
                        type: Sequelize.DOUBLE,
                        allowNull: false,
                    },
                    { transaction },
                ),
            ])),
    ),
    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.changeColumn(
                'regions',
                'latitude',
                {
                    type: Sequelize.DOUBLE,
                    allowNull: true,
                },
                { transaction },
            ),
            queryInterface.changeColumn(
                'regions',
                'longitude',
                {
                    type: Sequelize.DOUBLE,
                    allowNull: true,
                },
                { transaction },
            ),
        ])
            .then(() => queryInterface.sequelize.query('UPDATE regions set latitude = NULL, longitude = NULL', { transaction })),
    ),
};
