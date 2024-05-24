function addValueFromEnumSahntytownPoliceStatus(queryInterface, tableName, transaction) {
    return Promise.all([
        queryInterface.sequelize.query(
            `ALTER TYPE "enum_${tableName}_police_status" ADD VALUE 'refused' ;`,
            {
                transaction,
            },
        ),
    ]);
}


function removeValueFromEnumSahntytownPoliceStatus(queryInterface, tableName, transaction) {
    return Promise.all([
        queryInterface.sequelize.query(
            `UPDATE "${tableName}" SET police_status = NULL WHERE police_status = 'refused' ;`,
            {
                transaction,
            },
        ),

        queryInterface.sequelize.query(
            `CREATE TYPE "enum_${tableName}_police_status_new" AS ENUM (
                'none',
                'requested',
                'granted') ;`,
            {
                transaction,
            },
        ),

        queryInterface.sequelize.query(
            `ALTER TABLE "${tableName}"
                ALTER COLUMN police_status TYPE "enum_${tableName}_police_status_new"
            USING (police_status::text::"enum_${tableName}_police_status_new") ;`,
            {
                transaction,
            },
        ),

        queryInterface.sequelize.query(
            `DROP TYPE "enum_${tableName}_police_status" ;`,
            {
                transaction,
            },
        ),


        queryInterface.sequelize.query(
            `ALTER TYPE "enum_${tableName}_police_status_new" RENAME TO "enum_${tableName}_police_status" ;`,
            {
                transaction,
            },
        ),

        queryInterface.sequelize.query(
            `ALTER TABLE "${tableName}"
                ALTER COLUMN police_status TYPE "enum_${tableName}_police_status"
            USING (police_status::text::"enum_${tableName}_police_status") ;`,
            {
                transaction,
            },
        ),
    ]);
}


module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all([
                addValueFromEnumSahntytownPoliceStatus(queryInterface, 'shantytowns', transaction),
                addValueFromEnumSahntytownPoliceStatus(queryInterface, 'ShantytownHistories', transaction),
            ]);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all([
                removeValueFromEnumSahntytownPoliceStatus(queryInterface, 'shantytowns', transaction),
                removeValueFromEnumSahntytownPoliceStatus(queryInterface, 'ShantytownHistories', transaction),
            ]);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
