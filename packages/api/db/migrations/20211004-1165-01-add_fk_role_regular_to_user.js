/* Liste des organizations impactées par la migration à leur état original
{
    "SELECT\n\t\torg2.organization_id,\n\t\torg2.fk_type,\n\t\torg2.\"name\",\n\t\tot2.name_singular,\n\t\tot2.fk_role \n\tFROM\n\t\torganizations AS org2\n\tLEFT JOIN\n\t\torganization_types AS ot2\n\t\t\tON ot2.organization_type_id = org2.fk_type\n\tWHERE\n\t\tLOWER(ot2.name_singular) = 'intervenant'\n\tORDER BY\n\t\torg2.organization_id ": [
        {
            "organization_id" : 14243,
            "fk_type" : 31,
            "name" : "Commune - Carquefou",
            "name_singular" : "Intervenant",
            "fk_role" : "intervener"
        },
        {
            "organization_id" : 14310,
            "fk_type" : 31,
            "name" : "Commune - Nantes",
            "name_singular" : "Intervenant",
            "fk_role" : "intervener"
        },
        {
            "organization_id" : 14314,
            "fk_type" : 31,
            "name" : "Commune - Orvault",
            "name_singular" : "Intervenant",
            "fk_role" : "intervener"
        },
        {
            "organization_id" : 14338,
            "fk_type" : 31,
            "name" : "Commune - Rezé",
            "name_singular" : "Intervenant",
            "fk_role" : "intervener"
        },
        {
            "organization_id" : 14360,
            "fk_type" : 31,
            "name" : "Commune - Sainte-Luce-sur-Loire",
            "name_singular" : "Intervenant",
            "fk_role" : "intervener"
        },
        {
            "organization_id" : 14399,
            "fk_type" : 31,
            "name" : "Commune - Vertou",
            "name_singular" : "Intervenant",
            "fk_role" : "intervener"
        },
        {
            "organization_id" : 34116,
            "fk_type" : 31,
            "name" : "Commune - Saint-Herblain",
            "name_singular" : "Intervenant",
            "fk_role" : "intervener"
        },
        {
            "organization_id" : 34195,
            "fk_type" : 31,
            "name" : "Commune - Bouguenais",
            "name_singular" : "Intervenant",
            "fk_role" : "intervener"
        },
        {
            "organization_id" : 39854,
            "fk_type" : 31,
            "name" : "Intercommunalité - CA des Deux Baies en Montreuillois",
            "name_singular" : "Intervenant",
            "fk_role" : "intervener"
        },
        {
            "organization_id" : 40344,
            "fk_type" : 31,
            "name" : "Intercommunalité - Nantes Métropole",
            "name_singular" : "Intervenant",
            "fk_role" : "intervener"
        },
        {
            "organization_id" : 40671,
            "fk_type" : 31,
            "name" : "Département - Loire-Atlantique",
            "name_singular" : "Intervenant",
            "fk_role" : "intervener"
        },
        {
            "organization_id" : 40904,
            "fk_type" : 31,
            "name" : "Direction des Services Départementaux de l'Éducation Nationale - Loire-Atlantique",
            "name_singular" : "Intervenant",
            "fk_role" : "intervener"
        },
        {
            "organization_id" : 41494,
            "fk_type" : 31,
            "name" : "Médecins du Monde",
            "name_singular" : "Intervenant",
            "fk_role" : "intervener"
        },
        {
            "organization_id" : 41579,
            "fk_type" : 31,
            "name" : "CNDH Romeurope",
            "name_singular" : "Intervenant",
            "fk_role" : "intervener"
        },
        {
            "organization_id" : 41595,
            "fk_type" : 31,
            "name" : "Sol'roms  Saint-Herblain",
            "name_singular" : "Intervenant",
            "fk_role" : "intervener"
        },
        {
            "organization_id" : 41616,
            "fk_type" : 31,
            "name" : "AIDE ET ACTION",
            "name_singular" : "Intervenant",
            "fk_role" : "intervener"
        },
        {
            "organization_id" : 41634,
            "fk_type" : 31,
            "name" : "Solida-Roms-Bouguenais",
            "name_singular" : "Intervenant",
            "fk_role" : "intervener"
        },
        {
            "organization_id" : 41644,
            "fk_type" : 31,
            "name" : "CEMEA Pays de la Loire",
            "name_singular" : "Intervenant",
            "fk_role" : "intervener"
        },
        {
            "organization_id" : 41653,
            "fk_type" : 31,
            "name" : "AIDE ET ACTION",
            "name_singular" : "Intervenant",
            "fk_role" : "intervener"
        },
        {
            "organization_id" : 41658,
            "fk_type" : 31,
            "name" : "AIDE ET ACTION",
            "name_singular" : "Intervenant",
            "fk_role" : "intervener"
        },
        {
            "organization_id" : 41942,
            "fk_type" : 31,
            "name" : "France Horizon",
            "name_singular" : "Intervenant",
            "fk_role" : "intervener"
        }
    ]}
*/
module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'users',
            'fk_role_regular',
            {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'new',
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.changeColumn(
                'users',
                'fk_role_regular',
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: null,
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `UPDATE
                    users AS us2
                SET
                    fk_role_regular =
                (
                    SELECT
                            ot3.fk_role
                    FROM
                            organization_types AS ot3
                    LEFT JOIN
                            organizations AS org3
                                ON org3.fk_type = ot3.organization_type_id 
                    LEFT JOIN
                            users AS us3
                                ON us3.fk_organization = org3.organization_id 
                    WHERE
                            us3.user_id = us2.user_id
                )`,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'users',
                ['fk_role_regular'],
                {
                    type: 'foreign key',
                    name: 'fk_users_role_regular',
                    references: {
                        table: 'roles_regular',
                        field: 'role_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `UPDATE organizations
                 SET fk_type = 4
                 WHERE organization_id IN (14243, 14310, 14314, 14338, 14360, 14399, 34116, 34195)`,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `UPDATE organizations
                 SET fk_type = 5
                 WHERE organization_id IN (39854, 40344)`,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `UPDATE organizations
                    SET fk_type = 6
                    WHERE organization_id IN (40671)`,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `UPDATE organizations
                    SET fk_type = 14
                    WHERE organization_id IN (40904)`,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `UPDATE organizations
                    SET fk_type = 8
                    WHERE organization_id IN (41494, 41579, 41595, 41616, 41634, 41644, 41653, 41658, 41942)`,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.bulkDelete(
                'organization_types',
                {
                    fk_role: 'intervener',
                    fk_category: 'intervener',
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.bulkDelete(
                'organization_categories',
                {
                    uid: 'intervener',
                },
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'INSERT INTO organization_categories(uid, name_singular, name_plural) VALUES(\'intervener\', \'Intervenant\', \'Intervenants\')',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'INSERT INTO organization_types(name_singular, name_plural, fk_category, fk_role, uid) VALUES(\'Intervenant\', \'Intervenants\', \'intervener\', \'intervener\', \'intervenant\')',
                {
                    transaction,
                },
            )
                .then(() => queryInterface.sequelize.query(
                    `UPDATE organizations
                        SET fk_type = (SELECT organization_type_id FROM organization_types WHERE LOWER(name_singular)='intervenant')
                        WHERE organization_id IN (14243, 14310, 14314, 14338, 14360, 14399, 34116, 34195, 39854, 40344, 40671, 40904, 41494, 41579, 41595, 41616, 41634, 41644, 41653, 41658, 41942)`,
                    {
                        transaction,
                    },
                )))
            .then(() => queryInterface.removeConstraint(
                'users',
                'fk_users_role_regular',
                { transaction },
            )
                .then(() => queryInterface.removeColumn(
                    'users',
                    'fk_role_regular',
                    { transaction },
                ))),
    ),
};
