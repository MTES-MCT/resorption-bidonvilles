module.exports = {
    async up(queryInterface) {
        await queryInterface.sequelize.query('CREATE UNIQUE INDEX localized_organizations_pkey ON localized_organizations (organization_id)');
    },

    async down(queryInterface) {
        await queryInterface.sequelize.query(
            'DROP INDEX localized_organizations_pkey',
        );
    },
};
