const parser = require('neat-csv');
const fs = require('fs');
const path = require('path');

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'departements',
        {
            code: {
                type: Sequelize.STRING(3),
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            latitude: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            longitude: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            fk_region: {
                type: Sequelize.STRING(2),
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
        .then(() => Promise.all([
            queryInterface.addConstraint('departements', ['name'], {
                type: 'unique',
                name: 'uk_departements_name',
            }),
            queryInterface.addConstraint('departements', ['fk_region'], {
                type: 'foreign key',
                name: 'fk_departements_region',
                references: {
                    table: 'regions',
                    field: 'code',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
            }),
        ]))
        .then(() => Promise.all([
            parser(
                fs.readFileSync(path.join(__dirname, '..', 'data', 'departements.csv'), { encoding: 'latin1' }),
                {
                    headers: ['region', 'code', 'cheflieu', 'tncc', 'ncc', 'name'],
                    separator: '\t',
                },
            ),
            parser(
                fs.readFileSync(path.join(__dirname, '..', 'data', 'departement_centers.csv'), { encoding: 'utf8' }),
                {
                    headers: ['departement', 'latitude', 'longitude'],
                    separator: ';',
                },
            ),
        ]))
        .then(([departements, centers]) => {
            const parsedCenters = {};
            centers.slice(1).forEach((center) => {
                parsedCenters[center.departement] = {
                    latitude: center.latitude,
                    longitude: center.longitude,
                };
            });

            return queryInterface.bulkInsert(
                'departements',
                departements.slice(1).map((departement) => {
                    const center = parsedCenters[departement.code];

                    return {
                        code: departement.code,
                        name: departement.name,
                        latitude: (center && center.latitude) || 0,
                        longitude: (center && center.longitude) || 0,
                        fk_region: departement.region,
                    };
                }),
            );
        }),

    down: queryInterface => queryInterface.dropTable('departements'),
};
