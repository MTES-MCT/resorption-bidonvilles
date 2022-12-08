module.exports = {
    async up(queryInterface) {
        return queryInterface.sequelize.query(
            `UPDATE closing_solutions
            SET label = 'Hébergement ou logement adapté longue durée avec accompagnement, dont espace temporaire d’insertion'
            WHERE label = 'Hébergement ou logement adapté longue durée avec accompagnement, dont espace terrain d’insertion'`,
        );
    },

    async down(queryInterface) {
        return queryInterface.sequelize.query(
            `UPDATE closing_solutions
            SET label = 'Hébergement ou logement adapté longue durée avec accompagnement, dont espace terrain d’insertion'
            WHERE label = 'Hébergement ou logement adapté longue durée avec accompagnement, dont espace temporaire d’insertion'`,
        );
    },
};
