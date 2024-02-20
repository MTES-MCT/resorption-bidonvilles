

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.createTable(
            'shantytown_comment_organization_targets',
            {
                fk_organization: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                fk_comment: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
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
                'shantytown_comment_organization_targets', {
                    fields: ['fk_organization'],
                    type: 'foreign key',
                    name: 'fk_organization_comment_access',
                    references: {
                        table: 'organizations',
                        field: 'organization_id',
                    },
                    onDelete: 'restrict',
                    onUpdate: 'cascade',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'shantytown_comment_organization_targets', {
                    fields: ['fk_comment'],
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
        const targets = await queryInterface.sequelize.query(
            `
            -- on récupère la liste des préfectures de département et DDETS, groupée par département
            WITH departement_orgs AS (SELECT departement_code, array_agg(organization_id) AS organizations
            FROM localized_organizations
            WHERE fk_type IN (SELECT organization_type_id FROM organization_types WHERE uid IN ('pref_departement', 'ddets'))
            GROUP BY departement_code),

            -- on récupère la liste des préfectures de région, groupée par région
            region_orgs AS (SELECT region_code, array_agg(organization_id) AS organizations
            FROM localized_organizations
            WHERE fk_type IN (SELECT organization_type_id FROM organization_types WHERE uid = 'pref_region')
            GROUP BY region_code)

            -- pour chaque commentaire "privé" (réservé aux préfs et DDETS), on récupère la liste des préfs et DDETS correspondant à la localisation
            SELECT
                sc.shantytown_comment_id,
                deo.organizations || ro.organizations AS organizations
            FROM shantytown_comments sc
            LEFT JOIN shantytowns s ON sc.fk_shantytown = s.shantytown_id
            LEFT JOIN cities c ON s.fk_city = c.code
            LEFT JOIN departements d ON c.fk_departement = d.code
            LEFT JOIN departement_orgs deo ON deo.departement_code = d.code
            LEFT JOIN region_orgs ro ON ro.region_code = d.fk_region
            WHERE sc.private IS TRUE`,
            {
                type: Sequelize.QueryTypes.SELECT,
                transaction,
            },
        );

        if (targets.length > 0) {
            await queryInterface.bulkInsert(
                'shantytown_comment_organization_targets',
                targets.map(({ shantytown_comment_id, organizations }) => organizations.map(organization_id => ({
                    fk_organization: organization_id,
                    fk_comment: shantytown_comment_id,
                }))).flat(),
                { transaction },
            );
        }

        await transaction.commit();
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
