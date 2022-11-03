const organizations = [
    {
        type: 'Préfecture de département',
        generate: 'departement',
    },
    {
        type: 'Direction Départementale de la Cohésion Sociale / Direction Départementale de la Cohésion Sociale et de la Protection des Populations',
        generate: 'departement',
    },
    {
        type: 'Préfecture de région',
        generate: 'region',
    },
    {
        type: 'Commune',
        generate: 'city',
    },
    {
        type: 'Intercommunalité',
        generate: 'epci',
    },
    {
        type: 'Département',
        generate: 'departement',
    },
    {
        type: 'Région',
        generate: 'region',
    },
    {
        type: 'Ministère',
        list: [
            { name: 'Ministère de la Transition Écologique et Solidaire', abbreviation: 'MTES' },
            { name: 'Ministère de la Cohésion des Territoires et des Relations avec les Collectivités Territoriales', abbreviation: 'MCTRCT' },
            { name: 'Ministère du Travail' },
            { name: 'Ministère des Solidarités et de la Santé' },
            { name: 'Ministère de l\'Intérieur' },
            { name: 'Ministère de la Justice' },
            { name: 'Ministère de l\'Europe et des Affaires Étrangères' },
            { name: 'Ministère de l\'Éducation Nationale' },
            { name: 'Secrétariat d\'État auprès du Premier ministre, chargé de l\'égalité entre les femmes et les hommes' },
        ],
    },
    {
        type: 'Délégation interministérielle',
        list: [
            { name: 'Délégation Interministérielle à l\'Hébergement et à l\'Accès au Logement', abbreviation: 'DIHAL' },
            { name: 'Délégation Interministérielle à l\'Accueil et à l\'Intégration des Réfugiés', abbreviation: 'DIAIR' },
            { name: 'Délégation Interministérielle à la Prévention et à la Lutte contre la Pauvreté des Enfants et Jeunes', abbreviation: 'DIPLPEJ' },
        ],
    },
    {
        type: 'Agence nationale sous tutelle',
        list: [
            { name: 'Agence Nationale de l\'Habitat', abbreviation: 'ANAH' },
        ],
    },
    {
        type: 'Direction Départementale des Territoires / Direction Départementale des Territoires et de la Mer',
        generate: 'departement',
    },
    {
        type: 'Direction des Services Départementaux de l\'Éducation Nationale',
        generate: 'departement',
    },
    {
        type: 'Gendarmerie nationale',
        list: [
            { name: 'Gendarmerie nationale' },
        ],
    },
    {
        type: 'Direction Départementale de la Sécurité Publique',
        generate: 'departement',
    },
    {
        type: 'Office Français de l\'Immigration et de l\'Intégration',
        list: [
            { name: 'Office Français de l\'Immigration et de l\'Intégration', abbreviation: 'OFII' },
        ],
    },
    {
        type: 'Direction Territoriale de la Protection Judiciaire de la Jeunesse',
        generate: 'departement',
    },
    {
        type: 'Service Départemental d\'Incendie et de Secours / Service Départemental et Métropolitain d\'Incendie et de Secours',
        generate: 'departement',
    },
    {
        type: 'Direction Régionale des Entreprises, de la Concurrence, de la Consommation, du Travail et de l\'Emploi',
        generate: 'region',
    },
    {
        type: 'Direction Régionale de l\'Environnement, de l\'Aménagement et du Logement',
        generate: 'region',
    },
    {
        type: 'Direction Régionale et Interdépartementale de l\'Hébergement et du Logement',
        list: [
            {
                name: 'Direction Régionale et Interdépartementale de l\'Hébergement et du Logement - Île-de-France',
                abbreviation: 'DRIHL - Île-de-France',
                fk_region: '11',
            },
        ],
    },
    {
        type: 'Direction Régionale de la Jeunesse, des Sports, et de la Cohésion Sociale',
        generate: 'region',
    },
    {
        type: 'Agence Régionale de Santé',
        generate: 'region',
    },
    {
        type: 'Mission départementale aux droits des femmes et à l\'égalité',
        generate: 'departement',
    },
    {
        type: 'Association',
        list: [
            { name: 'Inconnu' },
            { name: '2 Choses Lune', fk_departement: '34' },
            { name: 'Accompagnement promotion insertion Provence', abbreviation: 'API Provence', fk_departement: '06' },
            { name: 'Accueil coopération insertion pour les nouveaux arrivants', abbreviation: 'ACINA', fk_departement: '91' },
            { name: 'Accueil coopération insertion pour les nouveaux arrivants', abbreviation: 'ACINA', fk_departement: '92' },
            { name: 'Accueil coopération insertion pour les nouveaux arrivants', abbreviation: 'ACINA', fk_departement: '93' },
            { name: 'Accueil coopération insertion pour les nouveaux arrivants', abbreviation: 'ACINA', fk_departement: '94' },
            { name: 'Accueil coopération insertion pour les nouveaux arrivants', abbreviation: 'ACINA', fk_departement: '95' },
            { name: "Action méditerranée d'insertion social et de logement", abbreviation: 'AMPIL', fk_departement: '13' },
            { name: "Action pour l'insertion par le logement", abbreviation: 'ALPIL', fk_departement: '69' },
            { name: 'Alteralia', fk_departement: '93' },
            { name: 'Alteralia', fk_departement: '94' },
            { name: 'Amitiés Tsiganes', fk_departement: '54' },
            { name: "Association d'aide à la scolarisation des enfants tsiganes", abbreviation: 'ASET', fk_departement: '93' },
            { name: 'Association Départementale de Vaucluse pour la Sauvegarde de l’Enfance à l’Adulte', abbreviation: 'ADVSEA', fk_departement: '84' },
            { name: "Association départementale pour l'accueil et la promotion des gens du voyage", abbreviation: 'ADAPGV', fk_departement: '86' },
            { name: 'Association départementale pour le développement des actions de prévention', abbreviation: 'ADDAP', fk_departement: '13' },
            { name: 'Association des Cités du Secours Catholique', abbreviation: 'ACSC', fk_departement: '13' },
            { name: "Association des Flandres pour l'éducation, la formation des jeunes et l'insertion professionnelle et sociale", abbreviation: 'AFEJI', fk_departement: '59' },
            { name: "Association dijonnaise d'entraide des familles ouvrières", abbreviation: 'ADEFO', fk_departement: '21' },
            { name: "Association pour l'habitat des jeunes Amboise", abbreviation: 'ASHAJ Amboise', fk_departement: '37' },
            { name: 'Association pour le logement, la formation et l’animation – Accueillir, Associer, Accompagner', abbreviation: 'ALFA3A', fk_departement: '74' },
            { name: 'Association recherche éducation action', abbreviation: 'AREA', fk_departement: '34' },
            { name: "Association régionale d'étude et d'action sociale", abbreviation: 'AREAS', fk_departement: '59' },
            { name: 'Association Saint-Benoît-Labre', abbreviation: 'ASBL', fk_departement: '44' },
            { name: 'AUDACIA', fk_departement: '86' },
            { name: 'CCAS Charleville-Mézières', fk_departement: '08' },
            { name: 'Cimade', fk_departement: '34' },
            { name: 'Cité Myriam', fk_departement: '93' },
            { name: 'COALLIA', fk_departement: '21' },
            { name: 'Convivances', fk_departement: '94' },
            { name: 'COS Quancard', fk_departement: '33' },
            { name: 'Croix Rouge Française', fk_departement: '30' },
            { name: 'Croix Rouge Française', fk_departement: '31' },
            { name: 'Croix Rouge Française', fk_departement: '67' },
            { name: 'Entraide Protestante', fk_departement: '31' },
            { name: 'Entraides et Solidarités', fk_departement: '37' },
            { name: 'Entreprendre pour Humaniser la Dépendance (Habitat et Humanisme)', fk_departement: '69' },
            { name: 'Forum Réfugiés', fk_departement: '69' },
            { name: 'France Horizon', fk_departement: '31' },
            { name: 'Habitat alternatif social', abbreviation: 'HAS', fk_departement: '13' },
            { name: 'Horizon Amitié', fk_departement: '67' },
            { name: 'La Rose des Vents', fk_departement: '77' },
            { name: 'La Sauvegarde du Nord', fk_departement: '59' },
            { name: 'Le Rocheton', fk_departement: '91' },
            { name: 'Les Enfants du Canal', fk_departement: '93' },
            { name: 'Les Forges', fk_departement: '44' },
            { name: 'Médecins du Monde', abbreviation: 'MdM', fk_departement: '13' },
            { name: 'Médecins du Monde', abbreviation: 'MdM', fk_departement: '31' },
            { name: 'Médecins du Monde', abbreviation: 'MdM', fk_departement: '44' },
            { name: 'Médecins du Monde', abbreviation: 'MdM', fk_departement: '93' },
            { name: 'Médecins du Monde', abbreviation: 'MdM', fk_departement: '69' },
            { name: 'Médecins du Monde', abbreviation: 'MdM', fk_departement: '13' },
            { name: 'Métropole de Grenoble', fk_departement: '38' },
            { name: 'Mission squat, ville de Strasbourg', fk_departement: '67' },
            { name: 'Paroles vives', fk_departement: '13' },
            { name: 'Première urgence internationale', abbreviation: 'PUI', fk_departement: '93' },
            { name: 'Première urgence internationale', abbreviation: 'PUI', fk_departement: '94' },
            { name: 'Réseau ROMA', fk_departement: '59' },
            { name: 'Romespérance', fk_departement: '83' },
            { name: 'Roms Action', fk_departement: '38' },
            { name: 'Rues et Cités', fk_departement: '93' },
            { name: "Solidaires pour l'habitat", abbreviation: 'SOLIHA', fk_departement: '31' },
            { name: "Solidaires pour l'habitat", abbreviation: 'SOLIHA', fk_departement: '59' },
            { name: "Solidaires pour l'habitat", abbreviation: 'SOLIHA', fk_departement: '91' },
            { name: "Solidaires pour l'habitat", abbreviation: 'SOLIHA', fk_departement: '78' },
            { name: "Solidaires pour l'habitat", abbreviation: 'SOLIHA', fk_departement: '12' },
            { name: "Solidaires pour l'habitat", abbreviation: 'SOLIHA', fk_departement: '13' },
            { name: 'Solidarité aire toulonnaise', abbreviation: 'SAT', fk_departement: '83' },
            { name: 'Une famille un toit', abbreviation: 'UFUT', fk_departement: '44' },
            { name: 'Unis Cité Toulouse', fk_departement: '31' },
        ],
    },
];


