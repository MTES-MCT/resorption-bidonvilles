const parser = require('neat-csv');
const fs = require('fs');
const path = require('path');

module.exports = {
    up: queryInterface => queryInterface.dropTable('pois'),
    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'pois',
            {
                poi_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                solinum_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                solinum_created_at: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                solinum_updated_at: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                longitude: {
                    type: Sequelize.DOUBLE,
                    allowNull: false,
                },
                latitude: {
                    type: Sequelize.DOUBLE,
                    allowNull: false,
                },

                verified: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                },
                categories: {
                    type: Sequelize.ARRAY(Sequelize.TEXT),
                    allowNull: false,
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                address: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                city: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                postal_code: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },

                closed: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                },
                temporarily_closed: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                phone: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                email: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },

                temporary_information: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                temporary_hours: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                temporary_hour_start: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                temporary_hour_end: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                asile: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
                refugie: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
                family: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
                age_min: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                age_max: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                sexe: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                animals: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
                rdv_required: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
                price: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                info: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                language: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
            },
            {
                transaction,
            },
        ).then(() => parser(
            fs.readFileSync(path.join(__dirname, '..', 'data', 'poi_solinum_14_01_2021.csv'), { encoding: 'utf8' }),
        )).then((pois) => {
            const toBool = val => val === 'TRUE';

            return queryInterface.bulkInsert(
                'pois',
                pois.map((poi) => {
                    const createdAtTime = (new Date(poi.createdAt)).getTime();
                    const updatedAtTime = (new Date(poi['Mise à jour'])).getTime();

                    const createdAt = isNaN(createdAtTime) ? null : createdAtTime / 1000;
                    const updatedAt = isNaN(updatedAtTime) ? null : updatedAtTime / 1000;

                    return {
                        solinum_id: parseInt(poi['Numéro'], 10),
                        temporary_information: poi['Information temporaire'],
                        temporary_hours: poi['Horaire temporaire'],
                        temporary_hour_start: poi['Début Horaire temporaire'],
                        temporary_hour_end: poi['Fin Horaire temporaire'],
                        asile: toBool(poi.asile),
                        refugie: toBool(poi.refugie),
                        family: toBool(poi.family),
                        age_min: poi.age_min ? parseInt(poi.age_min, 10) : 0,
                        age_max: poi.age_max ? parseInt(poi.age_max, 10) : 99,
                        sexe: poi.Sexe,
                        animals: poi.animals,
                        rdv_required: toBool(poi.sur_rdv),
                        price: poi.price,
                        info: poi.conditions_other,
                        language: poi.Langues,
                        solinum_created_at: createdAt,
                        solinum_updated_at: updatedAt,
                        // // Fix mistakes between Lat & Lng in the export
                        longitude: poi.Lat,
                        latitude: poi.Lng,
                        verified: toBool(poi['Vérifié']),
                        categories: poi['Catégories'].split(',').map(text => text.trim()),
                        name: poi['Nom de la structure'],
                        address: poi.Adresse,
                        city: poi.Ville,
                        postal_code: poi['Code Postal'],
                        closed: toBool(poi['Fermé']),
                        temporarily_closed: poi['Fermeture temporaire'],
                        phone: poi['Numéro de téléphone'],
                        email: poi.Email,
                    };
                }),
                { transaction },
            );
        }),
    ),
};
