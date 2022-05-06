import dateUtils from '#server/utils/date';

const { fromTsToFormat } = dateUtils;

export default (oldVersion, newVersion) => {
    const properties = [
        'name', 'builtAt', 'declaredAt', 'addressSimple',
        'addressDetails', 'fieldType', 'ownerType', 'owner', 'isReinstallation', 'reinstallationComments', 'censusStatus', 'censusConductedAt',
        'censusConductedBy', 'populationTotal', 'populationCouples',
        'populationMinors', 'populationMinors0To3', 'populationMinors3To6', 'populationMinors6To12',
        'populationMinors12To16', 'populationMinors16To18', 'minorsInSchool',
        'socialOrigins', 'electricityType', 'electricityComments', 'accessToSanitary', 'sanitaryComments', 'accessToWater', 'waterComments',
        'trashEvacuation', 'ownerComplaint', 'justiceProcedure', 'justiceRendered', 'justiceRenderedAt',
        'justiceRenderedBy', 'justiceChallenged', 'policeStatus', 'policeRequestedAt', 'policeGrantedAt',
        'bailiff', 'waterPotable', 'waterContinuousAccess', 'waterPublicPoint', 'waterDistance', 'waterRoadsToCross',
        'waterEveryoneHasAccess', 'waterStagnantWater', 'waterHandWashAccess', 'waterHandWashAccessNumber', 'sanitaryNumber',
        'sanitaryInsalubrious', 'sanitaryOnSite', 'trashCansOnSite', 'trashAccumulation', 'trashEvacuationRegular',
        'vermin', 'verminComments', 'firePreventionMeasures', 'firePreventionDiagnostic', 'firePreventionSiteAccessible', 'firePreventionDevices', 'firePreventionComments',
    ];

    const labels = {
        name: 'Appellation du site',
        builtAt: 'Date d\'installation',
        declaredAt: 'Date de signalement',
        addressSimple: 'Adresse',
        latitude: 'Latitude',
        longitude: 'Longitude',
        addressDetails: 'Informations d\'accès',
        fieldType: 'Type de site',
        ownerType: 'Type de propriétaire',
        owner: 'Propriétaire',
        isReinstallation: 'S\'agit-il d\'une réinstallation ?',
        reinstallationComments: 'Précisions sur la réinstallation',
        censusStatus: 'Statut du diagnostic',
        censusConductedAt: 'Date du diagnostic',
        censusConductedBy: 'Opérateur en charge du diagnostic',
        populationTotal: 'Nombre de personnes',
        populationCouples: 'Nombre de ménages',
        populationMinors: 'Nombre de mineurs',
        populationMinors0To3: 'Mineurs (0 à 3 ans)',
        populationMinors3To6: 'Mineurs (3 à 6 ans)',
        populationMinors6To12: 'Mineurs (6 à 12 ans)',
        populationMinors12To16: 'Mineurs (12 à 16 ans)',
        populationMinors16To18: 'Mineurs (16 à 18 ans)',
        minorsInSchool: 'Nombre de mineurs inscrits dans un établissement scolaire',
        socialOrigins: 'Origines',
        electricityType: 'Accès à l\'électricité',
        electricityComments: 'Modalités d\'accès à l\'électricité',
        accessToWater: 'Accès à l\'eau',
        accessToSanitary: 'Accès à des toilettes',
        sanitaryComments: 'Modalités d\'accès aux toilettes',
        waterComments: 'Modalités d\'accès à l\'eau',
        trashEvacuation: 'Évacuation des déchets',
        ownerComplaint: 'Dépôt de plainte par le propriétaire',
        justiceProcedure: 'Existence d\'une procédure judiciaire',
        justiceRendered: 'Décision de justice rendue',
        justiceRenderedBy: 'Origine de la décision',
        justiceRenderedAt: 'Date de la décision',
        justiceChallenged: 'Contentieux relatif à la décision de justice',
        policeStatus: 'Concours de la force publique',
        policeRequestedAt: 'Date de la demande du CFP',
        policeGrantedAt: 'Date d\'octroi du CFP',
        bailiff: 'Nom de l\'étude d\'huissiers',
        waterPotable: 'L’eau est-elle potable ?',
        waterContinuousAccess: 'L\'accès à l\'eau est-il continu?',
        waterPublicPoint: 'Est-ce un point d\'eau public?',
        waterDistance: 'Où se situe l\'accès à l\'eau?',
        waterRoadsToCross: 'L\'accès nécessite-t-il un franchissement de rue ou de route ?',
        waterEveryoneHasAccess: 'Tous les habitants ont-ils accès aux points d’eau ?',
        waterStagnantWater: 'Existe-t-il des eaux stagnantes autour du point de distribution ?',
        waterHandWashAccess: 'Est-ce qu’il y a des bacs de lavage des mains ?',
        waterHandWashAccessNumber: 'Quel est le nombre de bacs de lavage des mains ?',
        sanitaryNumber: 'Nombre de toilettes ?',
        sanitaryInsalubrious: 'Constate-t-on des marques de défécation à l’air libre ?',
        sanitaryOnSite: 'Les toilettes se situent-elles sur le site ?',
        trashCansOnSite: 'Combien de poubelles / bennes sont à proximité immédiate du site ?',
        trashAccumulation: 'Constate-t-on une accumulation de déchets sur le site ou aux abords ?',
        trashEvacuationRegular: 'La collecte des poubelles / bennes est-elle réalisée de manière régulière ?',
        vermin: 'Y a-t-il des nuisibles sur le site ou à proximité ?',
        verminComments: 'Précision concernant les nuisibles ?',
        firePreventionMeasures: 'Y a-t-il des mesures “prévention incendie” ?',
        firePreventionDiagnostic: 'Est-ce qu’un diagnostic prévention incendie par le SDIS a été réalisé ?',
        firePreventionSiteAccessible: 'Est-ce que le site est accessible aux pompiers ?',
        firePreventionDevices: 'Est-ce que des dispositifs spécifiques ont été mis en place ?',
        firePreventionComments: 'Prévention incendie : Préciser',
    };

    const baseProcessors = {
        default(value) {
            if (value === null || value === '') {
                return 'non renseigné';
            }

            return value;
        },
        date(ts) {
            if (ts === null) {
                return 'non renseignée';
            }

            return fromTsToFormat(ts, 'd M Y');
        },
        bool(b) {
            if (b === null) {
                return 'inconnu';
            }

            return b === true ? 'oui' : 'non';
        },
    };

    const processors = {
        builtAt: baseProcessors.date,
        declaredAt: baseProcessors.date,
        fieldType(f) {
            if (f === null) {
                return 'non renseigné';
            }

            return f.label;
        },
        ownerType(o) {
            if (o === null) {
                return 'non renseigné';
            }

            return o.label;
        },
        isReinstallation: baseProcessors.bool,
        censusStatus(c) {
            const statuses = {
                none: 'non prévu',
                scheduled: 'prévu',
                done: 'réalisé',
            };

            return c === null ? 'inconnu' : statuses[c];
        },
        censusConductedAt: baseProcessors.date,
        socialOrigins(s) {
            if (s.length === 0) {
                return 'non renseignées';
            }

            const originLabels = s.map(({ label }) => label);
            if (originLabels.length === 1) {
                return originLabels[0];
            }

            return [
                originLabels.slice(0, originLabels.length - 1).join(', '),
                originLabels.slice(originLabels.length - 1),
            ].join(', et ');
        },
        electricityType(e) {
            if (e === null) {
                return 'non renseigné';
            }

            return e.label;
        },
        accessToWater: baseProcessors.bool,
        accessToSanitary: baseProcessors.bool,
        trashEvacuation: baseProcessors.bool,
        ownerComplaint: baseProcessors.bool,
        justiceProcedure: baseProcessors.bool,
        justiceRendered: baseProcessors.bool,
        justiceRenderedAt: baseProcessors.date,
        justiceChallenged: baseProcessors.bool,
        policeStatus(p) {
            const statuses = {
                none: 'non demandé',
                requested: 'demandé',
                granted: 'obtenu',
            };

            return p === null ? 'inconnu' : statuses[p];
        },
        policeRequestedAt: baseProcessors.date,
        policeGrantedAt: baseProcessors.date,
        waterPotable: baseProcessors.bool,
        waterContinuousAccess: baseProcessors.bool,
        waterPublicPoint: baseProcessors.bool,
        waterRoadsToCross: baseProcessors.bool,
        waterEveryoneHasAccess: baseProcessors.bool,
        waterStagnantWater: baseProcessors.bool,
        waterHandWashAccess: baseProcessors.bool,
        sanitaryInsalubrious: baseProcessors.bool,
        sanitaryOnSite: baseProcessors.bool,
        trashAccumulation: baseProcessors.bool,
        trashEvacuationRegular: baseProcessors.bool,
        vermin: baseProcessors.bool,
        firePreventionMeasures: baseProcessors.bool,
        firePreventionDiagnostic: baseProcessors.bool,
        firePreventionDevices: baseProcessors.bool,
        firePreventionSiteAccessible: baseProcessors.bool,
    };

    return properties.reduce((diff, property) => {
        const processor = processors[property] || baseProcessors.default;
        const oldValue = processor(oldVersion[property]);
        const newValue = processor(newVersion[property]);

        if (oldValue === newValue) {
            return diff;
        }

        return [
            ...diff,
            {
                fieldKey: property,
                field: labels[property],
                oldValue,
                newValue,
            },
        ];
    }, []);
};
