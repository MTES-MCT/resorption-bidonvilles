module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        const response = await queryInterface.sequelize.query(
            'SELECT organization_type_id FROM organization_types WHERE uid = \'organisme_prive\'',
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
                transaction,
            },
        );

        let organizationTypeId;
        if (response.length === 0) {
            await queryInterface.sequelize.query(
                `INSERT INTO organization_categories(uid, name_singular, name_plural)
                VALUES('private_organization', 'Organisme privé', 'Organismes privés')`,
                {
                    type: queryInterface.sequelize.QueryTypes.INSERT,
                    transaction,
                },
            );

            [[{ organization_type_id: organizationTypeId }]] = await queryInterface.sequelize.query(
                `INSERT INTO organization_types(name_singular, name_plural, fk_category, fk_role, uid)
                VALUES('Organisme privé', 'Organismes privés', 'private_organization', 'collaborator', 'organisme_prive')
                RETURNING organization_type_id`,
                {
                    type: queryInterface.sequelize.QueryTypes.INSERT,
                    transaction,
                },
            );
        } else {
            organizationTypeId = response[0].organization_type_id;
        }

        await queryInterface.bulkInsert(
            'organizations',
            [{
                name: 'Institut national de la statistique et des études économiques',
                abbreviation: 'INSEE',
                active: true,
                fk_type: organizationTypeId,
                being_funded: false,
            }],
            { transaction },
        );
        await queryInterface.sequelize.query('REFRESH MATERIALIZED VIEW localized_organizations', { transaction });

        await transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.sequelize.query(
            'DELETE FROM organizations WHERE abbreviation = \'INSEE\'',
            {
                transaction,
            },
        );
        await queryInterface.sequelize.query('REFRESH MATERIALIZED VIEW localized_organizations', { transaction });

        await transaction.commit();
    },
};
