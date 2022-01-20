module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        // on crée la table
        await queryInterface.createTable(
            'user_permission_attachments',
            {
                fk_user_permission: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                fk_region: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                fk_departement: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                fk_epci: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                fk_city: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                fk_shantytown: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                fk_plan: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
            },
            { transaction },
        );

        // on crée toutes les contraintes
        await Promise.all([
            // les clés d'unicité (car il n'y a pas de clé primaire auto-générée)
            // en bref : pour une même permission, il ne peut pas y avoir deux fois le même attachment
            queryInterface.addConstraint(
                'user_permission_attachments',
                ['fk_user_permission', 'fk_region'],
                {
                    type: 'unique',
                    name: 'uk_user_permission_attachments_region',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'user_permission_attachments',
                ['fk_user_permission', 'fk_departement'],
                {
                    type: 'unique',
                    name: 'uk_user_permission_attachments_departement',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'user_permission_attachments',
                ['fk_user_permission', 'fk_epci'],
                {
                    type: 'unique',
                    name: 'uk_user_permission_attachments_epci',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'user_permission_attachments',
                ['fk_user_permission', 'fk_city'],
                {
                    type: 'unique',
                    name: 'uk_user_permission_attachments_city',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'user_permission_attachments',
                ['fk_user_permission', 'fk_shantytown'],
                {
                    type: 'unique',
                    name: 'uk_user_permission_attachments_shantytown',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'user_permission_attachments',
                ['fk_user_permission', 'fk_plan'],
                {
                    type: 'unique',
                    name: 'uk_user_permission_attachments_plan',
                    transaction,
                },
            ),

            // les clés étrangères
            queryInterface.addConstraint(
                'user_permission_attachments',
                ['fk_user_permission'],
                {
                    type: 'foreign key',
                    name: 'fk_user_permission_attachment_permission',
                    references: {
                        table: 'user_permissions',
                        field: 'user_permission_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'user_permission_attachments',
                ['fk_region'],
                {
                    type: 'foreign key',
                    name: 'fk_user_permission_attachment_region',
                    references: {
                        table: 'regions',
                        field: 'code',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'user_permission_attachments',
                ['fk_departement'],
                {
                    type: 'foreign key',
                    name: 'fk_user_permission_attachment_departement',
                    references: {
                        table: 'departements',
                        field: 'code',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'user_permission_attachments',
                ['fk_epci'],
                {
                    type: 'foreign key',
                    name: 'fk_user_permission_attachment_epci',
                    references: {
                        table: 'epci',
                        field: 'code',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'user_permission_attachments',
                ['fk_city'],
                {
                    type: 'foreign key',
                    name: 'fk_user_permission_attachment_city',
                    references: {
                        table: 'cities',
                        field: 'code',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'user_permission_attachments',
                ['fk_shantytown'],
                {
                    type: 'foreign key',
                    name: 'fk_user_permission_attachment_shantytown',
                    references: {
                        table: 'shantytowns',
                        field: 'shantytown_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'user_permission_attachments',
                ['fk_plan'],
                {
                    type: 'foreign key',
                    name: 'fk_user_permission_attachment_plan',
                    references: {
                        table: 'plans2',
                        field: 'plan_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ),

            // on s'assure qu'un (et un seul) attachment a été défini
            queryInterface.addConstraint(
                'user_permission_attachments',
                ['fk_region', 'fk_departement', 'fk_epci', 'fk_city', 'fk_shantytown', 'fk_plan'],
                {
                    type: 'check',
                    name: 'must_have_one_and_only_one_attachment',
                    where: {
                        [Sequelize.Op.or]: [
                            {
                                [Sequelize.Op.and]: {
                                    fk_region: { [Sequelize.Op.ne]: null },
                                    fk_departement: { [Sequelize.Op.eq]: null },
                                    fk_epci: { [Sequelize.Op.eq]: null },
                                    fk_city: { [Sequelize.Op.eq]: null },
                                    fk_shantytown: { [Sequelize.Op.eq]: null },
                                    fk_plan: { [Sequelize.Op.eq]: null },
                                },
                            },
                            {
                                [Sequelize.Op.and]: {
                                    fk_region: { [Sequelize.Op.eq]: null },
                                    fk_departement: { [Sequelize.Op.ne]: null },
                                    fk_epci: { [Sequelize.Op.eq]: null },
                                    fk_city: { [Sequelize.Op.eq]: null },
                                    fk_shantytown: { [Sequelize.Op.eq]: null },
                                    fk_plan: { [Sequelize.Op.eq]: null },
                                },
                            },
                            {
                                [Sequelize.Op.and]: {
                                    fk_region: { [Sequelize.Op.eq]: null },
                                    fk_departement: { [Sequelize.Op.eq]: null },
                                    fk_epci: { [Sequelize.Op.ne]: null },
                                    fk_city: { [Sequelize.Op.eq]: null },
                                    fk_shantytown: { [Sequelize.Op.eq]: null },
                                    fk_plan: { [Sequelize.Op.eq]: null },
                                },
                            },
                            {
                                [Sequelize.Op.and]: {
                                    fk_region: { [Sequelize.Op.eq]: null },
                                    fk_departement: { [Sequelize.Op.eq]: null },
                                    fk_epci: { [Sequelize.Op.eq]: null },
                                    fk_city: { [Sequelize.Op.ne]: null },
                                    fk_shantytown: { [Sequelize.Op.eq]: null },
                                    fk_plan: { [Sequelize.Op.eq]: null },
                                },
                            },
                            {
                                [Sequelize.Op.and]: {
                                    fk_region: { [Sequelize.Op.eq]: null },
                                    fk_departement: { [Sequelize.Op.eq]: null },
                                    fk_epci: { [Sequelize.Op.eq]: null },
                                    fk_city: { [Sequelize.Op.eq]: null },
                                    fk_shantytown: { [Sequelize.Op.ne]: null },
                                    fk_plan: { [Sequelize.Op.eq]: null },
                                },
                            },
                            {
                                [Sequelize.Op.and]: {
                                    fk_region: { [Sequelize.Op.eq]: null },
                                    fk_departement: { [Sequelize.Op.eq]: null },
                                    fk_epci: { [Sequelize.Op.eq]: null },
                                    fk_city: { [Sequelize.Op.eq]: null },
                                    fk_shantytown: { [Sequelize.Op.eq]: null },
                                    fk_plan: { [Sequelize.Op.ne]: null },
                                },
                            },
                        ],
                    },
                    transaction,
                },
            ),
        ]);

        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        // on supprime toutes les contraintes
        await Promise.all([
            queryInterface.removeConstraint('user_permission_attachments', 'fk_user_permission_attachment_permission', { transaction }),
            queryInterface.removeConstraint('user_permission_attachments', 'fk_user_permission_attachment_region', { transaction }),
            queryInterface.removeConstraint('user_permission_attachments', 'fk_user_permission_attachment_departement', { transaction }),
            queryInterface.removeConstraint('user_permission_attachments', 'fk_user_permission_attachment_epci', { transaction }),
            queryInterface.removeConstraint('user_permission_attachments', 'fk_user_permission_attachment_city', { transaction }),
            queryInterface.removeConstraint('user_permission_attachments', 'fk_user_permission_attachment_shantytown', { transaction }),
            queryInterface.removeConstraint('user_permission_attachments', 'fk_user_permission_attachment_plan', { transaction }),

            queryInterface.removeConstraint('user_permission_attachments', 'uk_user_permission_attachments_region', { transaction }),
            queryInterface.removeConstraint('user_permission_attachments', 'uk_user_permission_attachments_departement', { transaction }),
            queryInterface.removeConstraint('user_permission_attachments', 'uk_user_permission_attachments_epci', { transaction }),
            queryInterface.removeConstraint('user_permission_attachments', 'uk_user_permission_attachments_city', { transaction }),
            queryInterface.removeConstraint('user_permission_attachments', 'uk_user_permission_attachments_shantytown', { transaction }),
            queryInterface.removeConstraint('user_permission_attachments', 'uk_user_permission_attachments_plan', { transaction }),

            queryInterface.removeConstraint('user_permission_attachments', 'must_have_one_and_only_one_attachment', { transaction }),
        ]);

        // on supprime la table
        await queryInterface.dropTable('user_permission_attachments', { transaction });

        return transaction.commit();
    },

};
