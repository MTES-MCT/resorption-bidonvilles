export default {
    national_establisment: {
        description: 'L\'acteur national est en charge de la mise en oeuvre du cadre national. Pour cela, il suit et évalue les actions. Il peut, le cas échéant, apporter un soutien financier ou un appui technique.',
        national_permissions: [
            [{ type: 'view', label: 'Consulter les %sites%', comments: 'dont les procédures judiciaires' }],
            [{ type: 'view', label: 'Consulter les %actions%', comments: 'dont les financements' }],
        ],
        local_permissions: [],
        options: [],
    },
    direct_collaborator: {
        description: 'Le correspondant est le représentant local de l\'Etat en charge de la question des bidonvilles à l\'échelle du territoire. Il pilote les actions menées et est également l\'interlocuteur privilégié de la Dihal sur le sujet.',
        national_permissions: [
            [{ type: 'view', label: 'Consulter les %sites%', comments: 'dont les procédures judiciaires' }],
            [{ type: 'view', label: 'Consulter les %actions%', comments: 'hors financements' }],
        ],
        local_permissions: [
            [{ type: 'edit', label: 'Créer, mettre à jour les %sites%', comments: 'dont les procédures judiciaires' }],
            [{ type: 'edit', label: 'Mettre à jour les %actions%', comments: 'dont les financements' }],
            [{ type: 'edit', label: 'Consulter et ajouter des %commentaires%', comments: null }],
        ],
        options: [],
    },
    collaborator: {
        description: 'Le partenaire institutionnel est un acteur public impliqué dans le pilotage et le suivi des actions menées, dans le champ de ses compétences et prérogatives.',
        national_permissions: [],
        local_permissions: [
            [
                { type: 'edit', label: 'Créer, mettre à jour les %sites%', comments: null },
                {
                    type: 'deny', label: 'hors fermeture des sites', comments: null, option: 'close_shantytown',
                },
                {
                    type: 'deny', label: 'hors procédures judiciaires', comments: null, option: 'access_justice',
                },
            ],
            [{ type: 'edit', label: 'Mettre à jour les %actions%', comments: 'hors financements' }],
        ],
        options: [
            { id: 'close_shantytown', label: 'Autoriser le partenaire à créer un site et déclarer la fermeture d\'un site' },
            { id: 'access_justice', label: 'Accéder aux procédures judiciaires' },
        ],
    },
    association: {
        description: 'L\'opérateur est la structure chargée d\'intervenir auprès des habitants dans une perspective de résorption des bidonvilles.',
        national_permissions: [],
        local_permissions: [
            [
                { type: 'edit', label: 'Mettre à jour les %sites%', comments: null },
                {
                    type: 'deny', label: 'hors fermeture des sites', comments: null, option: 'close_shantytown',
                },
                {
                    type: 'deny', label: 'hors création des sites', comments: null, option: 'create_shantytown',
                },
                {
                    type: 'deny', label: 'hors procédures judiciaires', comments: null, option: 'access_justice',
                },
            ],
            [{ type: 'view', label: 'Mettre à jour les %actions%', comments: 'hors financements' }],
        ],
        options: [
            { id: 'create_shantytown', label: 'Autoriser l\'opérateur à déclarer un site' },
            { id: 'close_shantytown', label: 'Autoriser l\'opérateur à déclarer la fermeture d\'un site' },
            { id: 'access_justice', label: 'Accéder aux procédures judiciaires' },
        ],
    },
    intervener: {
        description: 'L\'accès intervenant permet à l\'utilisateur de connaître la situation d\'un site et de partager ses actions et constats à travers le « Journal du site ».',
        national_permissions: [],
        local_permissions: [
            [
                { type: 'view', label: 'Consulter les %sites%', comments: null },
                {
                    type: 'deny', label: 'hors procédures judiciaires', comments: null, option: 'access_justice',
                },
                {
                    type: 'edit', label: 'Écrire des commentaires sur le « Journal du site »', comments: null,
                },
                {
                    type: 'edit', label: 'Se déclarer intervenant sur un site', comments: null,
                },
                {
                    type: 'deny', label: 'Ne peut pas modifier les données d\'un site (Caractéristiques du site, Habitants, Conditions de vie et environnement)', comments: null,
                },
            ],
            [{ type: 'view', label: 'Consulter les %actions%', comments: null }],
        ],
        options: [
            { id: 'access_justice', label: 'Accéder aux procédures judiciaires' },
        ],
    },
    external_observator: {
        description: 'L\'accès observateur externe permet à l\'utilisateur de connaître la situation d\'un site et d\'accéder aux informations des actions',
        national_permissions: [],
        local_permissions: [
            [{ type: 'view', label: 'Consulter les %sites%', comments: null }],
            [{ type: 'view', label: 'Consulter les %actions%', comments: null }],
        ],
        options: [],
    },
    local_admin: {
        description: '',
        national_permissions: [],
        local_permissions: [],
        options: [],
    },
    national_admin: {
        description: '',
        national_permissions: [],
        local_permissions: [],
        options: [],
    },
};
