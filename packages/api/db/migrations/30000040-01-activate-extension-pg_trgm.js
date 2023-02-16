module.exports = {
    up(queryInterface) {
        return queryInterface.sequelize.query('CREATE EXTENSION pg_trgm');
    },

    down(queryInterface) {
        return queryInterface.sequelize.query('DROP EXTENSION pg_trgm');
    },
};
