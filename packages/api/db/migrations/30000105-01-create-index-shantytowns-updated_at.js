module.exports = {
    async up(queryInterface) {
        await queryInterface.sequelize.query(`
            CREATE INDEX IF NOT EXISTS idx_shantytowns_updated_at
            ON shantytowns(updated_at)
            WHERE closed_at IS NULL;
        `);
    },

    async down(queryInterface) {
        await queryInterface.sequelize.query(
            'DROP INDEX IF EXISTS idx_shantytowns_updated_at;',
        );
    },
};
