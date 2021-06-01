module.exports = {

    up: (queryInterface) => {
        const permissions = [
            { type: 'feature', name: 'createTown' },
            { type: 'feature', name: 'updateTown' },
            { type: 'feature', name: 'deleteTown' },
            { type: 'feature', name: 'readComment' },
            { type: 'feature', name: 'createComment' },
            { type: 'feature', name: 'updateComment' },
            { type: 'feature', name: 'deleteComment' },
        ];

        return queryInterface.sequelize.query(
            `INSERT INTO permissions(type, name) VALUES (${permissions.map((name, index) => `:type${index}, :name${index}`).join('),(')})`,
            {
                replacements: permissions.reduce(
                    (map, permission, index) => Object.assign(map, {
                        [`type${index}`]: permission.type,
                        [`name${index}`]: permission.name,
                    }),
                    {},
                ),
            },
        ).then(() => Promise.all([
            queryInterface.sequelize.query(
                'SELECT role_id, name FROM roles',
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                },
            ),
            queryInterface.sequelize.query(
                'SELECT permission_id, name FROM permissions',
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                },
            ),
        ])).then(data => ({
            roles: data[0].reduce((hash, role) => Object.assign(hash, {
                [role.name]: role,
            }), {}),
            permissions: data[1].reduce((hash, permission) => Object.assign(hash, {
                [permission.name]: permission,
            }), {}),
        })).then((data) => {
            const permissionsByRole = {
                superadmin: [
                    'createTown',
                    'updateTown',
                    'deleteTown',
                    'readComment',
                    'createComment',
                    'updateComment',
                    'deleteComment',
                ],
                admin: [
                    'createTown',
                    'updateTown',
                    'readComment',
                    'createComment',
                    'updateComment',
                    'deleteComment',
                ],
            };

            const replacements = {};
            let index = 1;
            const values = Object.keys(permissionsByRole).reduce((list, role) => [
                ...list,
                ...permissionsByRole[role].map((permission) => {
                    replacements[`role${index}`] = data.roles[role].role_id;
                    replacements[`permission${index}`] = data.permissions[permission].permission_id;
                    const value = `(:role${index}, :permission${index})`;
                    index += 1;
                    return value;
                }),
            ], []);

            return queryInterface.sequelize.query(
                `INSERT INTO role_permissions(fk_role, fk_permission) VALUES ${values.join(',')}`,
                {
                    replacements,
                },
            );
        });
    },

    down: queryInterface => queryInterface.sequelize.query('DELETE FROM permissions'),
};
