const parser = require('neat-csv');
const fs = require('fs');
const path = require('path');

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => parser(
            fs.readFileSync(path.resolve(__dirname, '..', 'data/departements-with-fk_city.csv'), { encoding: 'utf8' }),
            {
                headers: ['code', 'name', 'fk_city'],
                separator: ';',
            },
        )
            .then(departements => Promise.all(
                departements.map(departement => queryInterface.sequelize.query(
                    `UPDATE "departements" SET fk_city = '${departement.fk_city}' WHERE code = '${departement.code}'`,
                    { transaction },
                )),
            ))
            .then(() => queryInterface.changeColumn(
                'departements',
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
            'departements',
            'fk_city',
            {
                type: Sequelize.STRING(5),
                allowNull: true,
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query('UPDATE departements SET fk_city = null', { transaction })),
    ),
};
