module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        'UPDATE action_finance_types SET name = REPLACE(REPLACE(name, \'Financements\', \'Financement\'), \'étatiques\', \'étatique\')',
    ),
    down: queryInterface => queryInterface.sequelize.query(
        'UPDATE action_finance_types SET name = REPLACE(REPLACE(name, \'Financement\', \'Financements\'), \'étatique\', \'étatiques\')',
    ),
};
