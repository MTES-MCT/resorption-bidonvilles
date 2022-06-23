

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.createTable(
            'shantytown_comment_organization_targets',
            {
                fk_organization: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                fk_comment: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },

            },
            { transaction },
        );

        // add constraints
        await Promise.all([
            queryInterface.addConstraint(
                'shantytown_comment_organization_targets',
                ['fk_organization'],
                {
                    type: 'foreign key',
                    name: 'fk_organization_comment_access',
                    references: {
                        table: 'organizations',
                        field: 'organization_id',
                    },
                    onDelete: 'cascade',
                    onUpdate: 'cascade',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'shantytown_comment_organization_targets',
                ['fk_comment'],
                {
                    type: 'foreign key',
                    name: 'fk_comment_organization',
                    references: {
                        table: 'shantytown_comments',
                        field: 'shantytown_comment_id',
                    },
                    onDelete: 'cascade',
                    onUpdate: 'cascade',
                    transaction,
                },
            ),
        ]);

        // populate shantytown_comment_organization_targets with existing comments reserved to prefectures and DDETS
        const comments = await queryInterface.sequelize.query(
            `SELECT shantytown_comments.shantytown_comment_id AS comment_id, cities.fk_departement AS departement_code, departements.fk_region AS region_code
            FROM shantytown_comments left join shantytowns ON shantytowns.shantytown_id = shantytown_comments.fk_shantytown
            LEFT JOIN cities ON cities.code = shantytowns.fk_city
            LEFT JOIN departements ON departements.code = cities.fk_departement
            WHERE private = true
            `,
            { type: queryInterface.sequelize.QueryTypes.SELECT, transaction },
        );

        await Promise.all(comments.map(({ comment_id, departement_code, region_code }) => queryInterface.sequelize.query(
            `SELECT organization_id FROM localized_organizations 
            LEFT JOIN organization_types ON organization_types.organization_type_id = localized_organizations.fk_type
            WHERE fk_role = 'direct_collaborator'
            AND ((location_type = 'region' AND localized_organizations.region_code = '${region_code}')
            OR localized_organizations.departement_code = '${departement_code}')`,
            { type: queryInterface.sequelize.QueryTypes.SELECT, transaction },
        ).then(organizations => queryInterface.bulkInsert(
            'shantytown_comment_organization_targets',
            organizations.map(({ organization_id }) => ({
                fk_organization: organization_id,
                fk_comment: comment_id,
            })),
            {
                transaction,
            },
        ))));
        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await Promise.all([
            queryInterface.removeConstraint('shantytown_comment_organization_targets', 'fk_organization_comment_access', { transaction }),
            queryInterface.removeConstraint('shantytown_comment_organization_targets', 'fk_comment_organization', { transaction }),
        ]);

        await queryInterface.dropTable('shantytown_comment_organization_targets', { transaction });

        return transaction.commit();
    },
};
