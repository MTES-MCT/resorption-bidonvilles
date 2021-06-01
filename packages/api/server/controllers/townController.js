const validator = require('validator');
const cleanParams = require('./townController/helpers/cleanParams');
const {
    sequelize,
    Shantytown: ShantyTowns,
    ClosingSolution,
    Stats_Exports,
} = require('#db/models');
const { fromTsToFormat: tsToString, toFormat: dateToString } = require('#server/utils/date');
const { createExport } = require('#server/utils/excel');
const { send: sendMail, PRESERVE_RECIPIENT } = require('#server/services/mailService');
const { triggerShantytownCloseAlert, triggerShantytownCreationAlert } = require('#server/utils/slack');
const { slack: slackConfig } = require('#server/config');

function fromGeoLevelToTableName(geoLevel) {
    switch (geoLevel) {
        case 'region':
            return 'regions';

        case 'departement':
            return 'departements';

        case 'epci':
            return 'epci';

        case 'city':
            return 'cities';

        default:
            return null;
    }
}

function addError(errors, field, error) {
    if (!Object.prototype.hasOwnProperty.call(errors, field)) {
        // eslint-disable-next-line no-param-reassign
        errors[field] = [];
    }

    errors[field].push(error);
}

function hasPermission(user, feature, entity) {
    return user.permissions && user.permissions[entity] && user.permissions[entity][feature] && user.permissions[entity][feature].allowed === true;
}

