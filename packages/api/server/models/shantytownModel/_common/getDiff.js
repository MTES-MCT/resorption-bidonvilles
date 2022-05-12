const { fromTsToFormat } = require('#server/utils/date');

function getDeepProperty(obj, path) {
    return path.split('.').reduce((acc, curr) => acc && acc[curr], obj);
}

module.exports = (oldVersion, newVersion) => {
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

    const toDiff = {
        name: {
            label: 'Appellation du site',
        },
        builtAt: {
            label: "Date d'installation",
            processor: baseProcessors.date,
        },
        declaredAt: {
            label: 'Date de signalement',
            processor: baseProcessors.date,
        },
        addressSimple: {
            label: 'Adresse',
        },
        addressDetails: {
            label: "Informations d'accès",
        },
        fieldType: {
            label: 'Type de site',
            processor(f) {
                if (f === null) {
                    return 'non renseigné';
                }

                return f.label;
            },
        },
        ownerType: {
            label: 'Type de propriétaire',
            processor(o) {
                if (o === null) {
                    return 'non renseigné';
                }

                return o.label;
            },
        },
        owner: {
            label: 'Propriétaire',
        },
        isReinstallation: {
            label: "S'agit-il d'une réinstallation ?",
            processor: baseProcessors.bool,
        },
        reinstallationComments: {
            label: 'Précisions sur la réinstallation',
        },
        censusStatus: {
            label: 'Statut du diagnostic',
            processor(c) {
                const statuses = {
                    [null]: 'inconnu',
                    none: 'non prévu',
                    scheduled: 'prévu',
                    done: 'réalisé',
                };

                return statuses[c];
            },
        },
        censusConductedAt: {
            label: 'Date du diagnostic',
            processor: baseProcessors.date,
        },
        censusConductedBy: {
            label: 'Opérateur en charge du diagnostic',
        },
        populationTotal: {
            label: 'Nombre de personnes',
        },
        populationCouples: {
            label: 'Nombre de ménages',
        },
        populationMinors: {
            label: 'Nombre de mineurs',
        },
        populationMinors0To3: {
            label: 'Mineurs (0 à 3 ans)',
        },
        populationMinors3To6: {
            label: 'Mineurs (3 à 6 ans)',
        },
        populationMinors6To12: {
            label: 'Mineurs (6 à 12 ans)',
        },
        populationMinors12To16: {
            label: 'Mineurs (12 à 16 ans)',
        },
        populationMinors16To18: {
            label: 'Mineurs (16 à 18 ans)',
        },
        minorsInSchool: {
            label: 'Nombre de mineurs inscrits dans un établissement scolaire',
        },
        caravans: {
            label: 'Nombre de caravanes',
        },
        huts: {
            label: 'Nombre de cabanes',
        },
        socialOrigins: {
            label: 'Origines',
            processor(s) {
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
        },
        ownerComplaint: {
            label: 'Dépôt de plainte par le propriétaire',
            processor: baseProcessors.bool,
        },
        justiceProcedure: {
            label: "Existence d'une procédure judiciaire",
            processor: baseProcessors.bool,
        },
        justiceRendered: {
            label: 'Décision de justice rendue',
            processor: baseProcessors.bool,
        },
        justiceRenderedAt: {
            label: 'Date de la décision',
            processor: baseProcessors.date,
        },
        justiceRenderedBy: {
            label: 'Origine de la décision',
        },
        justiceChallenged: {
            label: 'Contentieux relatif à la décision de justice',
            processor: baseProcessors.bool,
        },
        policeStatus: {
            label: 'Concours de la force publique',
            processor(p) {
                const statuses = {
                    [null]: 'inconnu',
                    none: 'non demandé',
                    requested: 'demandé',
                    granted: 'obtenu',
                };

                return statuses[p];
            },
        },
        policeRequestedAt: {
            label: 'Date de la demande du CFP',
            processor: baseProcessors.date,
        },
        policeGrantedAt: {
            label: "Date d'octroi du CFP",
            processor: baseProcessors.date,
        },
        bailiff: {
            label: "Nom de l'étude d'huissiers",
        },
        'livingConditions.electricity.type': {
            label: "Accès à l'électricité",
            processor(e) {
                if (e === null) {
                    return 'non renseigné';
                }

                return e.label;
            },
        },
        'livingConditions.electricity.comments': {
            label: "Modalités d'accès à l'électricité",
        },
        'livingConditions.water.access': {
            label: "Accès à l'eau",
            processor: baseProcessors.bool,
        },
        'livingConditions.water.comments': {
            label: "Modalités d'accès à l'eau",
        },
        'livingConditions.water.potable': {
            label: 'L’eau est-elle potable ?',
            processor: baseProcessors.bool,
        },
        'livingConditions.water.continuousAccess': {
            label: "L'accès à l'eau est-il continu?",
            processor: baseProcessors.bool,
        },
        'livingConditions.water.publicPoint': {
            label: "Est-ce un point d'eau public?",
            processor: baseProcessors.bool,
        },
        'livingConditions.water.distance': {
            label: "Où se situe l'accès à l'eau?",
        },
        'livingConditions.water.roadsToCross': {
            label: "L'accès nécessite-t-il un franchissement de rue ou de route ?",
            processor: baseProcessors.bool,
        },
        'livingConditions.water.everyoneHasAccess': {
            label: 'Tous les habitants ont-ils accès aux points d’eau ?',
            processor: baseProcessors.bool,
        },
        'livingConditions.water.stagnantWater': {
            label: 'Existe-t-il des eaux stagnantes autour du point de distribution ?',
            processor: baseProcessors.bool,
        },
        'livingConditions.water.handWashAccess': {
            label: 'Est-ce qu’il y a des bacs de lavage des mains ?',
            processor: baseProcessors.bool,
        },
        'livingConditions.water.handWashAccessNumber': {
            label: 'Quel est le nombre de bacs de lavage des mains ?',
        },
        'livingConditions.sanitary.access': {
            label: 'Accès à des toilettes',
            processor: baseProcessors.bool,
        },
        'livingConditions.sanitary.comments': {
            label: "Modalités d'accès aux toilettes",
        },
        'livingConditions.sanitary.number': {
            label: 'Nombre de toilettes ?',
        },
        'livingConditions.sanitary.insalubrious': {
            label: 'Constate-t-on des marques de défécation à l’air libre ?',
            processor: baseProcessors.bool,
        },
        'livingConditions.sanitary.onSite': {
            label: 'Les toilettes se situent-elles sur le site ?',
            processor: baseProcessors.bool,
        },
        'livingConditions.trash.evacuation': {
            label: 'Évacuation des déchets',
            processor: baseProcessors.bool,
        },
        'livingConditions.trash.cansOnSite': {
            label: 'Combien de poubelles / bennes sont à proximité immédiate du site ?',
        },
        'livingConditions.trash.accumulation': {
            label: 'Constate-t-on une accumulation de déchets sur le site ou aux abords ?',
            processor: baseProcessors.bool,
        },
        'livingConditions.trash.evacuationRegular': {
            label: 'La collecte des poubelles / bennes est-elle réalisée de manière régulière ?',
            processor: baseProcessors.bool,
        },
        'livingConditions.vermin.vermin': {
            label: 'Présence de nuisibles',
            processor: baseProcessors.bool,
        },
        'livingConditions.vermin.comments': {
            label: 'Précision concernant les nuisibles ?',
        },
        'livingConditions.firePrevention.measures': {
            label: 'Y a-t-il des mesures “prévention incendie” ?',
            processor: baseProcessors.bool,
        },
        'livingConditions.firePrevention.diagnostic': {
            label: 'Est-ce qu’un diagnostic prévention incendie par le SDIS a été réalisé ?',
            processor: baseProcessors.bool,
        },
        'livingConditions.firePrevention.siteAccessible': {
            label: 'Est-ce que le site est accessible aux pompiers ?',
            processor: baseProcessors.bool,
        },
        'livingConditions.firePrevention.devices': {
            label: 'Est-ce que des dispositifs spécifiques ont été mis en place ?',
            processor: baseProcessors.bool,
        },
        'livingConditions.firePrevention.comments': {
            label: 'Prévention incendie : Préciser',
        },
    };

    return Object.keys(toDiff).reduce((diff, serializedKey) => {
        const processor = toDiff[serializedKey].processor || baseProcessors.default;
        const oldValue = processor(getDeepProperty(oldVersion, serializedKey));
        const newValue = processor(getDeepProperty(newVersion, serializedKey));

        if (oldValue === newValue) {
            return diff;
        }

        return [
            ...diff,
            {
                fieldKey: serializedKey,
                field: toDiff[serializedKey].label,
                oldValue,
                newValue,
            },
        ];
    }, []);
};
