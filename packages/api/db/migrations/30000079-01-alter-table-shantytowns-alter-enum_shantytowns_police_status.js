module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        'ALTER TYPE enum_shantytowns_police_status ADD VALUE \'refused\'',
    ),

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all([

                queryInterface.sequelize.query(
                    'UPDATE shantytowns SET police_status = NULL WHERE police_status = \'refused\';',
                    {
                        transaction,
                    },
                ),

                queryInterface.sequelize.query(
                    `CREATE TYPE enum_shantytowns_police_status_new AS ENUM (
                        'none',
                        'requested',
                        'granted');`,
                    {
                        transaction,
                    },
                ),

                queryInterface.sequelize.query(
                    `ALTER TABLE shantytowns
                        ALTER COLUMN police_status TYPE enum_shantytowns_police_status_new
                    USING (police_status::text::enum_shantytowns_police_status_new);`,
                    {
                        transaction,
                    },
                ),

                queryInterface.sequelize.query(
                    'DROP TYPE enum_shantytowns_police_status ;',
                    {
                        transaction,
                    },
                ),


                queryInterface.sequelize.query(
                    'ALTER TYPE enum_shantytowns_police_status_new RENAME TO enum_shantytowns_police_status ;',
                    {
                        transaction,
                    },
                ),

                queryInterface.sequelize.query(
                    `ALTER TABLE shantytowns
                        ALTER COLUMN police_status TYPE enum_shantytowns_police_status
                    USING (police_status::text::enum_shantytowns_police_status) ;`,
                    {
                        transaction,
                    },
                ),
            ]);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
