module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'stats_permissions',
            {
                fk_permission: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
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
                'stats_permissions',
                ['fk_permission'],
                {
                    type: 'foreign key',
                    name: 'fk_stats_permissions_permission',
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
                `CREATE FUNCTION stats_permission_check() RETURNS trigger AS $stats_permission_check$
                    DECLARE
                        entity varchar;
                    BEGIN
                        SELECT INTO entity features.fk_entity
                        FROM permissions
                        LEFT JOIN features ON permissions.fk_feature = features.name AND permissions.fk_entity = features.fk_entity
                        WHERE permissions.permission_id = NEW.fk_permission;

                        IF entity <> 'stats' THEN
                            RAISE EXCEPTION 'the entity related to a stats_permission must be "stats"';
                        END IF;

                        RETURN NEW;
                    END;
                $stats_permission_check$ LANGUAGE plpgsql;`,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `CREATE TRIGGER stats_permission_check BEFORE INSERT OR UPDATE ON stats_permissions
                    FOR EACH ROW EXECUTE PROCEDURE stats_permission_check();`,
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP TRIGGER stats_permission_check ON stats_permissions',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'DROP FUNCTION stats_permission_check()',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'stats_permissions',
                'fk_stats_permissions_permission',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable(
                'stats_permissions',
                {
                    transaction,
                },
            )),
    ),

};
