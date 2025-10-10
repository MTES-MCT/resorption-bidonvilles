module.exports = function createTransactionalSeeder(upFunction, downFunction) {
    return {
        up: queryInterface => queryInterface.sequelize.transaction(transaction => upFunction(queryInterface, transaction)),
        down: queryInterface => queryInterface.sequelize.transaction(transaction => downFunction(queryInterface, transaction)),
    };
};
