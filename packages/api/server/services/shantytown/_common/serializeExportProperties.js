const { fromTsToFormat: tsToString } = require('#server/utils/date');
const userModel = require('#server/models/userModel');
const shantytownActorThemes = require('#server/config/shantytown_actor_themes');
const { webappUrl } = require('#server/config');

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
        socialOrigins: {
            title: 'Origines',
            data: ({ socialOrigins }) => (socialOrigins.length > 0 ? socialOrigins.map(({ label }) => label).join(';') : null),
            width: COLUMN_WIDTHS.MEDIUM,
        },
        electricityType: {
            title: 'Accès à l\'électricité',
            data: ({ electricityType }) => electricityType.label,
            width: COLUMN_WIDTHS.SMALL,
        },
        electricityComments: {
            title: 'Modalités d\'accès à l\'électricité',
            data: ({ electricityComments }) => electricityComments,
            width: COLUMN_WIDTHS.LARGE,
        },
        accessToSanitary: {
            title: 'Accès à des toilettes',
            data: ({ accessToSanitary }) => {
                if (accessToSanitary === true) {
                    return 'oui';
                }

                if (accessToSanitary === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        sanitaryComments: {
            title: 'Modalités d\'accès aux toilettes',
            data: ({ sanitaryComments }) => sanitaryComments,
            width: COLUMN_WIDTHS.LARGE,
        },
        accessToWater: {
            title: 'Accès à l\'eau',
            data: ({ accessToWater }) => {
                if (accessToWater === true) {
                    return 'oui';
                }

                if (accessToWater === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        waterComments: {
            title: 'Modalités d\'accès à l\'eau',
            data: ({ waterComments }) => waterComments,
            width: COLUMN_WIDTHS.LARGE,
        },
        trashEvacuation: {
            title: 'Évacuation des déchets',
            data: ({ trashEvacuation }) => {
                if (trashEvacuation === true) {
                    return 'oui';
                }

                if (trashEvacuation === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
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
        // New Fields
        // water
        waterPotable: {
            title: 'L’eau est-elle potable ?',
            data: ({ waterPotable }) => {
                if (waterPotable === true) {
                    return 'oui';
                }

                if (waterPotable === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        waterContinuousAccess: {
            title: 'L\'accès à l\'eau est-il continu?',
            data: ({ waterContinuousAccess }) => {
                if (waterContinuousAccess === true) {
                    return 'oui';
                }

                if (waterContinuousAccess === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        waterPublicPoint: {
            title: 'Est-ce un point d\'eau public?',
            data: ({ waterPublicPoint }) => {
                if (waterPublicPoint === true) {
                    return 'oui';
                }

                if (waterPublicPoint === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        waterDistance: {
            title: 'Où se situe l\'accès à l\'eau?',
            data: ({ waterDistance }) => waterDistance,
            width: COLUMN_WIDTHS.SMALL,
        },
        waterRoadsToCross: {
            title: 'L\'accès nécessite-t-il un franchissement de rue ou de route ?',
            data: ({ waterRoadsToCross }) => {
                if (waterRoadsToCross === true) {
                    return 'oui';
                }

                if (waterRoadsToCross === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        waterEveryoneHasAccess: {
            title: 'Tous les habitants ont-ils accès aux points d’eau ?',
            data: ({ waterEveryoneHasAccess }) => {
                if (waterEveryoneHasAccess === true) {
                    return 'oui';
                }

                if (waterEveryoneHasAccess === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        waterStagnantWater: {
            title: 'Existe-t-il des eaux stagnantes autour du point de distribution ?',
            data: ({ waterStagnantWater }) => {
                if (waterStagnantWater === true) {
                    return 'oui';
                }

                if (waterStagnantWater === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        waterHandWashAccess: {
            title: 'Est-ce qu’il y a des bacs de lavage des mains ?',
            data: ({ waterHandWashAccess }) => {
                if (waterHandWashAccess === true) {
                    return 'oui';
                }

                if (waterHandWashAccess === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        waterHandWashAccessNumber: {
            title: 'Quel est le nombre de bacs de lavage des mains ?',
            data: ({ waterHandWashAccessNumber }) => waterHandWashAccessNumber,
            width: COLUMN_WIDTHS.SMALL,
        },
        // sanitary
        sanitaryNumber: {
            title: 'Nombre de toilettes ?',
            data: ({ sanitaryNumber }) => sanitaryNumber,
            width: COLUMN_WIDTHS.SMALL,
        },
        sanitaryInsalubrious: {
            title: 'Constate-t-on des marques de défécation à l’air libre ?',
            data: ({ sanitaryInsalubrious }) => {
                if (sanitaryInsalubrious === true) {
                    return 'oui';
                }

                if (sanitaryInsalubrious === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        sanitaryOnSite: {
            title: 'Nombre de toilettes ?',
            data: ({ sanitaryOnSite }) => {
                if (sanitaryOnSite === true) {
                    return 'oui';
                }

                if (sanitaryOnSite === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        // trash
        trashCansOnSite: {
            title: 'Combien de poubelles / bennes sont à proximité immédiate du site ?',
            data: ({ trashCansOnSite }) => trashCansOnSite,
            width: COLUMN_WIDTHS.SMALL,
        },
        trashAccumulation: {
            title: 'Constate-t-on une accumulation de déchets sur le site ou aux abords ?',
            data: ({ trashAccumulation }) => {
                if (trashAccumulation === true) {
                    return 'oui';
                }

                if (trashAccumulation === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        trashEvacuationRegular: {
            title: 'La collecte des poubelles / bennes est-elle réalisée de manière régulière ?',
            data: ({ trashEvacuationRegular }) => {
                if (trashEvacuationRegular === true) {
                    return 'oui';
                }

                if (trashEvacuationRegular === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        // vermin
        vermin: {
            title: 'Y a-t-il des nuisibles sur le site ou à proximité ?',
            data: ({ vermin }) => {
                if (vermin === true) {
                    return 'oui';
                }

                if (vermin === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        verminComments: {
            title: 'Précision concernant les nuisibles ?',
            data: ({ verminComments }) => verminComments,
            width: COLUMN_WIDTHS.SMALL,
        },
        // Fire prevention
        firePreventionMeasures: {
            title: 'Y a-t-il des mesures “prévention incendie” ?',
            data: ({ firePreventionMeasures }) => {
                if (firePreventionMeasures === true) {
                    return 'oui';
                }

                if (firePreventionMeasures === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        firePreventionDiagnostic: {
            title: 'Est-ce qu’un diagnostic prévention incendie par le SDIS a été réalisé ?',
            data: ({ firePreventionDiagnostic }) => {
                if (firePreventionDiagnostic === true) {
                    return 'oui';
                }

                if (firePreventionDiagnostic === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        firePreventionSiteAccessible: {
            title: 'Est-ce que le site est accessible aux pompiers ?',
            data: ({ firePreventionSiteAccessible }) => {
                if (firePreventionSiteAccessible === true) {
                    return 'oui';
                }

                if (firePreventionSiteAccessible === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        firePreventionDevices: {
            title: 'Est-ce que des dispositifs spécifiques ont été mis en place ?',
            data: ({ firePreventionDevices }) => {
                if (firePreventionDevices === true) {
                    return 'oui';
                }

                if (firePreventionDevices === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        firePreventionComments: {
            title: 'Prévention incendie : Préciser',
            data: ({ firePreventionComments }) => firePreventionComments,
            width: COLUMN_WIDTHS.SMALL,
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
