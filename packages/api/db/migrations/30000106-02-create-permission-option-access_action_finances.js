// Créer l'option permettant aux administrateurs d'accorder l'accès aux financements des actions
// pour les acteurs nationaux
module.exports = {
    up: queryInterface => queryInterface.bulkInsert(
        'permission_options',
        [
            {
                uid: 'access_action_finances',
                name: 'Accéder aux financements des actions',
            },
        ],
    ),

    down: queryInterface => queryInterface.sequelize.query(
        'DELETE FROM permission_options WHERE uid = \'access_action_finances\'',
    ),
};
