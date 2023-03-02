const sousPrefectures = require('../data/sous_prefectures_2022');

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            const [[{ organization_type_id }]] = await queryInterface.sequelize.query(
                `INSERT INTO organization_types(name_singular, name_plural, fk_category, fk_role, uid)
                VALUES('Sous-préfecture', 'Sous-préfectures', 'public_establishment', 'direct_collaborator', 'sous_pref')
                RETURNING organization_type_id`,
                {
                    type: queryInterface.sequelize.QueryTypes.INSERT,
                    transaction,
                },
            );

            const organizations = await queryInterface.sequelize.query(
                `SELECT
                    'Sous-préfecture de ' || name AS name,
                    TRUE AS active,
                    ${organization_type_id} AS fk_type,
                    fk_departement AS fk_departement,
                    FALSE AS being_funded
                FROM cities
                WHERE ${sousPrefectures.map(() => '(name = ? AND fk_departement = ?)').join(' OR ')}`,
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    replacements: sousPrefectures.map(({ city, departement }) => [city, departement]).flat(),
                    transaction,
                },
            );

            await queryInterface.bulkInsert(
                'organizations',
                organizations,
                { transaction },
            );

            await queryInterface.sequelize.query(
                'REFRESH MATERIALIZED VIEW localized_organizations',
                { transaction },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            const [{ organization_type_id }] = await queryInterface.sequelize.query(
                'SELECT organization_type_id FROM organization_types WHERE uid = \'sous_pref\'',
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            );

            await queryInterface.sequelize.query(
                'DELETE FROM organizations WHERE fk_type = :organization_type_id',
                {
                    replacements: {
                        organization_type_id,
                    },
                    transaction,
                },
            );
            await queryInterface.sequelize.query(
                'REFRESH MATERIALIZED VIEW localized_organizations',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DELETE FROM organization_types WHERE uid = \'sous_pref\'',
                { transaction },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