module.exports = (models) => {
    const methods = {
        async list(req, res, next) {
            try {
                // filters
                const filters = [];
                if (req.query.status) {
                    filters.push({
                        status: req.query.status.split(','),
                    });
                }

                // order
                let order;
                const orderableColumns = {
                    address: 'shantytowns.address',
                    city: 'cities.name',
                    departement: 'departements.code',
                    population: 'shantytowns.population_total',
                };
                if (req.query.order) {
                    order = [];
                    req.query.order.split(',').forEach((q) => {
                        const [column, direction] = q.split('.');
                        if (orderableColumns[column] !== undefined && (direction === 'asc' || direction === 'desc')) {
                            order.push(`${orderableColumns[column]} ${direction.toUpperCase()}${direction === 'desc' ? ' NULLS LAST' : ''}`);
                        }
                    });
                }

                return res.status(200).send(
                    await models.shantytown.findAll(req.user, filters, 'list', order),
                );
            } catch (error) {
                res.status(500).send(error.message);
                return next(error);
            }
        },

        async find(req, res, next) {
            try {
                const town = await models.shantytown.findOne(req.user, req.params.id);

                if (town === null) {
                    return res.status(404).send({
                        error: {
                            developer_message: 'The requested town does not exist',
                            user_message: 'Le site demandé n\'existe pas en base de données',
                        },
                    });
                }

                return res.status(200).send(town);
            } catch (error) {
                res.status(500).send(error.message);
                return next(error);
            }
        },

        async create(req, res, next) {
            try {
                let town;
                await sequelize.transaction(async (transaction) => {
                    const baseTown = {
                        name: req.body.name,
                        latitude: req.body.latitude,
                        longitude: req.body.longitude,
                        address: req.body.address,
                        addressDetails: req.body.detailed_address,
                        builtAt: req.body.built_at,
                        populationTotal: req.body.population_total,
                        populationCouples: req.body.population_couples,
                        populationMinors: req.body.population_minors,
                        populationMinors0To3: req.body.population_minors_0_3,
                        populationMinors3To6: req.body.population_minors_3_6,
                        populationMinors6To12: req.body.population_minors_6_12,
                        populationMinors12To16: req.body.population_minors_12_16,
                        populationMinors16To18: req.body.population_minors_16_18,
                        minorsInSchool: req.body.minors_in_school,
                        electricityType: req.body.electricity_type,
                        electricityComments: req.body.electricity_comments,
                        accessToSanitary: req.body.access_to_sanitary,
                        sanitaryComments: req.body.sanitary_comments,
                        accessToWater: req.body.access_to_water,
                        waterComments: req.body.water_comments,
                        trashEvacuation: req.body.trash_evacuation,
                        fieldType: req.body.field_type,
                        ownerType: req.body.owner_type,
                        city: req.body.citycode,
                        createdBy: req.user.id,
                        owner: req.body.owner,
                        declaredAt: req.body.declared_at,
                        censusStatus: req.body.census_status,
                        censusConductedAt: req.body.census_conducted_at,
                        censusConductedBy: req.body.census_conducted_by,
                        // New fields
                        // Water
                        waterPotable: req.body.water_potable,
                        waterContinuousAccess: req.body.water_continuous_access,
                        waterPublicPoint: req.body.water_public_point,
                        waterDistance: req.body.water_distance,
                        waterRoadsToCross: req.body.water_roads_to_cross,
                        waterEveryoneHasAccess: req.body.water_everyone_has_access,
                        waterStagnantWater: req.body.water_stagnant_water,
                        waterHandWashAccess: req.body.water_hand_wash_access,
                        waterHandWashAccessNumber: req.body.water_hand_wash_access_number,
                        // Sanitary
                        sanitaryNumber: req.body.sanitary_number,
                        sanitaryInsalubrious: req.body.sanitary_insalubrious,
                        sanitaryOnSite: req.body.sanitary_on_site,
                        // Trash
                        trashCansOnSite: req.body.trash_cans_on_site,
                        trashAccumulation: req.body.trash_accumulation,
                        trashEvacuationRegular: req.body.trash_evacuation_regular,
                        // Vermin
                        vermin: req.body.vermin,
                        verminComments: req.body.vermin_comments,
                        // Fire prevention
                        firePreventionMeasures: req.body.fire_prevention_measures,
                        firePreventionDiagnostic: req.body.fire_prevention_diagnostic,
                        firePreventionSiteAccessible: req.body.fire_prevention_site_accessible,
                        firePreventionDevices: req.body.fire_prevention_devices,
                        firePreventionComments: req.body.fire_prevention_comments,

                    };

                    town = await ShantyTowns.create(
                        Object.assign(
                            {},
                            baseTown,
                            req.user.permissions.shantytown.create.data_justice === true
                                ? {
                                    ownerComplaint: req.body.owner_complaint,
                                    justiceProcedure: req.body.justice_procedure,
                                    justiceRendered: req.body.justice_rendered,
                                    justiceRenderedBy: req.body.justice_rendered_by,
                                    justiceRenderedAt: req.body.justice_rendered_at,
                                    justiceChallenged: req.body.justice_challenged,
                                    policeStatus: req.body.police_status,
                                    policeRequestedAt: req.body.police_requested_at,
                                    policeGrantedAt: req.body.police_granted_at,
                                    bailiff: req.body.bailiff,
                                }
                                : {},
                        ),
                        {
                            transaction,
                        },
                    );

                    if (req.body.social_origins.length > 0) {
                        await town.setSocialOrigins(
                            req.body.social_origins,
                            {
                                transaction,
                            },
                        );
                    }
                });

                // Send a slack alert, if it fails, do nothing
                try {
                    if (slackConfig && slackConfig.new_shantytown) {
                        await triggerShantytownCreationAlert(town, req.user);
                    }
                } catch (err) {
                    console.log(`Error with shantytown creation slack webhook : ${err.message}`);
                }

                return res.status(200).send({
                    town,
                    plans: [],
                });
            } catch (e) {
                res.status(500).send({
                    error: {
                        developer_message: e.message,
                        user_message: 'Une erreur est survenue dans l\'enregistrement du site en base de données',
                    },
                });
                return next(e);
            }
        },

        async close(req, res, next) {
            const {
                status,
                closedAt,
                solutions,
                closedWithSolutions,
            } = cleanParams(req.body);

            const now = Date.now();
            const fieldErrors = {};
            const error = addError.bind(this, fieldErrors);

            const closingSolutions = await ClosingSolution.findAll();

            // validate the status
            if (status === null) {
                error('status', 'La cause de fermeture du site est obligatoire');
            } else if (['open', 'closed_by_justice', 'closed_by_admin', 'other', 'unknown'].indexOf(status) === -1) {
                error('status', 'La cause de fermeture du site fournie n\'est pas reconnue');
            }

            // validate closed with solutions
            if (closedWithSolutions === null) {
                error('closed_with_solutions', 'Ce champ est obligatoire');
            }

            // validate the closed-at date
            if (status !== 'open') {
                const timestamp = new Date(closedAt).getTime();

                if (!closedAt || Number.isNaN(timestamp)) {
                    error('closed_at', 'La date fournie n\'est pas reconnue');
                } else if (timestamp >= now) {
                    error('closed_at', 'La date de fermeture du site ne peut pas être future');
                }
            }

            // validate the list of solutions
            const solutionErrors = {};
            solutions.forEach((solution) => {
                if (closingSolutions.some(s => s.id === solution.id) === false) {
                    addError(solutionErrors, solution.id, `Le dispositif d'identifiant ${solution.id} n'existe pas`);
                }

                if (solution.peopleAffected !== null) {
                    if (Number.isNaN(solution.peopleAffected)) {
                        addError(solutionErrors, solution.id, 'Le nombre de personnes concernées par le dispositif est invalide');
                    } else if (solution.peopleAffected <= 0) {
                        addError(solutionErrors, solution.id, 'Le nombre de personnes concernées par le dispositif doit être positif');
                    }
                }

                if (solution.householdsAffected !== null) {
                    if (Number.isNaN(solution.householdsAffected)) {
                        addError(solutionErrors, solution.id, 'Le nombre de ménages concernés par le dispositif est invalide');
                    } else if (solution.householdsAffected <= 0) {
                        addError(solutionErrors, solution.id, 'Le nombre de ménages concernés par le dispositif doit être positif');
                    }
                }
            });

            if (Object.keys(solutionErrors).length > 0) {
                fieldErrors.solutions = solutionErrors;
            }

            // check errors
            if (Object.keys(fieldErrors).length > 0) {
                return res.status(400).send({
                    error: {
                        developer_message: 'The submitted data contains errors',
                        user_message: 'Certaines données sont invalides',
                        fields: fieldErrors,
                    },
                });
            }

            // check if the town exists
            const town = await ShantyTowns.findOne({
                where: {
                    shantytown_id: req.params.id,
                },
            });

            if (town === null) {
                return res.status(400).send({
                    error: {
                        developer_message: `Tried to close unknown town of id #${req.params.id}`,
                        user_message: `Le site d'identifiant ${req.params.id} n'existe pas : fermeture impossible`,
                    },
                });
            }

            // close the town
            try {
                await sequelize.transaction(async (transaction) => {
                    await town.update({
                        status,
                        closedAt,
                        closedWithSolutions: closedWithSolutions === true ? 'yes' : 'no',
                        updatedBy: req.user.id,
                    }, {
                        transaction,
                    });

                    await Promise.all(
                        solutions.map(solution => town.addClosingSolution(solution.id, {
                            transaction,
                            through: {
                                peopleAffected: solution.peopleAffected,
                                householdsAffected: solution.householdsAffected,
                            },
                        })),
                    );
                });

                // Send a slack alert, if it fails, do nothing
                try {
                    if (slackConfig && slackConfig.close_shantytown) {
                        const updatedTown = {
                            ...town.dataValues, status, closedAt, closedWithSolutions, updatedBy: req.user.id, solutions,
                        };
                        await triggerShantytownCloseAlert(updatedTown, req.user);
                    }
                } catch (err) {
                    console.log(`Error with shantytown close slack webhook : ${err.message}`);
                }


                return res.status(200).send(town);
            } catch (e) {
                res.status(500).send({
                    error: {
                        developer_message: e.message,
                        user_message: 'Une erreur est survenue dans l\'enregistrement du site en base de données',
                    },
                });
                return next(e);
            }
        },

        async delete(req, res, next) {
            // check if the town exists
            const town = await ShantyTowns.findOne({
                where: {
                    shantytown_id: req.params.id,
                },
            });

            if (town === null) {
                return res.status(400).send({
                    error: {
                        developer_message: `Tried to delete unknown town of id #${req.params.id}`,
                        user_message: `Le site d'identifiant ${req.params.id} n'existe pas : suppression impossible`,
                    },
                });
            }

            // delete the town
            try {
                await town.destroy();
                return res.status(200).send({});
            } catch (e) {
                res.status(500).send({
                    error: {
                        developer_message: e.message,
                        user_message: 'Une erreur est survenue pendant la suppression du site de la base de données',
                    },
                });
                return next(e);
            }
        },

        async deleteComment(req, res, next) {
            let town;

            try {
                town = await models.shantytown.findOne(req.user, req.params.id);
            } catch (error) {
                res.status(500).send({
                    error: {
                        developer_message: 'Failed to retrieve the comment',
                        user_message: 'Impossible de retrouver le commentaire à supprimer en base de données',
                    },
                });
                return next(error);
            }

            const comment = town.comments.regular.find(({ id }) => id === parseInt(req.params.commentId, 10));
            if (comment === undefined) {
                return res.status(404).send({
                    error: {
                        developer_message: 'The comment to be deleted does not exist',
                        user_message: 'Le commentaire à supprimer n\'a pas été retrouvé en base de données',
                    },
                });
            }

            let author;
            try {
                author = await models.user.findOne(comment.createdBy.id);
            } catch (error) {
                res.status(500).send({
                    error: {
                        developer_message: 'Failed to retrieve the author of the comment',
                        user_message: 'Une erreur est survenue lors de la lecture en base de données',
                    },
                });
                return next(error);
            }

            if (author.id !== req.user.id && !hasPermission(req.user, 'moderate', 'shantytown_comment')) {
                return res.status(400).send({
                    error: {
                        user_message: 'Vous n\'avez pas accès à ces données',
                        developer_message: 'Tried to access a secured page without authentication',
                    },
                });
            }

            const message = validator.trim(req.body.message || '');
            if (message === '') {
                return res.status(400).send({
                    error: {
                        user_message: 'Vous devez préciser le motif de suppression du commentaire',
                        developer_message: 'Message is missing',
                    },
                });
            }

            try {
                await sequelize.query(
                    'DELETE FROM shantytown_comments WHERE shantytown_comment_id = :id',
                    {
                        replacements: {
                            id: req.params.commentId,
                        },
                    },
                );
            } catch (error) {
                res.status(500).send({
                    error: {
                        developer_message: 'Failed to delete the comment',
                        user_message: 'Impossible de supprimer le commentaire',
                    },
                });
                return next(error);
            }

            try {
                await sendMail('comment_deletion', author, req.user, [town, comment, message, req.user], PRESERVE_RECIPIENT);
            } catch (error) {
                // ignore
            }

            return res.status(200).send({
                comments: town.comments.regular.filter(({ id }) => id !== parseInt(req.params.commentId, 10)),
            });
        },

        async export(req, res, next) {
            function isLocationAllowed(user, location) {
                if (user.permissions.shantytown.export.geographic_level === 'nation') {
                    return true;
                }

                if (user.organization.location.type === 'nation') {
                    return true;
                }

                return location[user.organization.location.type]
                    && user.organization.location[user.organization.location.type]
                    && user.organization.location[user.organization.location.type].code === location[user.organization.location.type].code;
            }

            if (!Object.prototype.hasOwnProperty.call(req.query, 'locationType')
                || !Object.prototype.hasOwnProperty.call(req.query, 'locationCode')) {
                return res.status(400).send({
                    success: false,
                    response: {
                        error: {
                            user_message: 'Le périmètre géographique à exporter est obligatoire',
                            developer_message: 'locationType and/or locationCode are missing',
                        },
                    },
                });
            }

            let location;
            try {
                location = await models.geo.getLocation(req.query.locationType, req.query.locationCode);
            } catch (error) {
                res.status(500).send({
                    success: false,
                    response: {
                        error: {
                            user_message: 'Une erreur est survenue lors de la lecture en base de données',
                            developer_message: 'could not get location',
                        },
                    },
                });
                next(error);
            }

            if (!isLocationAllowed(req.user, location)) {
                return res.status(400).send({
                    success: false,
                    response: {
                        error: {
                            user_message: 'Vous n\'êtes pas autorisé(e) à exporter le périmètre géographique demandé',
                            developer_message: 'the requested location is not allowed to current user',
                        },
                    },
                });
            }

            const closedTowns = parseInt(req.query.closedTowns, 10) === 1;
            const filters = [
                {
                    status: {
                        not: closedTowns === true,
                        value: 'open',
                    },
                },
            ];

            if (location.type !== 'nation') {
                filters.push({
                    location: {
                        query: `${fromGeoLevelToTableName(location.type)}.code`,
                        value: location[location.type].code,
                    },
                });
            }

            let shantytowns;
            try {
                shantytowns = await models.shantytown.findAll(
                    req.user,
                    filters,
                    'export',
                );
            } catch (error) {
                res.status(500).send({
                    success: false,
                    response: {
                        error: {
                            user_message: 'Une erreur est survenue lors de la lecture en base de données',
                            developer_message: 'Failed to fetch towns',
                        },
                    },
                });
                return next(error);
            }

            if (shantytowns.length === 0) {
                res.status(500).send({
                    success: false,
                    response: {
                        error: {
                            user_message: 'Il n\'y a aucun site à exporter pour le périmètre géographique demandé',
                            developer_message: 'no shantytown to be exported',
                        },
                    },
                });
                return next(new Error('no shantytown to be exported'));
            }

            let closingSolutions;
            try {
                closingSolutions = await models.closingSolution.findAll();
            } catch (error) {
                res.status(500).send({
                    success: false,
                    response: {
                        error: {
                            user_message: 'Une erreur est survenue lors de la lecture en base de données',
                            developer_message: 'Failed to fetch closing solutions',
                        },
                    },
                });
                return next(error);
            }

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
                address: {
                    title: 'Adresse',
                    data: ({ addressSimple }) => addressSimple,
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
                    width: COLUMN_WIDTHS.SMALL,
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
                    data: ({ updatedAt }) => (updatedAt ? new Date(updatedAt * 1000) : ''),
                    width: COLUMN_WIDTHS.SMALL,
                },
                comments: {
                    title: 'Commentaires',
                    data: ({ comments }) => comments.regular.slice(0, 5).map(comment => `${tsToString(comment.createdAt, 'd/m/Y à h:i')} - ${comment.createdBy.lastName.toUpperCase()} ${comment.createdBy.firstName}\n${comment.description}`).join('\n----\n'),
                    width: COLUMN_WIDTHS.LARGE,
                },
                covidComments: {
                    title: 'Commentaires COVID-19',
                    data: ({ comments }) => comments.covid.slice(0, 5).map((comment) => {
                        const tags = Object.keys(covidTags)
                            .filter(tag => comment.covid[tag] === true)
                            .map(tag => covidTags[tag])
                            .join('\n');

                        return `${tsToString(comment.createdAt, 'd/m/Y à h:i')} - ${comment.createdBy.lastName.toUpperCase()} ${comment.createdBy.firstName}\nDate de l'intervention : ${tsToString(comment.covid.date, 'd/m/Y')}\n${tags}\n${comment.description}`;
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
                    title: 'Est-ce que des dispositifs spécifiques ont été mises en place ?',
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

            // sections
            const options = req.query.options ? req.query.options.split(',') : [];
            const sections = [];

            const localizationSection = {
                title: 'Localisation',
                properties: [
                    properties.departement,
                    properties.city,
                    properties.address,
                    properties.name,
                ],
                lastFrozen: true,
            };
            sections.push(localizationSection);

            if (options.indexOf('address_details') !== -1 && !closedTowns) {
                localizationSection.properties.push(properties.addressDetails);
            }

            localizationSection.properties.push(properties.coordinates);

            let section = {
                title: 'Site',
                properties: [
                    properties.fieldType,
                    properties.builtAt,
                    properties.declaredAt,
                ],
            };

            if (closedTowns) {
                section.properties.push(properties.closedAt);
                section.properties.push(properties.closedWithSolutions);
                section.properties.push(properties.status);
            }

            if (options.indexOf('owner') !== -1) {
                section.properties.push(properties.ownerType);
                section.properties.push(properties.owner);
            }

            sections.push(section);

            sections.push({
                title: 'Habitants',
                properties: [
                    properties.populationTotal,
                    properties.populationCouples,
                    properties.populationMinors,
                    properties.populationMinors0To3,
                    properties.populationMinors3To6,
                    properties.populationMinors6To12,
                    properties.populationMinors12To16,
                    properties.populationMinors16To18,
                    properties.minorsInSchool,
                    properties.socialOrigins,
                ],
            });

            if (options.indexOf('life_conditions') !== -1) {
                sections.push({
                    title: 'Conditions de vie',
                    properties: [
                        properties.electricityType,
                        properties.electricityComments,
                        properties.accessToWater,
                        properties.waterComments,
                        properties.accessToSanitary,
                        properties.sanitaryComments,
                        properties.trashEvacuation,
                        properties.waterPotable,
                        properties.waterContinuousAccess,
                        properties.waterPublicPoint,
                        properties.waterDistance,
                        properties.waterRoadsToCross,
                        properties.waterEveryoneHasAccess,
                        properties.waterStagnantWater,
                        properties.waterHandWashAccess,
                        properties.waterHandWashAccessNumber,
                        properties.sanitaryNumber,
                        properties.sanitaryInsalubrious,
                        properties.sanitaryOnSite,
                        properties.trashCansOnSite,
                        properties.trashAccumulation,
                        properties.trashEvacuationRegular,
                        properties.vermin,
                        properties.verminComments,
                        properties.firePreventionMeasures,
                        properties.firePreventionDiagnostic,
                        properties.firePreventionSiteAccessible,
                        properties.firePreventionDevices,
                        properties.firePreventionComments,
                    ],
                });
            }

            if (options.indexOf('demographics') !== -1) {
                section = {
                    title: 'Diagnostic',
                    properties: [
                        properties.censusConductedAt,
                        properties.censusConductedBy,
                    ],
                };

                if (!closedTowns) {
                    section.properties.unshift(properties.censusStatus);
                }

                sections.push(section);
            }

            if (options.indexOf('justice') !== -1 && req.user.permissions.shantytown.export.data_justice === true) {
                sections.push({
                    title: 'Procédure judiciaire',
                    properties: [
                        properties.ownerComplaint,
                        properties.justiceProcedure,
                        properties.justiceRendered,
                        properties.justiceRenderedAt,
                        properties.justiceRenderedBy,
                        properties.justiceChallenged,
                        properties.policeStatus,
                        properties.policeRequestedAt,
                        properties.policeGrantedAt,
                        properties.bailiff,
                    ],
                });
            }

            if (closedTowns === true) {
                const subSections = [];
                closingSolutions.forEach(({ id: solutionId, label }) => {
                    subSections.push({
                        title: label.split(' (')[0],
                        properties: [
                            properties[`closingSolution${solutionId}_population`],
                            properties[`closingSolution${solutionId}_households`],
                        ],
                    });
                });

                sections.push({
                    title: 'Orientation',
                    subsections: subSections,
                });
            }

            const commentProps = [];
            if (options.indexOf('comments') !== -1 && req.user.isAllowedTo('list', 'shantytown_comment')) {
                commentProps.push(properties.comments);
            }

            if (options.indexOf('covid_comments') !== -1) {
                commentProps.push(properties.covidComments);
            }

            if (commentProps.length > 0) {
                sections.push({
                    title: 'Commentaires',
                    properties: commentProps,
                });
            }

            sections.push({
                title: null,
                properties: [
                    properties.updatedAt,
                ],
            });

            // EXPORT NOW (FINALLY)
            let locationName = '';
            if (location.type === 'nation') {
                locationName = 'France';
            } else if (location.type === 'departement' || location.type === 'city') {
                locationName = `${location.departement.code} - ${location[location.type].name}`;
            } else {
                locationName = location[location.type].name;
            }

            const buffer = await createExport(
                closedTowns ? 'fermés' : 'existants',
                locationName,
                sections,
                shantytowns,
            );

            res.attachment(`${dateToString(new Date(), 'Y-m-d')}-sites-${closedTowns ? 'fermés' : 'existants'}-resorption-bidonvilles.xlsx`);

            // add that export to the stats
            const stat = {
                fk_region: null,
                fk_departement: null,
                fk_epci: null,
                fk_city: null,
                closed_shantytowns: closedTowns,
                exported_by: req.user.id,
            };

            if (location.type !== 'nation') {
                stat[`fk_${location.type}`] = location[location.type].code;
            }

            try {
                await Stats_Exports.create(stat);
            } catch (error) {
                res.status(500).send({
                    success: false,
                    response: {
                        error: {
                            user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
                            developer_message: 'Failed to store statistics',
                        },
                    },
                });
                return next(error);
            }

            return res.end(buffer);
        },

        async createCovidComment(req, res, next) {
            // ensure town's existence
            let shantytown;
            try {
                shantytown = await models.shantytown.findOne(req.user, req.params.id);

                if (shantytown === null) {
                    return res.status(404).send({
                        user_message: `Le site #${req.params.id} n'existe pas`,
                        developer_message: `Shantytown #${req.params.id} does not exist`,
                    });
                }
            } catch (error) {
                res.status(500).send({
                    user_message: `Une erreur est survenue lors de la vérification de l'existence du site #${req.params.id} en base de données`,
                    developer_message: `Failed fetching shantytown #${req.params.id}`,
                    details: {
                        error_message: error.message,
                    },
                });
                return next(error);
            }

            // sanitize input
            function sanitize(body) {
                const date = new Date(body.date);
                const sanitizedBody = {
                    date: typeof body.date === 'string' && !Number.isNaN(date.getTime()) ? date : null,
                    description: typeof body.description === 'string' ? validator.trim(body.description) : null,
                };

                ['equipe_maraude', 'equipe_sanitaire', 'equipe_accompagnement',
                    'distribution_alimentaire', 'personnes_orientees', 'personnes_avec_symptomes',
                    'besoin_action']
                    .forEach((name) => {
                        sanitizedBody[name] = typeof body[name] === 'boolean' ? body[name] : null;
                    });

                return sanitizedBody;
            }

            const data = sanitize(req.body);

            // validate input
            const labels = {
                date: 'La date',
                equipe_maraude: 'Le champ "Équipe de maraude"',
                equipe_sanitaire: 'Le champ "Équipe sanitaire"',
                equipe_accompagnement: 'Le champ "Équipe d\'accompagnement"',
                distribution_alimentaire: 'Le champ "Distribution d\'aide alimentaire"',
                personnes_orientees: 'Le champ "Personne(s) orientée(s) vers un centre d\'hébergement spécialisé (desserrement)"',
                personnes_avec_symptomes: 'Le champ "Personnes avec des symptômes Covid-19"',
                besoin_action: 'Le champ "Besoin d\'une action prioritaire"',
                description: 'Le commentaire',
            };
            const errors = {};

            Object.keys(data).forEach((name) => {
                if (data[name] === null) {
                    addError(errors, name, `${labels[name]} est obligatoire`);
                }
            });

            if (data.date !== null) {
                // date can't be future
                const today = new Date();
                if (data.date > today) {
                    addError(errors, 'date', 'La date ne peut être future');
                }

                // date can't be older than the town's declaration date
                if (data.date < new Date(shantytown.builtAt * 1000)) {
                    addError(errors, 'date', 'La date ne peut être antérieure à la date d\'installation du site');
                }
            }

            if (data.description === '') {
                addError(errors, 'description', 'Le commentaire est obligatoire');
            }

            if (Object.keys(errors).length > 0) {
                return res.status(400).send({
                    user_message: 'Certains champs du formulaire comportent des erreurs',
                    developer_message: 'Submitted data contains errors',
                    fields: errors,
                });
            }

            // try creating the new comment
            try {
                await models.shantytown.createCovidComment(req.user, req.params.id, data);
            } catch (error) {
                res.status(500).send({
                    user_message: 'Une erreur est survenue lors de l\'écriture du commentaire en base de données',
                    developer_message: `Failed writing a covid comment for shantytown #${req.params.id}`,
                    details: {
                        error_message: error.message,
                    },
                });
                return next(error);
            }

            // fetch refreshed comments
            let comments;
            try {
                const response = await models.shantytown.getComments(req.user, [req.params.id], true);
                comments = response[req.params.id];
            } catch (error) {
                comments = [];
            }

            return res.status(200).send(comments);
        },
    };

    // eslint-disable-next-line global-require
    methods.edit = require('./townController/edit')(
        models,
    );

    // eslint-disable-next-line global-require
    methods.createHighCovidComment = require('./townController/createHighCovidComment')(
        models,
    );

    // eslint-disable-next-line global-require
    methods.addActor = require('./townController/addActor')(
        models,
    );

    // eslint-disable-next-line global-require
    methods.updateActor = require('./townController/updateActor')(
        models,
    );

    // eslint-disable-next-line global-require
    methods.removeActorTheme = require('./townController/removeActorTheme')(
        models,
    );

    // eslint-disable-next-line global-require
    methods.inviteNewActor = require('./townController/inviteNewActor')(
        models,
    );

    // eslint-disable-next-line global-require
    methods.removeActor = require('./townController/removeActor')(
        models,
    );

    // eslint-disable-next-line global-require
    methods.getRelations = require('./townController/getRelations')(
        models,
    );

    return methods;
};
