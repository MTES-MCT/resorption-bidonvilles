module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'organization_types',
            'uid',
            {
                type: Sequelize.STRING,
                allowNull: true,
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                `UPDATE organization_types
                    SET uid = CASE name_singular
                                WHEN 'Préfecture de département' THEN 'pref_departement'
                                WHEN 'Préfecture de région' THEN 'pref_region'
                                WHEN 'Commune' THEN 'commune'
                                WHEN 'Intercommunalité' THEN 'intercommunalite'
                                WHEN 'Département' THEN 'departement'
                                WHEN 'Région' THEN 'region'
                                WHEN 'Association' THEN 'association'
                                WHEN 'Ministère' THEN 'ministere'
                                WHEN 'Délégation interministérielle' THEN 'delegation_interministere'
                                WHEN 'Agence nationale sous tutelle' THEN 'agence_nationale'
                                WHEN 'Direction Départementale des Territoires / Direction Départementale des Territoires et de la Mer' THEN 'ddt'
                                WHEN 'Direction Académique des Services de l''Éducation Nationale' THEN 'dasen'
                                WHEN 'Direction des Services Départementaux de l''Éducation Nationale' THEN 'dsden'
                                WHEN 'Rectorat' THEN 'rectorat'
                                WHEN 'Centre Académique pour la Scolarisation des Nouveaux Arrivants et des enfants du Voyage' THEN 'casnav'
                                WHEN 'Gendarmerie nationale' THEN 'gendarmerie_nationale'
                                WHEN 'Direction Départementale de la Sécurité Publique' THEN 'ddsp'
                                WHEN 'Office Français de l''Immigration et de l''Intégration' THEN 'ofii'
                                WHEN 'Direction Territoriale de la Protection Judiciaire de la Jeunesse' THEN 'dtpjj'
                                WHEN 'Service Départemental d''Incendie et de Secours / Service Départemental et Métropolitain d''Incendie et de Secours' THEN 'sdis'
                                WHEN 'Direction Régionale de l''Environnement, de l''Aménagement et du Logement' THEN 'dreal'
                                WHEN 'Direction Régionale et Interdépartementale de l''Hébergement et du Logement' THEN 'drihl'
                                WHEN 'Direction Régionale de la Jeunesse, des Sports, et de la Cohésion Sociale' THEN 'drjscs'
                                WHEN 'Agence Régionale de Santé' THEN 'ars'
                                WHEN 'Mission départementale aux droits des femmes et à l''égalité' THEN 'mission_droits_des_femmes'
                                WHEN 'Organisme privé' THEN 'organisme_prive'
                                WHEN 'Intervenant' THEN 'intervenant'
                                WHEN 'Défenseur des droits' THEN 'defenseur_des_droits'
                                WHEN 'Conseil économique, social et environnemental régional' THEN 'ceser'
                                WHEN 'Direction Régionale de l''Emploi, du Travail et des Solidarités' THEN 'drets'
                                WHEN 'Direction Départementale de l''Emploi, du Travail et des Solidarités' THEN 'ddets'
                                ELSE NULL
                              END
                    `,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.changeColumn(
                'organization_types',
                'uid',
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'organization_types',
            'uid',
            {
                transaction,
            },
        ),
    ),

};
