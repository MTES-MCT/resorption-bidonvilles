const parser = require('neat-csv');
const fs = require('fs');
const path = require('path');

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => parser(
            fs.readFileSync(path.resolve(__dirname, '..', 'data/regions-with-fk_city.csv'), { encoding: 'utf8' }),
            {
                headers: ['code', 'name', 'fk_city'],
                separator: ';',
            },
        )
            .then(regions => Promise.all(
                regions.map(region => queryInterface.sequelize.query(
                    `UPDATE "regions" SET fk_city = '${region.fk_city}' WHERE code = '${region.code}'`,
                    { transaction },
                )),
            ))
            .then(() => queryInterface.changeColumn(
                'regions',
                'fk_city',
                {
                    type: Sequelize.STRING(5),
                    allowNull: false,
                },
                {
                    transaction,
                },
            )),
    ),

    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.changeColumn(
            'regions',
            'fk_city',
            {
                type: Sequelize.STRING(5),
                allowNull: true,
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query('UPDATE regions SET fk_city = null', { transaction })),
    ),
};
