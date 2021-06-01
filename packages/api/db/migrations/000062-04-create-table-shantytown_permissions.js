module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'shantytown_permissions',
            {
                fk_permission: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    allowNull: false,
                },
                data_justice: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: null,
                    onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addConstraint(
                'shantytown_permissions',
                ['fk_permission'],
                {
                    type: 'foreign key',
                    name: 'fk_shantytown_permissions_permission',
                    references: {
                        table: 'permissions',
                        field: 'permission_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `CREATE FUNCTION shantytown_permission_check() RETURNS trigger AS $shantytown_permission_check$
                    DECLARE
                        entity varchar;
                    BEGIN
                        SELECT INTO entity features.fk_entity
                        FROM permissions
                        LEFT JOIN features ON permissions.fk_feature = features.name AND permissions.fk_entity = features.fk_entity
                        WHERE permissions.permission_id = NEW.fk_permission;

                        IF entity <> 'shantytown' THEN
                            RAISE EXCEPTION 'the entity related to a shantytown_permission must be "shantytown"';
                        END IF;

                        RETURN NEW;
                    END;
                $shantytown_permission_check$ LANGUAGE plpgsql;`,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `CREATE TRIGGER shantytown_permission_check BEFORE INSERT OR UPDATE ON shantytown_permissions
                    FOR EACH ROW EXECUTE PROCEDURE shantytown_permission_check();`,
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP TRIGGER shantytown_permission_check ON shantytown_permissions',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'DROP FUNCTION shantytown_permission_check()',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'shantytown_permissions',
                'fk_shantytown_permissions_permission',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable(
                'shantytown_permissions',
                {
                    transaction,
                },
            )),
    ),

};
