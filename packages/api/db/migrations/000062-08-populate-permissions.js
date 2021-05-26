const permissions = {
    roles_admin: {
        local_admin: {
            shantytown: {
                list: { level: 'nation', data: { data_justice: true } },
                read: { level: 'nation', data: { data_justice: true } },
                create: { level: 'local', data: { data_justice: true } },
                update: { level: 'local', data: { data_justice: true } },
                close: { level: 'local', data: { data_justice: true } },
                export: { level: 'nation', data: { data_justice: true } },
            },
            shantytown_comment: {
                list: { level: 'local', data: {} },
                create: { level: 'local', data: {} },
                moderate: { level: 'local', data: {} },
            },
            plan: {
                list: { level: 'nation', data: {} },
                read: { level: 'nation', data: {} },
                create: { level: 'local', data: {} },
                update: { level: 'local', data: {} },
            },
            user: {
                list: { level: 'local', data: {} },
                read: { level: 'local', data: {} },
                create: { level: 'local', data: {} },
                activate: { level: 'local', data: {} },
                deactivate: { level: 'local', data: {} },
            },
        },
        national_admin: {
            shantytown: {
                list: { level: 'nation', data: { data_justice: true } },
                read: { level: 'nation', data: { data_justice: true } },
                create: { level: 'nation', data: { data_justice: true } },
                update: { level: 'nation', data: { data_justice: true } },
                close: { level: 'nation', data: { data_justice: true } },
                export: { level: 'nation', data: { data_justice: true } },
                delete: { level: 'nation', data: { data_justice: true } },
            },
            shantytown_comment: {
                list: { level: 'nation', data: {} },
                create: { level: 'nation', data: {} },
                moderate: { level: 'nation', data: {} },
            },
            plan: {
                list: { level: 'nation', data: {} },
                read: { level: 'nation', data: {} },
                create: { level: 'nation', data: {} },
                update: { level: 'nation', data: {} },
                delete: { level: 'nation', data: {} },
            },
            user: {
                list: { level: 'nation', data: {} },
                read: { level: 'nation', data: {} },
                create: { level: 'nation', data: {} },
                activate: { level: 'nation', data: {} },
                deactivate: { level: 'nation', data: {} },
                delete: { level: 'nation', data: {} },
            },
        },
    },
    roles_regular: {
        national_establisment: {
            shantytown: {
                list: { level: 'nation', data: { data_justice: true } },
                read: { level: 'nation', data: { data_justice: true } },
                export: { level: 'nation', data: { data_justice: true } },
            },
            plan: {
                list: { level: 'nation', data: {} },
                read: { level: 'nation', data: {} },
            },
        },
        direct_collaborator: {
            shantytown: {
                list: { level: 'nation', data: { data_justice: true } },
                read: { level: 'nation', data: { data_justice: true } },
                create: { level: 'local', data: { data_justice: true } },
                update: { level: 'local', data: { data_justice: true } },
                close: { level: 'local', data: { data_justice: true } },
                export: { level: 'nation', data: { data_justice: true } },
            },
            shantytown_comment: {
                list: { level: 'local', data: {} },
                create: { level: 'local', data: {} },
            },
            plan: {
                list: { level: 'nation', data: {} },
                read: { level: 'nation', data: {} },
                create: { level: 'local', data: {} },
                update: { level: 'local', data: {} },
            },
        },
        collaborator: {
            shantytown: {
                list: { level: 'local', data: { data_justice: true } },
                read: { level: 'local', data: { data_justice: true } },
                create: { level: 'local', data: { data_justice: true } },
                update: { level: 'local', data: { data_justice: true } },
                export: { level: 'local', data: { data_justice: true } },
            },
            plan: {
                list: { level: 'local', data: {} },
                read: { level: 'local', data: {} },
                create: { level: 'local', data: {} },
                update: { level: 'local', data: {} },
            },
        },
        association: {
            shantytown: {
                list: { level: 'local', data: { data_justice: true } },
                read: { level: 'local', data: { data_justice: true } },
                create: { level: 'local', data: { data_justice: true } },
                update: { level: 'local', data: { data_justice: true } },
                export: { level: 'local', data: { data_justice: true } },
            },
            plan: {
                list: { level: 'local', data: {} },
                read: { level: 'local', data: {} },
                create: { level: 'local', data: {} },
                update: { level: 'local', data: {} },
            },
        },
    },
};

module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        (transaction) => {
            const p = Object.keys(permissions).reduce((promises, roleType) => {
                Object.keys(permissions[roleType]).forEach((roleId) => {
                    Object.keys(permissions[roleType][roleId]).forEach((entity) => {
                        Object.keys(permissions[roleType][roleId][entity]).forEach((feature) => {
                            promises.push(
                                queryInterface.sequelize.query(
                                    `INSERT INTO
                                        permissions(fk_organization, fk_role_admin, fk_role_regular, fk_feature, fk_entity, allowed, fk_geographic_level)
                                    VALUES
                                        (NULL, :adminId, :regularId, :feature, :entity, TRUE, :level)
                                    RETURNING permission_id`,
                                    {
                                        transaction,
                                        replacements: {
                                            adminId: roleType === 'roles_admin' ? roleId : null,
                                            regularId: roleType === 'roles_regular' ? roleId : null,
                                            feature,
                                            entity,
                                            level: permissions[roleType][roleId][entity][feature].level,
                                        },
                                    },
                                )
                                    .then(([[{ permission_id: permissionId }]]) => queryInterface.bulkInsert(
                                        `${entity}_permissions`,
                                        [
                                            Object.assign({ fk_permission: permissionId }, permissions[roleType][roleId][entity][feature].data || {}),
                                        ],
                                        {
                                            transaction,
                                        },
                                    )),
                            );
                        });
                    });
                });

                return promises;
            }, []);

            return Promise.all(p);
        },
    ),

    down: queryInterface => queryInterface.bulkDelete('permissions'),

};
