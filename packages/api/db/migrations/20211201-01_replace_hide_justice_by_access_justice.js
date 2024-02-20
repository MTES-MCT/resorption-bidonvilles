const createUserActualPermissionsNewSchema = require('./common/user_actual_permissions/04_replace_hide_justice_by_access_justice');
const createViewWithoutOrganization = require('./common/user_actual_permissions/03_create_view_without_organization');

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        // On crée l'option de permission 'access_justice'
        transaction => queryInterface.sequelize.query(
            'INSERT INTO permission_options(uid, name) VALUES(\'access_justice\', \'Accéder aux procédures judiciaires\')',
            {
                transaction,
            },
        )
            // On filtre tous les utilisateurs qui ont le droit d'accès aux procédures judiciaires par leur rôle
            // et qui ne sont pas listés dans les options de permissions avec 'hide_justice'
            .then(() => queryInterface.sequelize.query(
                `SELECT
                        u.user_id
                FROM
                        users u
                WHERE
                        u.user_id
                NOT IN
                    (
                    SELECT
                            upo.fk_user 
                    FROM
                            user_permission_options upo
                    WHERE
                            upo.fk_option = 'hide_justice'
                    )
                AND
                    u.fk_role_regular IN ('collaborator', 'association', 'intervener')`,
                { type: queryInterface.sequelize.QueryTypes.SELECT, transaction },
            ))
            // On crée pour les utilisateurs listés plus haut l'option 'access_justice'
            .then(((rows) => {
                if (rows.length > 0) {
                    queryInterface.bulkInsert(
                        'user_permission_options',
                        rows.map(({
                            user_id,
                        }) => ({
                            fk_user: user_id,
                            fk_option: 'access_justice',
                        })),
                        {
                            transaction,
                        },
                    );
                }

                const { Op } = Sequelize;
                // On supprime les permissions accordées aux utilisateurs qui ont le droit d'accès aux procédures judiciaires par leur rôle
                // car c'est l'option de permissions 'access_justice' qui permet l'ovtroi du droit d'accès aux PJ
                queryInterface.bulkDelete(
                    'permissions',
                    rows.map(({
                        user_id,
                    }) => ({
                        [Op.and]: [
                            {
                                fk_entity: {
                                    [Op.like]: 'shantytown_justice',
                                },
                            },
                            {
                                fk_feature: {
                                    [Op.like]: 'access',
                                },
                            },
                            {
                                fk_user: {
                                    [Op.eq]: user_id,
                                },
                            },
                        ],
                    })),
                    {
                        transaction,
                    },
                );
            }))
            // On supprime les octrois d'option 'hide_justice' qui n'existe plus
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM user_permission_options WHERE fk_option = \'hide_justice\'',
                {
                    transaction,
                },
            ))
            // On supprime l'option de permission 'hide_justice' de la table 'permission_options'
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM permission_options WHERE uid = \'hide_justice\'',
                {
                    transaction,
                },
            ))
            // On paramètre le masquage, par défaut, des procédures judiciaires aux rôles:
            // collaborator (Partenaire institutionnel), association (Opérateur), intervener (Intervenant)
            .then(() => queryInterface.sequelize.query(
                `UPDATE permissions
                    SET allowed = FALSE,
                    fk_geographic_level = NULL
                WHERE fk_role_regular IN ('association', 'collaborator', 'intervener')
                AND fk_entity = 'shantytown_justice'
                AND fk_feature = 'access'`,
                {
                    transaction,
                },
            ))
            // On adapte la vue user_actual_permissions
            .then(() => createUserActualPermissionsNewSchema(queryInterface, transaction)),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        // On crée l'option de permission 'hide_justice'
        transaction => queryInterface.sequelize.query(
            'INSERT INTO permission_options(uid, name) VALUES(\'hide_justice\', \'Masquer les procédures judiciaires\')',
            {
                transaction,
            },
        )
            // Liste des utilisateurs qui n'ont pas accès aux PJ par leur role_regular mais qui n'ont pas l'option individuelle
            // (access_justice) de les voir. Ils doivent donc avoir l'option hide_justice à true
            .then(() => queryInterface.sequelize.query(
                `SELECT
                            u.user_id
                FROM
                            users u
                WHERE
                            u.fk_role_regular IN ('association', 'collaborator', 'intervener')
                AND
                            u.user_id NOT IN
                            (
                                SELECT
                                            upo.fk_user
                                FROM
                                            user_permission_options upo
                                WHERE
                                            upo.fk_option = 'access_justice'
                            )`,
                { type: queryInterface.sequelize.QueryTypes.SELECT, transaction },
            ))
            // On crée pour les utilisateurs listés ci-dessus l'option 'hide_justice'
            .then(rows => queryInterface.bulkInsert(
                'user_permission_options',
                rows.map(({
                    user_id,
                }) => ({
                    fk_user: user_id,
                    fk_option: 'hide_justice',
                })),
                {
                    transaction,
                },
            ))
            // On supprime les octrois d'option 'access_justice' qui n'existe plus
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM user_permission_options WHERE fk_option = \'access_justice\'',
                {
                    transaction,
                },
            ))
            // On supprime l'option de permission 'access_justice' de la table 'permission_options'
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM permission_options WHERE uid = \'access_justice\'',
                {
                    transaction,
                },
            ))
            // On paramètre la permission d'accès aux procédures judiciaires, par défaut, aux rôles:
            // collaborator (Partenaire institutionnel), association (Opérateur), intervener (Intervenant)
            .then(() => queryInterface.sequelize.query(
                `UPDATE permissions
                    SET allowed = TRUE,
                    fk_geographic_level = 'local'
                WHERE fk_role_regular IN ('association', 'collaborator', 'intervener')
                AND fk_entity = 'shantytown_justice'
                AND fk_feature = 'access'`,
                {
                    transaction,
                },
            ))
            // On crée la vue user_actual_permissions à partir de la dernière version
            .then(() => createViewWithoutOrganization(queryInterface, transaction)),
    ),
};
