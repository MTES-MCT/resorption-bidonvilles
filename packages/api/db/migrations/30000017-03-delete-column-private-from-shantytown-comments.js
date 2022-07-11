
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

        queryInterface.addColumn(
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
        await queryInterface.sequelize.query(
            'CREATE EXTENSION intarray',
            {
                transaction,
            },
        );

        // set comments whose targets are all pref and DDETS in department to private = true

        const [private_comments] = await queryInterface.sequelize.query(
            `WITH departements_organizations AS (select departements.code as departement_code, sort(array_agg(lo.organization_id)) AS o1
            FROM departements
            LEFT JOIN localized_organizations lo ON (lo.departement_code = departements.code OR (lo.location_type='region' and lo.region_code = departements.fk_region) OR lo.location_type='nation')
            LEFT JOIN organization_types ot ON ot.organization_type_id = lo.fk_type
            WHERE ot.fk_role = 'direct_collaborator'
            GROUP BY departements.code
            ), 
            sc_targets AS (
            SELECT shantytown_comments.shantytown_comment_id, SORT(ARRAY_AGG(lo.organization_id)) AS o2
            FROM shantytown_comments
            INNER JOIN shantytown_comment_organization_targets scot ON scot.fk_comment = shantytown_comments.shantytown_comment_id 
            LEFT JOIN localized_organizations lo ON lo.organization_id = scot.fk_organization
            GROUP BY shantytown_comments.shantytown_comment_id)
            SELECT shantytown_comments.shantytown_comment_id
            FROM shantytown_comments
            LEFT JOIN shantytowns ON shantytowns.shantytown_id = shantytown_comments.fk_shantytown
            LEFT JOIN cities ON cities.code = shantytowns.fk_city
            LEFT JOIN departements_organizations on departements_organizations.departement_code = cities.fk_departement
            LEFT JOIN sc_targets on sc_targets.shantytown_comment_id = shantytown_comments.shantytown_comment_id
            WHERE departements_organizations.o1 = sc_targets.o2 
            `,
            {
                transaction,
            },
        );
        await Promise.all(private_comments.map(({ shantytown_comment_id }) => queryInterface.sequelize.query(`
        UPDATE shantytown_comments
        SET private = true
        WHERE shantytown_comment_id = ${shantytown_comment_id}`, { transaction })));


        // delete comments whose targets are not null but do not correspond to pref and DDETS

        const [comments_to_delete] = await queryInterface.sequelize.query(
            `WITH departements_organizations AS (select departements.code as departement_code, sort(array_agg(lo.organization_id)) AS o1
            FROM departements
            LEFT JOIN localized_organizations lo ON (lo.departement_code = departements.code OR (lo.location_type='region' and lo.region_code = departements.fk_region) OR lo.location_type='nation')
            LEFT JOIN organization_types ot ON ot.organization_type_id = lo.fk_type
            WHERE ot.fk_role = 'direct_collaborator'
            GROUP BY departements.code
            ), 
            sco_targets AS (
            SELECT shantytown_comments.shantytown_comment_id, SORT(ARRAY_AGG(lo.organization_id)) AS o2
            FROM shantytown_comments
            INNER JOIN shantytown_comment_organization_targets scot ON scot.fk_comment = shantytown_comments.shantytown_comment_id 
            LEFT JOIN localized_organizations lo ON lo.organization_id = scot.fk_organization
            GROUP BY shantytown_comments.shantytown_comment_id),
            scu_targets AS (
             SELECT shantytown_comments.shantytown_comment_id, ARRAY_AGG(scut.fk_user) AS user_targets
            FROM shantytown_comments
            INNER JOIN shantytown_comment_user_targets scut ON scut.fk_comment = shantytown_comments.shantytown_comment_id 
            GROUP BY shantytown_comments.shantytown_comment_id
            )
            SELECT shantytown_comments.shantytown_comment_id
            FROM shantytown_comments
            LEFT JOIN shantytowns ON shantytowns.shantytown_id = shantytown_comments.fk_shantytown
            LEFT JOIN cities ON cities.code = shantytowns.fk_city
            LEFT JOIN departements_organizations on departements_organizations.departement_code = cities.fk_departement
            LEFT JOIN sco_targets on sco_targets.shantytown_comment_id = shantytown_comments.shantytown_comment_id
            LEFT JOIN scu_targets ON scu_targets.shantytown_comment_id = shantytown_comments.shantytown_comment_id
            WHERE departements_organizations.o1 != sco_targets.o2 
            OR scu_targets.user_targets is not null
            
            `,
            {
                transaction,
            },
        );

        await Promise.all(comments_to_delete.map(({ shantytown_comment_id }) => queryInterface.sequelize.query(`
        DELETE FROM shantytown_comments
        WHERE shantytown_comment_id = ${shantytown_comment_id}`, { transaction })));

        await queryInterface.sequelize.query(
            'DROP EXTENSION intarray',
            {
                transaction,
            },
        );
        return transaction.commit();
    },

};
