module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'covid_comment_permissions',
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
                'covid_comment_permissions',
                ['fk_permission'],
                {
                    type: 'foreign key',
                    name: 'fk_covid_comment_permissions_permission',
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
                `CREATE FUNCTION covid_comment_permission_check() RETURNS trigger AS $covid_comment_permission_check$
                    DECLARE
                        entity varchar;
                    BEGIN
                        SELECT INTO entity features.fk_entity
                        FROM permissions
                        LEFT JOIN features ON permissions.fk_feature = features.name AND permissions.fk_entity = features.fk_entity
                        WHERE permissions.permission_id = NEW.fk_permission;

                        IF entity <> 'covid_comment' THEN
                            RAISE EXCEPTION 'the entity related to a covid_comment_permission must be "covid_comment"';
                        END IF;

                        RETURN NEW;
                    END;
                $covid_comment_permission_check$ LANGUAGE plpgsql;`,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `CREATE TRIGGER covid_comment_permission_check BEFORE INSERT OR UPDATE ON covid_comment_permissions
                    FOR EACH ROW EXECUTE PROCEDURE covid_comment_permission_check();`,
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP TRIGGER covid_comment_permission_check ON covid_comment_permissions',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'DROP FUNCTION covid_comment_permission_check()',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'covid_comment_permissions',
                'fk_covid_comment_permissions_permission',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable(
                'covid_comment_permissions',
                {
                    transaction,
                },
            )),
    ),

};
