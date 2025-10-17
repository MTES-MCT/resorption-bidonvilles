import dateUtils from '#server/utils/date';
import electricityAccessTypes from '#server/models/electricityAccessTypesModel/_common/electricityAccessTypes';
import waterAccessTypes from '#server/models/_common/waterAccessTypes';
import toiletTypes from '#server/models/shantytownToiletTypesModel/_common/toiletTypes';

const { fromTsToFormat } = dateUtils;

function getDeepProperty(obj, path) {
    return path.split('.').reduce((acc, curr) => acc?.[curr], obj);
}

export type Diff = {
    fieldKey: string,
    field: string,
    oldValue: string,
    newValue: string
};
export default (oldVersion, newVersion): Diff[] => {
    const baseProcessors = {
        default(value) {
            if (value === null || value === '' || value === undefined) {
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
            if (b === null || b === undefined) {
                return 'inconnu';
            }

            return b === true ? 'oui' : 'non';
        },
    };

    let toDiff = {
        updatedWithoutAnyChange: {
            label: 'Site mis à jour sans modification',
        },
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
                if (!f) {
                    return 'non renseigné';
                }

                return f.label;
            },
        },
        ownerType: {
            label: 'Type de propriétaire',
            processor(o) {
                if (!o) {
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
                    none: 'non prévu',
                    scheduled: 'prévu',
                    done: 'réalisé',
                };
                if (c === null) {
                    return 'inconnu';
                }
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
        populationTotalFemales: {
            label: 'Nombre de personnes dont femmes et filles',
        },
        populationCouples: {
            label: 'Nombre de ménages',
        },
        populationMinors: {
            label: 'Nombre de mineurs',
        },
        populationMinorsGirls: {
            label: 'Nombre de mineurs dont filles',
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
        tents: {
            label: 'Nombre de tentes',
        },
        cars: {
            label: 'Nombre de voitures dortoir',
        },
        mattresses: {
            label: 'Nombre de matelas',
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
            label: 'Date de la décision de justice',
            processor: baseProcessors.date,
        },
        justiceRenderedBy: {
            label: 'Origine de la décision de justice',
        },
        justiceChallenged: {
            label: 'Appel en cours',
            processor: baseProcessors.bool,
        },
        policeStatus: {
            label: 'Concours de la force publique',
            processor(p) {
                const statuses = {
                    none: 'non demandé',
                    requested: 'demandé',
                    granted: 'obtenu',
                    refused: 'refusé',
                };
                if (p === null) {
                    return 'inconnu';
                }

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
        existingLitigation: {
            label: "Existence d'un contentieux ?",
            processor: baseProcessors.bool,
        },
        evacuationUnderTimeLimit: {
            label: "Existence d'une procédure administrative",
            processor: baseProcessors.bool,
        },
        administrativeOrderDecisionAt: {
            label: "Date de l'arrêté de la procédure administrative",
            processor: baseProcessors.date,
        },
        administrativeOrderDecisionRenderedBy: {
            label: "Qui  a pris l'arrêté de la procédure administrative ?",
        },
        administrativeOrderEvacuationAt: {
            label: "Date de l'évacuation",
            processor: baseProcessors.date,
        },
        insalubrityOrder: {
            label: "Existence d'un arrêté d'insalubrité",
            processor: baseProcessors.bool,
        },
        insalubrityOrderDisplayed: {
            label: "Affichage de l'arrêté d'insalubrité ou notification ?",
            processor: baseProcessors.bool,
        },
        insalubrityOrderType: {
            label: "Type d'arrêté d'insalubrité (arrêté de mise en sécurité, autre...)",
        },
        insalubrityOrderBy: {
            label: "Qui a pris l'arrêté d'insalubrité ?",
        },
        insalubrityOrderAt: {
            label: "Date de l'arrêté d'insalubrité",
            processor: baseProcessors.date,
        },
        insalubrityParcels: {
            label: "Parcelles concernées par l'arrêté d'insalubrité (numéros de parcelles)",
        },
        latitude: {
            label: 'Coordonnées GPS : Latitude',
        },
        longitude: {
            label: 'Coordonnées GPS : Longitude',
        },
        preparatoryPhasesTowardResorption: {
            label: 'Phases préparatoires à la résorption',
            processor(phases) {
                if (!phases || phases.length === 0) {
                    return 'non renseignées';
                }

                try {
                    // Transformer les objets JSON en un objet indexé par uid pour comparaison
                    const phasesMap = {};
                    phases.forEach((phase) => {
                        if (typeof phase === 'string') {
                            // Ancien format : on ne peut pas comparer individuellement
                            phasesMap[phase] = phase;
                        } else if (typeof phase === 'object' && phase !== null) {
                            // Gérer les deux formats : historique (uid/name) et actuel (preparatoryPhaseId/preparatoryPhaseName)
                            const uid = phase.uid || phase.preparatoryPhaseId || phase.name || phase.preparatoryPhaseName;
                            if (uid) {
                                phasesMap[uid] = phase;
                            }
                        }
                    });
                    return phasesMap;
                } catch (error) {
                    return {};
                }
            },
            comparator(oldPhasesMap, newPhasesMap) {
                // Fonction personnalisée pour comparer phase par phase
                const formatPhase = (phase) => {
                    if (typeof phase === 'string') {
                        return phase;
                    }
                    // Gérer les deux formats
                    let result = phase.name || phase.preparatoryPhaseName || '';
                    if (phase.completedAt) {
                        // completedAt peut être une string ISO ou un timestamp
                        const date = typeof phase.completedAt === 'number'
                            ? new Date(phase.completedAt * 1000)
                            : new Date(phase.completedAt);
                        const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                        const dateLabel = phase.dateLabel || phase.preparatoryPhaseDateLabel || '';
                        if (dateLabel) {
                            result += ` ${dateLabel.charAt(0).toLowerCase()}${dateLabel.slice(1)} ${formattedDate}`;
                        }
                    }
                    return result;
                };

                // Gérer les différentes orthographes de "non renseigné(e)(s)"
                const isNotFilled = value => typeof value === 'string' && ['non renseignées', 'non renseigné', 'non renseignés'].includes(value);
                const oldMap = isNotFilled(oldPhasesMap) ? {} : oldPhasesMap;
                const newMap = isNotFilled(newPhasesMap) ? {} : newPhasesMap;

                const allUids = new Set([...Object.keys(oldMap), ...Object.keys(newMap)]);
                const changeLines = [];

                allUids.forEach((uid) => {
                    const oldPhase = oldMap[uid];
                    const newPhase = newMap[uid];

                    const oldFormatted = oldPhase ? formatPhase(oldPhase) : null;
                    const newFormatted = newPhase ? formatPhase(newPhase) : null;

                    if (oldFormatted !== newFormatted) {
                        // Pour chaque phase modifiée, créer une ligne avec le format:
                        // "nouvelle valeur, ~~ancienne valeur~~"
                        // Si pas d'ancienne valeur, ne rien afficher après la virgule
                        changeLines.push({
                            new: newFormatted || 'non renseigné',
                            old: oldFormatted,
                        });
                    }
                });

                if (changeLines.length === 0) {
                    return null; // Pas de changement
                }

                // Retourner les valeurs dans le bon ordre
                return {
                    oldValue: changeLines.map(l => l.old).filter(Boolean).join('\n') || 'non renseignés',
                    newValue: changeLines.map(l => l.new).join('\n'),
                };
            },
        },
    };

    const finalDiff = [];
    if (oldVersion.livingConditions.version === 1 && newVersion.livingConditions.version === 2) {
        finalDiff.push({
            fieldKey: 'livingConditions.version',
            field: 'Conditions de vie',
            oldValue: 'Ancien format',
            newValue: 'Nouveau format',
        });
    } else if (oldVersion.livingConditions.version === 2) {
        toDiff = {
            ...toDiff,
            ...{
                'livingConditions.electricity.access': {
                    label: 'Y a-t-il présence d’une installation électrique ?',
                    processor: baseProcessors.bool,
                },
                'livingConditions.electricity.access_types': {
                    label: "Quelle est la source de l'accès à l'électricité ?",
                    processor(accessTypes) {
                        if (accessTypes.length === 0) {
                            return 'non renseignée';
                        }

                        const labels = accessTypes.map(at => electricityAccessTypes[at]);
                        if (labels.length === 1) {
                            return labels[0];
                        }

                        return [
                            labels.slice(0, labels.length - 1).join(', '),
                            labels.slice(labels.length - 1),
                        ].join(', et ');
                    },
                },
                'livingConditions.electricity.access_is_unequal': {
                    label: "Des inégalités d’accès à l'électricité ont-elles été constatées ?",
                    processor: baseProcessors.bool,
                },
                'livingConditions.water.access_type': {
                    label: "Comment les habitants ont-ils accès à l'eau ?",
                    processor(accessType) {
                        if (!accessType) {
                            return 'non renseigné';
                        }

                        return waterAccessTypes[accessType];
                    },
                },
                'livingConditions.water.access_type_details': {
                    label: "Précisions concernant les modalités d'accès à l'eau",
                },
                'livingConditions.water.access_is_public': {
                    label: 'Est-ce un point d\'eau sur la voie publique ?',
                    processor: baseProcessors.bool,
                },
                'livingConditions.water.access_is_continuous': {
                    label: "L'accès à l'eau est-il continu ?",
                    processor: baseProcessors.bool,
                },
                'livingConditions.water.access_is_continuous_details': {
                    label: "Précisions concernant la discontinuité de l'accès à l'eau",
                },
                'livingConditions.water.access_is_local': {
                    label: "Où se situe l'accès à l'eau ?",
                    processor: baseProcessors.bool,
                },
                'livingConditions.water.access_is_close': {
                    label: 'Distance point d’eau / habitation la plus éloignée ?',
                    processor: baseProcessors.bool,
                },
                'livingConditions.water.access_is_unequal': {
                    label: 'Des inégalités d\'accès à l\'eau ont-elles été constatées ?',
                    processor: baseProcessors.bool,
                },
                'livingConditions.water.access_is_unequal_details': {
                    label: 'Précisions concernant les inégalités d\'accès à l\'eau',
                },
                'livingConditions.water.access_has_stagnant_water': {
                    label: 'Existe-t-il des eaux stagnantes autour du point de distribution ?',
                    processor: baseProcessors.bool,
                },
                'livingConditions.water.access_comments': {
                    label: 'Informations complémentaires sur l\'accès à l\'eau',
                },
                'livingConditions.sanitary.open_air_defecation': {
                    label: 'Constate-t-on des marques de défécation à l’air libre ?',
                    processor: baseProcessors.bool,
                },
                'livingConditions.sanitary.working_toilets': {
                    label: 'Présence de toilettes fonctionnelles et utilisées ?',
                    processor: baseProcessors.bool,
                },
                'livingConditions.sanitary.toilet_types': {
                    label: 'Quels sont les types de toilettes installées ?',
                    processor(types) {
                        if (types.length === 0) {
                            return 'non renseignée';
                        }

                        const labels = types.map(tt => toiletTypes[tt]);
                        if (labels.length === 1) {
                            return labels[0];
                        }

                        return [
                            labels.slice(0, labels.length - 1).join(', '),
                            labels.slice(labels.length - 1),
                        ].join(', et ');
                    },
                },
                'livingConditions.sanitary.toilets_are_inside': {
                    label: 'Les toilettes sont-elles à l’intérieur du site ?',
                    processor: baseProcessors.bool,
                },
                'livingConditions.sanitary.toilets_are_lighted': {
                    label: 'Ces toilettes sont-elles éclairées et verrouillables de l’intérieur ?',
                    processor: baseProcessors.bool,
                },
                'livingConditions.sanitary.hand_washing': {
                    label: 'Y a-t-il un point de lavage des mains à proximité des toilettes ?',
                    processor: baseProcessors.bool,
                },
                'livingConditions.trash.is_piling': {
                    label: 'Constate-t-on une accumulation de déchets type ordures ménagères sur le site ou aux abords ?',
                    processor: baseProcessors.bool,
                },
                'livingConditions.trash.evacuation_is_close': {
                    label: 'Y a-t-il des dispositifs de ramassage des ordures ménagères à proximité immédiate ?',
                    processor: baseProcessors.bool,
                },
                'livingConditions.trash.evacuation_is_safe': {
                    label: 'Les dispositifs de ramassages des ordures sont-ils en bon état ?',
                    processor: baseProcessors.bool,
                },
                'livingConditions.trash.evacuation_is_regular': {
                    label: 'La collecte des poubelles est-elle réalisée de manière régulière ?',
                    processor: baseProcessors.bool,
                },
                'livingConditions.trash.bulky_is_piling': {
                    label: 'Constate-t-on une accumulation de déchets type encombrants ?',
                    processor: baseProcessors.bool,
                },
                'livingConditions.pest_animals.presence': {
                    label: 'Y a-t-il des nuisibles à proximité ?',
                    processor: baseProcessors.bool,
                },
                'livingConditions.pest_animals.details': {
                    label: 'Précision concernant les nuisibles',
                },
                'livingConditions.fire_prevention.diagnostic': {
                    label: 'Est-ce qu’un diagnostic prévention incendie par le SDIS a été réalisé ?',
                    processor: baseProcessors.bool,
                },
            },
        };
    } else {
        toDiff = {
            ...toDiff,
            ...{
                'livingConditions.electricity.type': {
                    label: "Accès à l'électricité",
                    processor(e) {
                        if (!e) {
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
            },
        };
    }

    const result = [
        ...finalDiff,
        ...Object.keys(toDiff).reduce((diff, serializedKey) => {
            const config = toDiff[serializedKey];
            const processor = config.processor ?? baseProcessors.default;
            const oldProcessed = processor(getDeepProperty(oldVersion, serializedKey));
            const newProcessed = processor(getDeepProperty(newVersion, serializedKey));

            // Si un comparator personnalisé est défini, l'utiliser
            if (config.comparator) {
                const comparisonResult = config.comparator(oldProcessed, newProcessed);

                if (comparisonResult === null) {
                    // Pas de changement
                    return diff;
                }

                return [
                    ...diff,
                    {
                        fieldKey: serializedKey,
                        field: config.label,
                        oldValue: comparisonResult.oldValue,
                        newValue: comparisonResult.newValue,
                    },
                ];
            }

            // Sinon, utiliser la comparaison par défaut
            if (oldProcessed === newProcessed) {
                return diff;
            }

            return [
                ...diff,
                {
                    fieldKey: serializedKey,
                    field: config.label,
                    oldValue: oldProcessed,
                    newValue: newProcessed,
                },
            ];
        }, []),
    ];

    return result;
};
