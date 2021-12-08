const createUserActualPermissionsNewSchema = require('./common/user_actual_permissions/04_replace_hide_justice_by_access_justice');

module.exports = {
    /*
        1.  On crée l'option de permission 'access_justice'
        2.  On filtre tous les utilisateurs qui ont le droit d'accès aux procédures judiciaires par leur rôle
            et qui ne sont pas listés dans les options de permissions avec 'hide_justice'
        3.  On crée pour les utilisateurs listés plus haut l'option 'access_justice'
        4.  On supprime les octrois d'option 'hide_justice' qui n'existe plus
        5.  On supprime le droit, par défaut, de voir les procédures judiciaires aux rôles:
            collaborator (Partenaire institutionnel), association (Opérateur), intervener (Intervenant)
        6.  On adapte la vue user_actual_permissions
    */
    up: queryInterface => queryInterface.sequelize.transaction(
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
                        p.fk_user
                FROM
                        permissions p
                LEFT JOIN
                        users u ON u.user_id = p.fk_user
                WHERE
                        p.fk_entity = 'shantytown_justice'
                AND
                        p.fk_user IS NOT NULL
                AND 
                        p.allowed = TRUE
                AND
                        p.fk_user
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
            .then(rows => queryInterface.bulkInsert(
                'user_permission_options',
                rows.map(({
                    fk_user,
                }) => ({
                    fk_user,
                    fk_option: 'access_justice',
                })),
                {
                    transaction,
                },
            ))
            // On supprime les octrois d'option 'hide_justice' qui n'existe plus
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM user_permission_options WHERE fk_option = \'hide_justice\'',
                {
                    transaction,
                },
            ))
            // On supprime le droit, par défaut, de voir les procédures judiciaires aux rôles:
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

    /*
        1.  On crée l'option de permission 'hide_justice'
        2.  On filtre tous les utilisateurs qui ont le droit d'accès aux procédures judiciaires par leur rôle
            et qui ne sont pas listés dans les options de permissions avec 'hide_justice'
        3.  On crée pour les utilisateurs listés plus haut l'option 'hide_justice'
        4.  On filtre les utilisateurs qui ont accès ont le droit d'accès aux procédures judiciaires par leur rôle,
            à qui on ne peut pas appliquer l'option 'hide_justice' mais à qui on a supprimer le droit d'accès aux PJ
        5.  On ajoute les non-permissions aux utilisateurs visés au 4. en précisant allowed = FALSE dans la table `permissions`
        6.  On supprime les octrois d'option 'hide_justice' qui n'existe plus
        7.  On supprime le droit, par défaut, de voir les procédures judiciaires aux rôles:
            collaborator (Partenaire institutionnel), association (Opérateur), intervener (Intervenant)
        8.  On adapte la vue user_actual_permissions
    */
    down: queryInterface => queryInterface.sequelize.transaction(
        // On crée l'option de permission 'hide_justice'
        transaction => queryInterface.sequelize.query(
            'INSERT INTO permission_options(uid, name) VALUES(\'hide_justice\', \'Masquer les procédures judiciaires\')',
            {
                transaction,
            },
        )
            // Liste des utilisateurs qui ont accès aux PJ par leur role_regular mais qui n'ont pas le droit individuel de les voir
            // (qui doivent donc avoir l'option hide_justice à true)
            .then(() => queryInterface.sequelize.query(
                `SELECT
                            p.fk_user
                FROM
                            permissions p
                LEFT JOIN
                            users u ON u.user_id = p.fk_user
                WHERE
                            p.fk_entity = 'shantytown_justice'
                AND 
                            p.fk_user IS NOT NULL
                AND
                            p.allowed = TRUE
                AND
                            u.fk_role_regular IN ('association', 'collaborator', 'intervener')`,
                { type: queryInterface.sequelize.QueryTypes.SELECT, transaction },
            ))
            // On crée pour les utilisateurs listés ci-dessus l'option 'hide_justice'
            .then(rows => queryInterface.bulkInsert(
                'user_permission_options',
                rows.map(({
                    fk_user,
                }) => ({
                    fk_user,
                    fk_option: 'hide_justice',
                })),
                {
                    transaction,
                },
            ))
            // Liste des utilisateurs qui ont accès aux PJ par leur role_regular mais qui n'ont pas le droit individuel de les voir
            // (qui doivent donc avoir l'option hide_justice à true)
            .then(() => queryInterface.sequelize.query(
                `SELECT
                            p.fk_user
                FROM
                            permissions p
                LEFT JOIN
                            users u ON u.user_id = p.fk_user
                WHERE
                            p.fk_entity = 'shantytown_justice'
                AND 
                            p.fk_user IS NOT NULL
                AND
                            p.allowed = FALSE
                AND
                            u.fk_role_regular IN ('association', 'collaborator', 'intervener')`,
                { type: queryInterface.sequelize.QueryTypes.SELECT, transaction },
            ))
            // On crée pour les utilisateurs listés ci-dessus l'option 'hide_justice'
            .then(rows => queryInterface.bulkInsert(
                'user_permission_options',
                rows.map(({
                    fk_user,
                }) => ({
                    fk_user,
                    fk_option: 'hide_justice',
                })),
                {
                    transaction,
                },
            ))

            .then(() => queryInterface.sequelize.query(
                'DELETE FROM features WHERE name = \'access\' AND fk_entity = \'contact_form_referral\'',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM entities WHERE name = \'contact_form_referral\'',
                {
                    transaction,
                },
            )),
    ),
};
