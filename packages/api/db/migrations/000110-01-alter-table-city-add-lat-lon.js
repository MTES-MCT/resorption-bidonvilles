/**
 * Adds a column latitude to cities
 */
function addLatitudeColumnToCities(queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'cities',
        'latitude', {
            type: Sequelize.DOUBLE,
            allowNull: true,
        },
    );
}

/**
 * Adds a column longitude to cities
 */
function addLongitudeColumnToCities(queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'cities',
        'longitude', {
            type: Sequelize.DOUBLE,
            allowNull: true,
        },
    );
}

module.exports = {
    up(queryInterface, Sequelize) {
        return Promise.all([
            addLatitudeColumnToCities(queryInterface, Sequelize),
            addLongitudeColumnToCities(queryInterface, Sequelize),
        ]);
    },

    down(queryInterface) {
        return Promise.all([
            queryInterface.removeColumn('cities', 'latitude'),
            queryInterface.removeColumn('cities', 'longitude'),
        ]);
    },
};
