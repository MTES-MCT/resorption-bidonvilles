module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'plan_permissions',
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
                'plan_permissions',
                ['fk_permission'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_permissions_permission',
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
                `CREATE FUNCTION plan_permission_check() RETURNS trigger AS $plan_permission_check$
                    DECLARE
                        entity varchar;
                    BEGIN
                        SELECT INTO entity features.fk_entity
                        FROM permissions
                        LEFT JOIN features ON permissions.fk_feature = features.name AND permissions.fk_entity = features.fk_entity
                        WHERE permissions.permission_id = NEW.fk_permission;

                        IF entity <> 'plan' THEN
                            RAISE EXCEPTION 'the entity related to a plan_permission must be "plan"';
                        END IF;

                        RETURN NEW;
                    END;
                $plan_permission_check$ LANGUAGE plpgsql;`,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `CREATE TRIGGER plan_permission_check BEFORE INSERT OR UPDATE ON plan_permissions
                    FOR EACH ROW EXECUTE PROCEDURE plan_permission_check();`,
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP TRIGGER plan_permission_check ON plan_permissions',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'DROP FUNCTION plan_permission_check()',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_permissions',
                'fk_plan_permissions_permission',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable(
                'plan_permissions',
                {
                    transaction,
                },
            )),
    ),

};
