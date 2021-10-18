// ce fichier corrige la vue user_actual_permissions en changeant les éléments suivants:
// 1- avant, pour un utilisateur donné, cette vue retenait dans l'ordre les permissions (role_admin > organization > role_regular)
//    désormais, la vue ne retient que les permissions role_admin (s'il y en a un), ou alors les permissions (organization > role_regular)
//    (c'est fait via l'ajout de `WHERE u.fk_role IS NULL`)
// 2- prise en compte des options (user_permission_options)
const createOriginalView = require('./common/user_actual_permissions/01_create_original_view');
const createViewWithAppliedOptions = require('./common/user_actual_permissions/02_create_view_with_applied_options');

module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP VIEW user_actual_permissions',
            { transaction },
        )
            .then(() => createViewWithAppliedOptions(queryInterface, transaction)),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP VIEW user_actual_permissions',
            { transaction },
        )
            .then(() => createOriginalView(queryInterface, transaction)),
    ),

};
