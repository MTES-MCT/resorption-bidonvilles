module.exports = {
    up: queryInterface => queryInterface.bulkInsert(
        'permission_options',
        [
            {
                uid: 'close_shantytown',
                name: 'Autoriser le partenaire à créer un site et déclarer la fermeture d\'un site',
            },
            {
                uid: 'hide_justice',
                name: 'Masquer les procédures judiciaires',
            },
            {
                uid: 'create_and_close_shantytown',
                name: 'Autoriser l\'opérateur à créer un site et déclarer la fermeture d\'un site',
            },
        ],
    ),

    down: queryInterface => queryInterface.sequelize.query(
        'DELETE FROM permission_options',
    ),
};
