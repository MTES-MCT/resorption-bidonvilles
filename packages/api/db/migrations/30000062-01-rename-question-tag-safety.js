module.exports = {
    up : queryInterface => queryInterface.sequelize.query(
        'UPDATE question_tags SET name = \'Sécurisation des conditions de vie\' WHERE uid = \'safety\''
    ),

    down : queryInterface => queryInterface.sequelize.query(
        'UPDATE question_tags SET name = \'Stabilisation et sécurisation du site\' WHERE uid = \'safety\''
    ),
};