module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.sequelize.query(
                'SELECT code, name FROM regions',
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                },
            ),
            queryInterface.sequelize.query(
                'SELECT code, name FROM departements',
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                },
            ),
            queryInterface.sequelize.query(
                'SELECT code, name FROM epci',
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                },
            ),
            queryInterface.sequelize.query(
                'SELECT code, name FROM cities',
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                },
            ),
            queryInterface.sequelize.query(
                'SELECT organization_type_id AS id, name_singular AS name, abbreviation FROM organization_types',
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                },
            ),
        ])
            .then(([regions, departements, epci, cities, types]) => {
                const hashTypes = types.reduce((acc, type) => Object.assign({}, acc, {
                    [type.name]: type,
                }), {});

                const finalData = organizations.reduce((fullData, { type: typeName, generate, list }) => {
                    const type = hashTypes[typeName];
                    let data = [];

                    if (generate === 'departement') {
                        data = departements.map(({ code, name }) => ({
                            name: `${type.name} - ${name}`,
                            abbreviation: type.abbreviation ? `${type.abbreviation} - ${name}` : null,
                            active: true,
                            fk_type: type.id,
                            fk_region: null,
                            fk_departement: code,
                            fk_epci: null,
                            fk_city: null,
                        }));
                    } else if (generate === 'region') {
                        data = regions.map(({ code, name }) => ({
                            name: `${type.name} - ${name}`,
                            abbreviation: type.abbreviation ? `${type.abbreviation} - ${name}` : null,
                            active: true,
                            fk_type: type.id,
                            fk_region: code,
                        }));
                    } else if (generate === 'epci') {
                        data = epci.map(({ code, name }) => ({
                            name: `${type.name} - ${name}`,
                            abbreviation: type.abbreviation ? `${type.abbreviation} - ${name}` : null,
                            active: true,
                            fk_type: type.id,
                            fk_epci: code,
                        }));
                    } else if (generate === 'city') {
                        data = cities.map(({ code, name }) => ({
                            name: `${type.name} - ${name}`,
                            abbreviation: type.abbreviation ? `${type.abbreviation} - ${name}` : null,
                            active: true,
                            fk_type: type.id,
                            fk_city: code,
                        }));
                    } else {
                        data = list.map(instance => Object.assign({}, instance, {
                            active: true,
                            fk_type: type.id,
                        }));
                    }

                    return [
                        ...fullData,
                        ...data,
                    ];
                }, []);

                return queryInterface.bulkInsert(
                    'organizations',
                    finalData,
                    {
                        transaction,
                    },
                );
            }),
    ),

    down: queryInterface => queryInterface.bulkDelete('organizations'),

};
