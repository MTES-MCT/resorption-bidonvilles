module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'plan_finances_permissions',
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
                'plan_finances_permissions',
                ['fk_permission'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_finances_permissions_permission',
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
                `CREATE FUNCTION plan_finances_permission_check() RETURNS trigger AS $plan_finances_permission_check$
                    DECLARE
                        entity varchar;
                    BEGIN
                        SELECT INTO entity features.fk_entity
                        FROM permissions
                        LEFT JOIN features ON permissions.fk_feature = features.name AND permissions.fk_entity = features.fk_entity
                        WHERE permissions.permission_id = NEW.fk_permission;

                        IF entity <> 'plan_finances' THEN
                            RAISE EXCEPTION 'the entity related to a plan_finances_permission must be "plan_finances"';
                        END IF;

                        RETURN NEW;
                    END;
                $plan_finances_permission_check$ LANGUAGE plpgsql;`,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `CREATE TRIGGER plan_finances_permission_check BEFORE INSERT OR UPDATE ON plan_finances_permissions
                    FOR EACH ROW EXECUTE PROCEDURE plan_finances_permission_check();`,
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP TRIGGER plan_finances_permission_check ON plan_finances_permissions',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'DROP FUNCTION plan_finances_permission_check()',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_finances_permissions',
                'fk_plan_finances_permissions_permission',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable(
                'plan_finances_permissions',
                {
                    transaction,
                },
            )),
    ),

};
