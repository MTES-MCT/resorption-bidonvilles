module.exports = {
    async up(queryInterface) {
        await queryInterface.sequelize.query(
            'UPDATE field_types SET label = \'Autre\' WHERE label = \'Inconnu\'',
        );
    },
    async down(queryInterface) {
        await queryInterface.sequelize.query(
            'UPDATE field_types SET label = \'Inconnu\' WHERE label = \'Autre\'',
        );
    },
};
