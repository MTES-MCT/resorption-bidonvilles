module.exports = {
    national_establisment: {
        description: 'L\'acteur national est en charge de la mise en oeuvre du cadre national. Pour cela, il suit et évalue les actions. Il peut, le cas échéant, apporter un soutien financier ou un appui technique.',
        national_permissions: [
            [{ type: 'view', label: 'Consulter les %sites%', comments: 'dont les procédures judiciaires' }],
            [{ type: 'view', label: 'Consulter les %dispositifs%', comments: 'dont les financements' }],
        ],
        local_permissions: [],
        options: [],
    },
    direct_collaborator: {
        description: 'Le correspondant est le représentant local de l\'Etat en charge de la question des bidonvilles à l\'échelle du territoire. Il pilote les actions menées et est également l\'interlocuteur privilégié de la Dihal sur le sujet.',
        national_permissions: [
            [{ type: 'view', label: 'Consulter les %sites%', comments: 'dont les procédures judiciaires' }],
            [{ type: 'view', label: 'Consulter les %dispositifs%', comments: 'hors financements' }],
        ],
        local_permissions: [
            [{ type: 'edit', label: 'Créer, mettre à jour les %sites%', comments: 'dont les procédures judiciaires' }],
            [{ type: 'edit', label: 'Mettre à jour les %dispositifs%', comments: 'dont les financements' }],
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
                    type: 'view', label: 'Consulter les procédures judiciaires', comments: null, option: 'hide_justice',
                },
            ],
            [{ type: 'edit', label: 'Mettre à jour les %dispositifs%', comments: 'hors financements' }],
        ],
        options: [
            { id: 'close_shantytown', label: 'Autoriser le partenaire à créer un site et déclarer la fermeture d\'un site' },
            { id: 'hide_justice', label: 'Masquer les procédures judiciaires' },
        ],
    },
    association: {
        description: 'L\'opérateur est la structure chargée d\'intervenir auprès des habitants dans une perspective de résorption des bidonvilles.',
        national_permissions: [],
        local_permissions: [
            [
                { type: 'edit', label: 'Mettre à jour les %sites%', comments: null },
                {
                    type: 'deny', label: 'hors fermeture des sites', comments: null, option: 'create_and_close_shantytown',
                },
                {
                    type: 'deny', label: 'hors création des sites', comments: null, option: 'create_and_close_shantytown',
                },
                {
                    type: 'view', label: 'Consulter les procédures judiciaires', comments: null, option: 'hide_justice',
                },
            ],
            [{ type: 'view', label: 'Mettre à jour les %dispositifs%', comments: 'hors financements' }],
        ],
        options: [
            { id: 'create_and_close_shantytown', label: 'Autoriser l\'opérateur à créer un site et déclarer la fermeture d\'un site' },
            { id: 'hide_justice', label: 'Masquer les procédures judiciaires' },
        ],
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
