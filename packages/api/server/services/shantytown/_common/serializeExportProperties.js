const { fromTsToFormat: tsToString } = require('#server/utils/date');
const userModel = require('#server/models/userModel');
const shantytownActorThemes = require('#server/config/shantytown_actor_themes');
const { webappUrl } = require('#server/config');
const electricityAccessTypes = require('#server/models/electricityAccessTypesModel/_common/electricityAccessTypes');
const waterAccessTypes = require('#server/models/_common/waterAccessTypes');
const toiletTypes = require('#server/models/shantytownToiletTypesModel/_common/toiletTypes');

module.exports = (closingSolutions) => {
    const COLUMN_WIDTHS = {
        XSMALL: 15,
        SMALL: 20,
        MEDIUM: 25,
        LARGE: 35,
    };

    const STATUS_DETAILS = {
        closed_by_justice: 'Exécution d\'une décision de justice',
        closed_by_admin: 'Exécution d\'une décision administrative',
        other: 'Autre',
        unknown: 'Raison inconnue',
    };

    // properties
    const covidTags = {
        equipe_maraude: 'Équipe de maraude',
        equipe_sanitaire: 'Équipe sanitaire',
        equipe_accompagnement: 'Équipe d\'accompagnement',
        distribution_alimentaire: 'Distribution d\'aide alimentaire',
        action_mediation_sante: 'Action de médiation en santé',
        sensibilisation_vaccination: 'Sensibilisation à la vaccination',
        equipe_mobile_depistage: 'Équipe mobile de dépistage',
        equipe_mobile_vaccination: 'Équipe mobile de vaccination',
        personnes_orientees: 'Personne(s) orientée(s) vers un centre d\'hébergement spécialisé (desserrement)',
        personnes_avec_symptomes: 'Personnes avec des symptômes Covid-19',
        besoin_action: 'Besoin d\'une action prioritaire',
    };

    const properties = {
        departement: {
            title: 'Département',
            data: ({ departement }) => `${departement.code} - ${departement.name}`,
            align: 'left',
            width: COLUMN_WIDTHS.LARGE,
        },
        city: {
            title: 'Commune',
            data: ({ city }) => city.name,
            bold: true,
            align: 'left',
            width: COLUMN_WIDTHS.MEDIUM,
        },
        citycode: {
            title: 'Code INSEE',
            data: ({ city }) => city.code,
            bold: true,
            align: 'left',
            width: COLUMN_WIDTHS.SMALL,
        },
        address: {
            title: 'Adresse',
            data: ({ addressSimple }) => addressSimple,
            link({ id }) {
                return `${webappUrl}/site/${id}`;
            },
            bold: true,
            align: 'left',
            width: COLUMN_WIDTHS.MEDIUM,
        },
        addressDetails: {
            title: 'Informations d\'accès',
            data: ({ addressDetails }) => addressDetails,
            width: COLUMN_WIDTHS.LARGE,
        },
        coordinates: {
            title: 'Coordonnées GPS',
            data: ({ latitude, longitude }) => `${latitude},${longitude}`,
            width: COLUMN_WIDTHS.SMALL,
        },
        name: {
            title: 'Appellation du site',
            data: ({ name }) => name,
            width: COLUMN_WIDTHS.LARGE,
        },
        fieldType: {
            title: 'Type de site',
            data: ({ fieldType }) => fieldType.label,
            width: COLUMN_WIDTHS.SMALL,
        },
        builtAt: {
            title: 'Date d\'installation',
            data: ({ builtAt }) => (builtAt ? new Date(builtAt * 1000) : ''),
            width: COLUMN_WIDTHS.SMALL,
        },
        declaredAt: {
            title: 'Date de signalement',
            data: ({ declaredAt }) => (declaredAt ? new Date(declaredAt * 1000) : ''),
            width: COLUMN_WIDTHS.SMALL,
        },
        closedAt: {
            title: 'Date de fermeture',
            data: ({ closedAt }) => (closedAt ? new Date(closedAt * 1000) : ''),
            width: COLUMN_WIDTHS.SMALL,
        },
        closedWithSolutions: {
            title: 'Résorbé',
            data: ({ closedWithSolutions }) => (closedWithSolutions === 'yes' ? 'Oui' : 'Non'),
            width: COLUMN_WIDTHS.XSMALL,
        },
        status: {
            title: 'Cause de la fermeture',
            data: ({ status }) => STATUS_DETAILS[status],
            width: COLUMN_WIDTHS.SMALL,
        },
        ownerType: {
            title: 'Type de propriétaire',
            data: ({ ownerType }) => ownerType.label,
            width: COLUMN_WIDTHS.SMALL,
        },
        owner: {
            title: 'Identité du propriétaire',
            data: ({ owner }) => owner,
            width: COLUMN_WIDTHS.MEDIUM,
        },
        isReinstallation: {
            title: 'S\'agit-il d\'une réinstallation ?',
            data: ({ isReinstallation }) => {
                if (isReinstallation === true) {
                    return 'oui';
                }

                if (isReinstallation === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        reinstallationComments: {
            title: 'Précisions sur la réinstallation',
            data: ({ reinstallationComments }) => reinstallationComments,
            width: COLUMN_WIDTHS.LARGE,
        },
        populationTotal: {
            title: 'Nombre de personnes',
            data: ({ populationTotal }) => populationTotal,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        populationCouples: {
            title: 'Nombre de ménages',
            data: ({ populationCouples }) => populationCouples,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        populationMinors: {
            title: 'Nombre de mineurs',
            data: ({ populationMinors }) => populationMinors,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        populationMinors0To3: {
            title: '0 à 3 ans',
            data: ({ populationMinors0To3 }) => populationMinors0To3,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        populationMinors3To6: {
            title: '3 à 6 ans',
            data: ({ populationMinors3To6 }) => populationMinors3To6,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        populationMinors6To12: {
            title: '6 à 12 ans',
            data: ({ populationMinors6To12 }) => populationMinors6To12,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        populationMinors12To16: {
            title: '12 à 16 ans',
            data: ({ populationMinors12To16 }) => populationMinors12To16,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        populationMinors16To18: {
            title: '16 à 18 ans',
            data: ({ populationMinors16To18 }) => populationMinors16To18,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        minorsInSchool: {
            title: 'Enfants inscrits dans un établissement scolaire',
            data: ({ minorsInSchool }) => minorsInSchool,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        caravans: {
            title: 'Nombre de caravanes',
            data: ({ caravans }) => caravans,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        huts: {
            title: 'Nombre de cabanes',
            data: ({ huts }) => huts,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        socialOrigins: {
            title: 'Origines',
            data: ({ socialOrigins }) => (socialOrigins.length > 0 ? socialOrigins.map(({ label }) => label).join(';') : null),
            width: COLUMN_WIDTHS.MEDIUM,
        },
        electricityAccess: {
            title: 'Y a-t-il présence d’une installation électrique ?',
            data: (shantytown) => {
                const data = shantytown.livingConditions.electricity.access;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        electricityAccessTypes: {
            title: "Quelle est la source de l'accès à l'électricité ?",
            data: (shantytown) => {
                const data = shantytown.livingConditions.electricity.access_types;
                if (!data || data.length === 0) {
                    return null;
                }

                return data.map(at => electricityAccessTypes[at]).join('\n');
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        electricityAccessIsUnequal: {
            title: "Des inégalités d’accès à l'électricité ont-elles été constatées ?",
            data: (shantytown) => {
                const data = shantytown.livingConditions.electricity.access_is_unequal;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessType: {
            title: "Les habitants ont-ils accès à l'eau ?",
            data: (shantytown) => {
                const data = shantytown.livingConditions.water.access_type;
                if (!data) {
                    return null;
                }

                return waterAccessTypes[data];
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessTypeDetails: {
            title: "Précisions concernant les modalités d'accès à l'eau",
            data: shantytown => shantytown.livingConditions.water.access_type_details,
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessIsPublic: {
            title: 'Est-ce un point d\'eau sur la voie publique ?',
            data: (shantytown) => {
                const data = shantytown.livingConditions.water.access_is_public;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessIsContinuous: {
            title: "L'accès à l'eau est-il continu ?",
            data: (shantytown) => {
                const data = shantytown.livingConditions.water.access_is_continuous;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessIsContinuousDetails: {
            title: "Précisions concernant la discontinuité de l'accès à l'eau",
            data: shantytown => shantytown.livingConditions.water.access_is_continuous_details,
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessIsLocal: {
            title: "Où se situe l'accès à l'eau ?",
            data: (shantytown) => {
                const data = shantytown.livingConditions.water.access_is_local;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessIsClose: {
            title: 'Distance point d’eau / habitation la plus éloignée ?',
            data: (shantytown) => {
                const data = shantytown.livingConditions.water.access_is_close;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessIsUnequal: {
            title: 'Des inégalités d\'accès à l\'eau ont-elles été constatées ?',
            data: (shantytown) => {
                const data = shantytown.livingConditions.water.access_is_unequal;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessIsUnequalDetails: {
            title: 'Précisions concernant les inégalités d\'accès à l\'eau',
            data: shantytown => shantytown.livingConditions.water.access_is_unequal_details,
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessHasStagnantWater: {
            title: 'Existe-t-il des eaux stagnantes autour du point de distribution ?',
            data: (shantytown) => {
                const data = shantytown.livingConditions.water.access_has_stagnant_water;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessComments: {
            title: 'Informations complémentaires sur l\'accès à l\'eau',
            data: shantytown => shantytown.livingConditions.water.access_comments,
            width: COLUMN_WIDTHS.MEDIUM,
        },
        sanitaryOpenAirDefecation: {
            title: 'Constate-t-on des marques de défécation à l’air libre ?',
            data: (shantytown) => {
                const data = shantytown.livingConditions.sanitary.open_air_defecation;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        sanitaryWorkingToilets: {
            title: 'Présence de toilettes fonctionnelles et utilisées ?',
            data: (shantytown) => {
                const data = shantytown.livingConditions.sanitary.working_toilets;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        sanitaryToiletTypes: {
            title: 'Quels sont les types de toilettes installées ?',
            data: (shantytown) => {
                const data = shantytown.livingConditions.sanitary.toilet_types;
                if (!data || data.length === 0) {
                    return null;
                }

                return data.map(tt => toiletTypes[tt]).join('\n');
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        sanitaryToiletsAreInside: {
            title: 'Les toilettes sont-elles à l’intérieur du site ?',
            data: (shantytown) => {
                const data = shantytown.livingConditions.sanitary.toilets_are_inside;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        sanitaryToiletsAreLighted: {
            title: 'Ces toilettes sont-elles éclairées et verrouillables de l’intérieur ?',
            data: (shantytown) => {
                const data = shantytown.livingConditions.sanitary.toilets_are_lighted;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        sanitaryHandWashing: {
            title: 'Y a-t-il un point de lavage des mains à proximité des toilettes ?',
            data: (shantytown) => {
                const data = shantytown.livingConditions.sanitary.hand_washing;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        trashIsPiling: {
            title: 'Constate-t-on une accumulation de déchets type ordures ménagères sur le site ou aux abords ?',
            data: (shantytown) => {
                const data = shantytown.livingConditions.trash.is_piling;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        trashEvacuationIsClose: {
            title: 'Y a-t-il des dispositifs de ramassage des ordures ménagères à proximité immédiate ?',
            data: (shantytown) => {
                const data = shantytown.livingConditions.trash.evacuation_is_close;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        trashEvacuationIsSafe: {
            title: 'Les dispositifs de ramassages des ordures sont-ils en bon état ?',
            data: (shantytown) => {
                const data = shantytown.livingConditions.trash.evacuation_is_safe;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        trashEvacuationIsRegular: {
            title: 'La collecte des poubelles est-elle réalisée de manière régulière ?',
            data: (shantytown) => {
                const data = shantytown.livingConditions.trash.evacuation_is_regular;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        trashBulkyIsPiling: {
            title: 'Constate-t-on une accumulation de déchets type encombrants ?',
            data: (shantytown) => {
                const data = shantytown.livingConditions.trash.bulky_is_piling;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        pestAnimalsPresence: {
            title: 'Y a-t-il des nuisibles à proximité ?',
            data: (shantytown) => {
                if (!shantytown.livingConditions.pest_animals) {
                    return null;
                }

                const data = shantytown.livingConditions.pest_animals.presence;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        pestAnimalsDetails: {
            title: 'Précision concernant les nuisibles',
            data: (shantytown) => {
                if (!shantytown.livingConditions.pest_animals) {
                    return null;
                }

                return shantytown.livingConditions.pest_animals.details;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        firePreventionDiagnostic: {
            title: 'Est-ce qu’un diagnostic prévention incendie par le SDIS a été réalisé ?',
            data: (shantytown) => {
                if (!shantytown.livingConditions.firePrevention) {
                    return null;
                }

                const data = shantytown.livingConditions.firePrevention.diagnostic;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        censusStatus: {
            title: 'Statut du diagnostic social',
            data: ({ censusStatus }) => {
                switch (censusStatus) {
                    case null: return 'Inconnu';
                    case 'none': return 'Non prévu';
                    case 'scheduled': return 'Prévu';
                    case 'done': return 'Réalisé';
                    default: return null;
                }
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        censusConductedAt: {
            title: 'Date du diagnostic',
            data: ({ censusConductedAt }) => tsToString(censusConductedAt, 'd/m/Y'),
            width: COLUMN_WIDTHS.SMALL,
        },
        censusConductedBy: {
            title: 'Service en charge du diagnostic',
            data: ({ censusConductedBy }) => censusConductedBy,
            width: COLUMN_WIDTHS.SMALL,
        },
        ownerComplaint: {
            title: 'Dépôt de plainte par le propriétaire',
            data: ({ ownerComplaint }) => {
                if (ownerComplaint === true) {
                    return 'oui';
                }

                if (ownerComplaint === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        justiceProcedure: {
            title: 'Existence d\'une procédure judiciaire',
            data: ({ justiceProcedure }) => {
                if (justiceProcedure === true) {
                    return 'oui';
                }

                if (justiceProcedure === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        justiceRendered: {
            title: 'Décision de justice rendue',
            data: ({ justiceRendered }) => {
                if (justiceRendered === true) {
                    return 'oui';
                }

                if (justiceRendered === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        justiceRenderedAt: {
            title: 'Date de la décision',
            data: ({ justiceRenderedAt }) => (justiceRenderedAt ? new Date(justiceRenderedAt * 1000) : ''),
            width: COLUMN_WIDTHS.SMALL,
        },
        justiceRenderedBy: {
            title: 'Origine de la décision',
            data: ({ justiceRenderedBy }) => justiceRenderedBy,
            width: COLUMN_WIDTHS.MEDIUM,
        },
        justiceChallenged: {
            title: 'Contentieux',
            data: ({ justiceChallenged }) => {
                if (justiceChallenged === true) {
                    return 'oui';
                }

                if (justiceChallenged === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        policeStatus: {
            title: 'Concours de la force publique',
            data: ({ policeStatus }) => {
                switch (policeStatus) {
                    case null: return 'Inconnu';
                    case 'none': return 'Non demandé';
                    case 'requested': return 'Demandé';
                    case 'granted': return 'Obtenu';
                    default: return null;
                }
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        policeRequestedAt: {
            title: 'Date de la demande du CFP',
            data: ({ policeRequestedAt }) => (policeRequestedAt ? new Date(policeRequestedAt * 1000) : ''),
            width: COLUMN_WIDTHS.SMALL,
        },
        policeGrantedAt: {
            title: 'Date d\'octroi du CFP',
            data: ({ policeGrantedAt }) => (policeGrantedAt ? new Date(policeGrantedAt * 1000) : ''),
            width: COLUMN_WIDTHS.SMALL,
        },
        bailiff: {
            title: 'Nom de l\'étude d\'huissiers',
            data: ({ bailiff }) => bailiff,
            width: COLUMN_WIDTHS.MEDIUM,
        },
        updatedAt: {
            title: 'Site mis à jour le',
            data: ({ updatedAt }) => (updatedAt ? tsToString(updatedAt, 'd/m/Y') : ''),
            width: COLUMN_WIDTHS.SMALL,
        },
        actors: {
            title: 'Intervenants',
            data: ({ actors }) => actors.map((actor) => {
                const name = `${userModel.formatName(actor)}, ${actor.organization.name}`;
                const themes = actor.themes.map(({ id, value }) => value || shantytownActorThemes[id]).join(', ');

                return `- ${name} (${themes})`;
            }).join('\n'),
            width: COLUMN_WIDTHS.LARGE,
        },
        comments: {
            title: 'Commentaires',
            data: ({ comments }) => comments.regular.slice(0, 5).map(comment => `${tsToString(comment.createdAt, 'd/m/Y à h:i')} - ${userModel.formatName(comment.createdBy)}\n${comment.description}`).join('\n----\n'),
            width: COLUMN_WIDTHS.LARGE,
        },
        covidComments: {
            title: 'Commentaires COVID-19',
            data: ({ comments }) => comments.covid.slice(0, 5).map((comment) => {
                const tags = Object.keys(covidTags)
                    .filter(tag => comment.covid[tag] === true)
                    .map(tag => covidTags[tag])
                    .join('\n');

                return `${tsToString(comment.createdAt, 'd/m/Y à h:i')} - ${userModel.formatName(comment.createdBy)}\nDate de l'intervention : ${tsToString(comment.covid.date, 'd/m/Y')}\n${tags}\n${comment.description}`;
            }).join('\n----\n'),
            width: COLUMN_WIDTHS.LARGE,
        },

        hasPlan: {
            title: 'Le site fait-il l’objet d’une action ?',
            data: ({ plans }) => (plans.length > 0 ? 'oui' : 'non'),
            width: COLUMN_WIDTHS.SMALL,
        },

        resorptionTarget: {
            title: 'Site avec objectif de résorption ?',
            data: ({ resorptionTarget }) => {
                if (resorptionTarget === null) {
                    return null;
                }

                return resorptionTarget;
            },
            width: COLUMN_WIDTHS.SMALL,
        },

    };

    closingSolutions.forEach(({ id: solutionId }) => {
        properties[`closingSolution${solutionId}_population`] = {
            title: 'Nombre de personnes',
            data: ({ closingSolutions: solutions }) => {
                const solution = solutions.find(({ id }) => id === solutionId);
                if (solution === undefined) {
                    return '';
                }

                return solution.peopleAffected;
            },
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        };
        properties[`closingSolution${solutionId}_households`] = {
            title: 'Nombre de ménages',
            data: ({ closingSolutions: solutions }) => {
                const solution = solutions.find(({ id }) => id === solutionId);
                if (solution === undefined) {
                    return '';
                }

                return solution.householdsAffected;
            },
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        };
    });
    return properties;
};
