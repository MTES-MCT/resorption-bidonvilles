module.exports = {

    up: queryInterface => queryInterface.renameTable('plan_shantytowns', 'plan_details'),

    down: queryInterface => queryInterface.renameTable('plan_details', 'plan_shantytowns'),

};
