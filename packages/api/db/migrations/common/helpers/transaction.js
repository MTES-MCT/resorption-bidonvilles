module.exports = async function runWithinTransaction(queryInterface, callback) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
        await callback(transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
