const parser = require('neat-csv');
const fs = require('fs');
const path = require('path');

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'regions',
        {
            code: {
                type: Sequelize.STRING(2),
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        },
    )
        .then(() => queryInterface.addConstraint('regions', ['name'], {
            type: 'unique',
            name: 'uk_regions_name',
        }))
        .then(() => parser(
            fs.readFileSync(path.join(__dirname, '..', 'data', 'regions.csv'), { encoding: 'latin1' }),
            {
                headers: ['code', 'cheflieu', 'tncc', 'ncc', 'name'],
                separator: '\t',
            },
        ))
        .then(data => queryInterface.bulkInsert(
            'regions',
            data.slice(1).map(region => ({
                code: region.code,
                name: region.name,
            })),
        )),

    down: queryInterface => queryInterface.dropTable('regions'),
};
