module.exports = {
    up(queryInterface) {
        return queryInterface.sequelize.query('CREATE EXTENSION unaccent');
    },

    down(queryInterface) {
        return queryInterface.sequelize.query('DROP EXTENSION unaccent');
    },
};
