module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'INSERT INTO entities(name) VALUES(\'covid_comment\')',
            {
                transaction,
            },
        )
        .then(() => queryInterface.sequelize.query(
            'INSERT INTO features(name, fk_entity) VALUES(\'list\', \'covid_comment\')',
            {
                transaction,
            },
        ))
        .then(() => {
            const roles = [
                { type: 'regular', value: 'direct_collaborator' },
                { type: 'regular', value: 'collaborator' },
                { type: 'regular', value: 'association' },
                { type: 'regular', value: 'national_establisment' },
                { type: 'admin', value: 'local_admin' },
                { type: 'admin', value: 'national_admin' },
            ];
            const promises = roles.map(({ type, value }) => queryInterface.sequelize.query(
                `INSERT INTO
                    permissions(fk_role_regular, fk_role_admin, fk_feature, fk_entity, allowed, fk_geographic_level)
                VALUES
                    (:regular, :admin, 'list', 'covid_comment', true, 'local')
                RETURNING permission_id AS id`,
                {
                    replacements: {
                        regular: type === 'regular' ? value : null,
                        admin: type === 'admin' ? value : null,
                    },
                    transaction,
                },
            ));
            return Promise.all(promises);
        })
        .then((response) => {
            const permissionIds = response.map(r => r[0][0].id);
            return Promise.all(
                permissionIds
                    .map(id => queryInterface.sequelize.query(
                        `INSERT INTO
                            covid_comment_permissions(fk_permission)
                        VALUES
                            (:id)`,
                        {
                            replacements: {
                                id,
                            },
                            transaction,
                        },
                    )),
            );
        }),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.bulkDelete(
            'permissions',
            {
                fk_entity: 'covid_comment',
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.bulkDelete(
                'features',
                {
                    fk_entity: 'covid_comment',
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.bulkDelete(
                'entities',
                {
                    name: 'covid_comment',
                },
                {
                    transaction,
                },
            )),
    ),

};
