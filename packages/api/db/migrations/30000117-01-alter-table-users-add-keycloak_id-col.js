

const COLUMN_NAME = 'keycloak_id';
const TABLE_NAME = 'users';

const addKeycloakIdColumn = async (queryInterface, Sequelize, tableName) => {
    await queryInterface.addColumn(
        tableName,
        COLUMN_NAME,
        {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        },
    );
};

const removeKeycloakIdColumn = (queryInterface, tableName) => queryInterface.removeColumn(
    tableName,
    COLUMN_NAME,
);

module.exports = {
    async up(queryInterface, Sequelize) {
        await addKeycloakIdColumn(queryInterface, Sequelize, TABLE_NAME);
    },

    async down(queryInterface) {
        await removeKeycloakIdColumn(queryInterface, TABLE_NAME);
    },
};
