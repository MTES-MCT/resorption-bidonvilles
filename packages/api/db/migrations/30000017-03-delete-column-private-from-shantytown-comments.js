
module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'shantytown_comments',
            'private',
            {
                transaction,
            },
        ),
    ),

    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.addColumn(
            'shantytown_comments',
            'private',
            {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            {
                transaction,
            },
        );

        // on récupère la liste de tous les commentaires privés, avec l'instruction de s'il faut
        // les garder ou non
        // si on le garde pas => suppression
        // si on le garde => on passe la colonne "private" à true
        // un commentaire privé est n'importe quel commentaire qui a au moins un target (user ou organization)
        const privateComments = await queryInterface.sequelize.query(
            `
            -- on récupère, par département, la liste des préfs. de département et ddets
            WITH departement_orgs AS (SELECT departement_code, array_agg(organization_id) AS organizations
            FROM localized_organizations
            WHERE fk_type IN (SELECT organization_type_id FROM organization_types WHERE uid IN ('pref_departement', 'ddets'))
            GROUP BY departement_code),

            -- on récupère, par région, la liste des préfs. de région
            region_orgs AS (SELECT region_code, array_agg(organization_id) AS organizations
            FROM localized_organizations
            WHERE fk_type IN (SELECT organization_type_id FROM organization_types WHERE uid = 'pref_region')
            GROUP BY region_code),

            -- on récupère, par commentaire, la liste des utilisateurs cibles
            grouped_user_targets AS (SELECT
            scut.fk_comment,
            COALESCE(array_agg(scut.fk_user), ARRAY[]::integer[]) AS targets
            FROM shantytown_comments sc
            LEFT JOIN shantytown_comment_user_targets scut ON scut.fk_comment = sc.shantytown_comment_id
            WHERE scut.fk_comment IS NOT NULL
            GROUP BY scut.fk_comment),

            -- on récupère, par commentaire, la liste des structures cibles
            grouped_org_targets AS (SELECT
            scot.fk_comment,
            COALESCE(array_agg(scot.fk_organization), ARRAY[]::integer[]) AS targets
            FROM shantytown_comments sc
            LEFT JOIN shantytown_comment_organization_targets scot ON scot.fk_comment = sc.shantytown_comment_id
            WHERE scot.fk_comment IS NOT NULL
            GROUP BY scot.fk_comment)

            -- pour chaque commentaire privé, on récupère l'id et on décide de si le commentaire doit
            -- être gardé ou non selon la règle suivante :
            -- si le commentaire n'a pour cible que des structures, et que ces structures correspond
            -- exactement à la liste des préfs. de département, région, et ddets de sa localisation
            -- alors on garde le commentaire
            SELECT
            sc.shantytown_comment_id,
            CASE
                WHEN gut.targets IS NOT NULL THEN FALSE
                WHEN (got.targets @> (deo.organizations || reo.organizations)) AND (got.targets <@ (deo.organizations || reo.organizations)) THEN TRUE
                ELSE FALSE
            END AS keep_comment
            FROM shantytown_comments sc
            LEFT JOIN grouped_user_targets gut ON sc.shantytown_comment_id = gut.fk_comment
            LEFT JOIN grouped_org_targets got ON sc.shantytown_comment_id = got.fk_comment
            LEFT JOIN shantytowns s ON sc.fk_shantytown = s.shantytown_id
            LEFT JOIN cities c ON s.fk_city = c.code
            LEFT JOIN departements d ON c.fk_departement = d.code
            LEFT JOIN departement_orgs deo ON d.code = deo.departement_code
            LEFT JOIN region_orgs reo ON d.fk_region = reo.region_code
            WHERE gut.targets IS NOT NULL OR got.targets IS NOT NULL
            `,
            {
                type: Sequelize.QueryTypes.SELECT,
                transaction,
            },
        );

        const { toBeDeleted, toBeKept } = privateComments.reduce((argAcc, { shantytown_comment_id, keep_comment }) => {
            if (keep_comment) {
                argAcc.toBeKept.push(shantytown_comment_id);
            } else {
                argAcc.toBeDeleted.push(shantytown_comment_id);
            }

            return argAcc;
        }, {
            toBeDeleted: [],
            toBeKept: [],
        });

        const promises = [];
        if (toBeDeleted.length > 0) {
            promises.push(
                queryInterface.sequelize.query(
                    'DELETE FROM shantytown_comments WHERE shantytown_comment_id IN (:ids)',
                    {
                        replacements: { ids: toBeDeleted },
                        transaction,
                    },
                ),
            );
        }
        if (toBeKept.length > 0) {
            promises.push(
                queryInterface.sequelize.query(
                    'UPDATE shantytown_comments SET private = true WHERE shantytown_comment_id IN (:ids)',
                    {
                        replacements: { ids: toBeKept },
                        transaction,
                    },
                ),
            );
        }
        await Promise.all(promises);

        await transaction.commit();
    },

};
