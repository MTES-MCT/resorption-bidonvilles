const parser = require('neat-csv');
const fs = require('fs');
const path = require('path');

module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DELETE FROM pois',
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

                    const createdAt = Number.isNaN(createdAtTime) ? null : createdAtTime / 1000;
                    const updatedAt = Number.isNaN(updatedAtTime) ? null : updatedAtTime / 1000;

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
    down: queryInterface => queryInterface.dropTable('pois'),


};
