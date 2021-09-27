const { fromTsToFormat } = require('#server/utils/date');
const { fromGeoLevelToTableName } = require('#server/utils/geo');
const { sequelize } = require('#db/models');
const userModel = require('#server/models/userModel')(sequelize);
const updateWhereClauseForPermissions = require('#server/models/common/updateWhereClauseForPermissions');

/**
 * Converts a date column to a timestamp
 *
 * Always uses midnight as the time value.
 *
 * @param {string|null} date The date, as stored in the column
 *
 * @returns {number|null}
 */
function fromDateToTimestamp(date) {
    return date !== null ? (new Date(`${date}T00:00:00`).getTime() / 1000) : null;
}

/**
 * Returns a changelog diff between two version of a same shantytown
 *
 * @param {Shantytown} oldVersion
 * @param {Shantytown} newVersion
 */
function getDiff(oldVersion, newVersion) {
    const properties = [
        'name', 'builtAt', 'declaredAt', 'addressSimple',
        'addressDetails', 'fieldType', 'ownerType', 'owner', 'censusStatus', 'censusConductedAt',
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
        firePreventionDevices: 'Est-ce que des dispositifs spécifiques ont été mises en place ?',
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
        censusStatus(c) {
            const statuses = {
                [null]: 'inconnu',
                none: 'non prévu',
                scheduled: 'prévu',
                done: 'réalisé',
            };

            return statuses[c];
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
                [null]: 'inconnu',
                none: 'non demandé',
                requested: 'demandé',
                granted: 'obtenu',
            };

            return statuses[p];
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
}

/**
 * Serializes a single comment row
 *
 * @param {Object} comment
 *
 * @returns {Object}
 */
function serializeComment(comment) {
    return Object.assign(
        {
            id: comment.commentId,
            description: comment.commentDescription,
            createdAt: comment.commentCreatedAt !== null ? (comment.commentCreatedAt.getTime() / 1000) : null,
            private: comment.commentPrivate,
            createdBy: {
                id: comment.commentCreatedBy,
                first_name: comment.userFirstName,
                last_name: comment.userLastName,
                position: comment.userPosition,
                organization: comment.organizationAbbreviation || comment.organizationName,
                organization_id: comment.organizationId,
            },
            shantytown: comment.shantytownId,
        },
        comment.covidCommentDate
            ? {
                covid: {
                    date: comment.covidCommentDate.getTime() / 1000,
                    equipe_maraude: comment.covidEquipeMaraude,
                    equipe_sanitaire: comment.covidEquipeSanitaire,
                    equipe_accompagnement: comment.covidEquipeAccompagnement,
                    distribution_alimentaire: comment.covidDistributionAlimentaire,
                    action_mediation_sante: comment.covidActionMediationSante,
                    sensibilisation_vaccination: comment.covidSensibilisationVaccination,
                    equipe_mobile_depistage: comment.covidEquipeMobileDepistage,
                    equipe_mobile_vaccination: comment.covidEquipeMobileVaccination,
                    personnes_orientees: comment.covidPersonnesOrientees,
                    personnes_avec_symptomes: comment.covidPersonnesAvecSymptomes,
                    besoin_action: comment.covidBesoinAction,
                },
            }
            : {},
    );
}

/**
 * Computes the simplified address of the given shantytown
 *
 * @param {Object} shantytown
 *
 * @returns {String}
 */
function getAddressSimpleOf(shantytown) {
    return shantytown.addressSimple || 'Pas d\'adresse précise';
}

/**
 * Computes the usename of the given shantytown
 *
 * @param {Object} shantytown
 *
 * @returns {String}
 */
function getUsenameOf(shantytown) {
    const addressSimple = getAddressSimpleOf(shantytown);

    // process usename
    if (shantytown.name) {
        let aka;
        if (!shantytown.addressSimple) {
            aka = `site dit ${shantytown.name}`;
        } else {
            aka = shantytown.name;
        }

        return `${addressSimple} « ${aka} »`;
    }

    return addressSimple;
}


/**
 * Serializes a single shantytown row
 *
 * @param {Object} town
 * @param {Object} permission
 *
 * @returns {Object}
 */
function serializeShantytown(town, permission) {
    const serializedTown = {
        id: town.id,
        name: town.name,
        status: town.status,
        latitude: town.latitude,
        longitude: town.longitude,
        city: {
            code: town.cityCode,
            name: town.cityName,
            main: town.cityMain,
            latitude: town.cityLatitude,
            longitude: town.cityLongitude,
        },
        epci: {
            code: town.epciCode,
            name: town.epciName,
        },
        departement: {
            code: town.departementCode,
            name: town.departementName,
        },
        region: {
            code: town.regionCode,
            name: town.regionName,
        },
        declaredAt: fromDateToTimestamp(town.declaredAt),
        builtAt: fromDateToTimestamp(town.builtAt),
        closedAt: town.closedAt !== null ? (town.closedAt.getTime() / 1000) : null,
        address: town.address,
        addressDetails: town.addressDetails,
        addressSimple: getAddressSimpleOf(town),
        usename: getUsenameOf(town),
        populationTotal: town.populationTotal,
        populationCouples: town.populationCouples,
        populationMinors: town.populationMinors,
        populationMinors0To3: town.populationMinors0To3,
        populationMinors3To6: town.populationMinors3To6,
        populationMinors6To12: town.populationMinors6To12,
        populationMinors12To16: town.populationMinors12To16,
        populationMinors16To18: town.populationMinors16To18,
        minorsInSchool: town.minorsInSchool,
        electricityType: {
            id: town.electricityTypeId,
            label: town.electricityTypeLabel,
        },
        electricityComments: town.electricityComments,
        accessToSanitary: town.accessToSanitary,
        sanitaryComments: town.sanitaryComments,
        accessToWater: town.accessToWater,
        waterComments: town.waterComments,
        trashEvacuation: town.trashEvacuation,
        owner: town.owner,
        censusStatus: town.censusStatus,
        censusConductedBy: town.censusConductedBy,
        censusConductedAt: fromDateToTimestamp(town.censusConductedAt),
        fieldType: {
            id: town.fieldTypeId,
            label: town.fieldTypeLabel,
        },
        ownerType: {
            id: town.ownerTypeId,
            label: town.ownerTypeLabel,
        },
        socialOrigins: (town.socialOrigins || []).map((socialOrigin) => {
            const [id, label] = socialOrigin.split('|');
            return {
                id: parseInt(id, 10),
                label,
            };
        }),
        comments: {
            regular: [],
            covid: [],
        },
        actors: [],
        plans: [],
        closingSolutions: [],
        closedWithSolutions: town.closedWithSolutions,
        changelog: [],
        createdAt: town.createdAt.getTime() / 1000,
        updatedAt: town.updatedAt !== null ? (town.updatedAt.getTime() / 1000) : null,
        createdBy: {
            id: town.createdById,
            first_name: town.createdByFirstName,
            last_name: town.createdByLastName,
            position: town.createdByPosition,
            organization: {
                id: town.createdByOrganization,
            },
        },
        updatedBy: {
            id: town.updatedById,
            first_name: town.updatedByFirstName,
            last_name: town.updatedByLastName,
            position: town.updatedByPosition,
            organization: {
                id: town.updatedByOrganization,
            },
        },
        waterPotable: town.waterPotable,
        waterContinuousAccess: town.waterContinuousAccess,
        waterPublicPoint: town.waterPublicPoint,
        waterDistance: town.waterDistance,
        waterRoadsToCross: town.waterRoadsToCross,
        waterEveryoneHasAccess: town.waterEveryoneHasAccess,
        waterStagnantWater: town.waterStagnantWater,
        waterHandWashAccess: town.waterHandWashAccess,
        waterHandWashAccessNumber: town.waterHandWashAccessNumber,
        sanitaryNumber: town.sanitaryNumber,
        sanitaryInsalubrious: town.sanitaryInsalubrious,
        sanitaryOnSite: town.sanitaryOnSite,
        trashCansOnSite: town.trashCansOnSite,
        trashAccumulation: town.trashAccumulation,
        trashEvacuationRegular: town.trashEvacuationRegular,
        vermin: town.vermin,
        verminComments: town.verminComments,
        firePreventionMeasures: town.firePreventionMeasures,
        firePreventionDiagnostic: town.firePreventionDiagnostic,
        firePreventionSiteAccessible: town.firePreventionSiteAccessible,
        firePreventionDevices: town.firePreventionDevices,
        firePreventionComments: town.firePreventionComments,
        resorptionTarget: town.resorptionTarget,
    };

    // @todo: alter all dates to a datetime so it can be easily serialized (just like closed_at)
    const restrictedData = {
        data_justice: {
            ownerComplaint: town.ownerComplaint,
            justiceProcedure: town.justiceProcedure,
            justiceRendered: town.justiceRendered,
            justiceRenderedAt: fromDateToTimestamp(town.justiceRenderedAt),
            justiceRenderedBy: town.justiceRenderedBy,
            justiceChallenged: town.justiceChallenged,
            policeStatus: town.policeStatus,
            policeRequestedAt: fromDateToTimestamp(town.policeRequestedAt),
            policeGrantedAt: fromDateToTimestamp(town.policeGrantedAt),
            bailiff: town.bailiff,
        },
    };

    Object.keys(restrictedData)
        .filter(dataPermission => permission[dataPermission] === true)
        .forEach((dataPermission) => {
            Object.assign(serializedTown, restrictedData[dataPermission]);
        });

    return serializedTown;
}

/**
 * Base SQL request
 */
const SQL = {
    selection: {
        'shantytowns.shantytown_id': 'id',
        'shantytowns.name': 'name',
        'shantytowns.status': 'status',
        'shantytowns.declared_at': 'declaredAt',
        'shantytowns.built_at': 'builtAt',
        'shantytowns.closed_at': 'closedAt',
        'shantytowns.latitude': 'latitude',
        'shantytowns.longitude': 'longitude',
        'shantytowns.address': 'address',
        'shantytowns.address_details': 'addressDetails',
        '(SELECT regexp_matches(shantytowns.address, \'^(.+) [0-9]+ [^,]+,? [0-9]+,? [^, ]+(,.+)?$\'))[1]': 'addressSimple',
        'shantytowns.population_total': 'populationTotal',
        'shantytowns.population_couples': 'populationCouples',
        'shantytowns.population_minors': 'populationMinors',
        'shantytowns.population_minors_0_3': 'populationMinors0To3',
        'shantytowns.population_minors_3_6': 'populationMinors3To6',
        'shantytowns.population_minors_6_12': 'populationMinors6To12',
        'shantytowns.population_minors_12_16': 'populationMinors12To16',
        'shantytowns.population_minors_16_18': 'populationMinors16To18',
        'shantytowns.minors_in_school': 'minorsInSchool',
        'shantytowns.access_to_sanitary': 'accessToSanitary',
        'shantytowns.sanitary_comments': 'sanitaryComments',
        'shantytowns.access_to_water': 'accessToWater',
        'shantytowns.water_comments': 'waterComments',
        'shantytowns.trash_evacuation': 'trashEvacuation',
        'shantytowns.owner': 'owner',
        'shantytowns.census_status::text': 'censusStatus',
        'shantytowns.census_conducted_by': 'censusConductedBy',
        'shantytowns.census_conducted_at': 'censusConductedAt',
        'shantytowns.owner_complaint': 'ownerComplaint',
        'shantytowns.justice_procedure': 'justiceProcedure',
        'shantytowns.justice_rendered': 'justiceRendered',
        'shantytowns.justice_rendered_at': 'justiceRenderedAt',
        'shantytowns.justice_rendered_by': 'justiceRenderedBy',
        'shantytowns.justice_challenged': 'justiceChallenged',
        'shantytowns.police_status::text': 'policeStatus',
        'shantytowns.police_requested_at': 'policeRequestedAt',
        'shantytowns.police_granted_at': 'policeGrantedAt',
        'shantytowns.bailiff': 'bailiff',
        'shantytowns.closed_with_solutions::text': 'closedWithSolutions',
        'shantytowns.created_at': 'createdAt',
        'shantytowns.updated_at': 'updatedAt',
        // new fields
        'shantytowns.water_potable': 'waterPotable',
        'shantytowns.water_continuous_access': 'waterContinuousAccess',
        'shantytowns.water_public_point': 'waterPublicPoint',
        'shantytowns.water_distance::text': 'waterDistance',
        'shantytowns.water_roads_to_cross': 'waterRoadsToCross',
        'shantytowns.water_everyone_has_access': 'waterEveryoneHasAccess',
        'shantytowns.water_stagnant_water': 'waterStagnantWater',
        'shantytowns.water_hand_wash_access': 'waterHandWashAccess',
        'shantytowns.water_hand_wash_access_number': 'waterHandWashAccessNumber',
        'shantytowns.sanitary_number': 'sanitaryNumber',
        'shantytowns.sanitary_insalubrious': 'sanitaryInsalubrious',
        'shantytowns.sanitary_on_site': 'sanitaryOnSite',
        'shantytowns.trash_cans_on_site': 'trashCansOnSite',
        'shantytowns.trash_accumulation': 'trashAccumulation',
        'shantytowns.trash_evacuation_regular': 'trashEvacuationRegular',
        'shantytowns.vermin': 'vermin',
        'shantytowns.vermin_comments': 'verminComments',
        'shantytowns.fire_prevention_measures': 'firePreventionMeasures',
        'shantytowns.fire_prevention_diagnostic': 'firePreventionDiagnostic',
        'shantytowns.fire_prevention_site_accessible': 'firePreventionSiteAccessible',
        'shantytowns.fire_prevention_devices': 'firePreventionDevices',
        'shantytowns.fire_prevention_comments': 'firePreventionComments',
        'shantytowns.resorption_target': 'resorptionTarget',
        'creators.user_id': 'createdById',
        'creators.first_name': 'createdByFirstName',
        'creators.last_name': 'createdByLastName',
        'creators.position': 'createdByPosition',
        'creators_organizations.organization_id': 'createdByOrganization',
        'updators.user_id': 'updatedById',
        'updators.first_name': 'updatedByFirstName',
        'updators.last_name': 'updatedByLastName',
        'updators.position': 'updatedByPosition',
        'updators_organizations.organization_id': 'updatedByOrganization',
        'cities.code': 'cityCode',
        'cities.name': 'cityName',
        'cities.fk_main': 'cityMain',
        'cities.latitude': 'cityLatitude',
        'cities.longitude': 'cityLongitude',
        'epci.code': 'epciCode',
        'epci.name': 'epciName',
        'departements.code': 'departementCode',
        'departements.name': 'departementName',
        'regions.code': 'regionCode',
        'regions.name': 'regionName',
        'electricity_types.electricity_type_id': 'electricityTypeId',
        'electricity_types.label': 'electricityTypeLabel',
        'shantytowns.electricity_comments': 'electricityComments',
        'field_types.field_type_id': 'fieldTypeId',
        'field_types.label': 'fieldTypeLabel',
        'owner_types.owner_type_id': 'ownerTypeId',
        'owner_types.label': 'ownerTypeLabel',
    },
    joins: [
        { table: 'owner_types', on: 'shantytowns.fk_owner_type = owner_types.owner_type_id' },
        { table: 'field_types', on: 'shantytowns.fk_field_type = field_types.field_type_id' },
        { table: 'electricity_types', on: 'shantytowns.fk_electricity_type = electricity_types.electricity_type_id' },
        { table: 'cities', on: 'shantytowns.fk_city = cities.code' },
        { table: 'epci', on: 'cities.fk_epci = epci.code' },
        { table: 'departements', on: 'cities.fk_departement = departements.code' },
        { table: 'regions', on: 'departements.fk_region = regions.code' },
        { table: 'users AS creators', on: 'shantytowns.created_by = creators.user_id' },
        { table: 'organizations AS creators_organizations', on: 'creators.fk_organization = creators_organizations.organization_id' },
        { table: 'users AS updators', on: 'shantytowns.updated_by = updators.user_id' },
        { table: 'organizations AS updators_organizations ', on: 'updators.fk_organization = updators_organizations.organization_id' },
    ],
};

function getBaseSql(table, whereClause = null, order = null) {
    const tables = {
        shantytowns: table === 'regular' ? 'shantytowns' : 'ShantytownHistories',
        shantytown_origins: table === 'regular' ? 'shantytown_origins' : 'ShantytownOriginHistories',
        origin_foreign_key: table === 'regular' ? 'shantytown_id' : 'hid',
    };

    return `
        WITH
            shantytown_computed_origins AS (SELECT
                shantytown_id AS fk_shantytown,
                string_to_array(array_to_string(array_agg(soo.social_origin_id::VARCHAR || '|' || soo.label), ','), ',') AS origins
            FROM "${tables.shantytowns}" s
            LEFT JOIN "${tables.shantytown_origins}" so ON so.fk_shantytown = s.${tables.origin_foreign_key}
            LEFT JOIN social_origins soo ON so.fk_social_origin = soo.social_origin_id
            GROUP BY s.shantytown_id)
        SELECT
            ${Object.keys(SQL.selection).map(key => `${key} AS "${SQL.selection[key]}"`).join(',')},
            sco.origins AS "socialOrigins"
        FROM "${tables.shantytowns}" AS shantytowns
        ${SQL.joins.map(({ table: t, on }) => `LEFT JOIN ${t} ON ${on}`).join('\n')}
        LEFT JOIN shantytown_computed_origins sco ON sco.fk_shantytown = shantytowns.shantytown_id
        ${whereClause !== null ? `WHERE ${whereClause}` : ''}
        ${order !== null ? `ORDER BY ${order}` : ''}
    `;
}

module.exports = (database) => {
    // eslint-disable-next-line global-require
    const shantytownActorModel = require('#server/models/shantytownActorModel')(database);
    // eslint-disable-next-line global-require
    const planShantytownModel = require('#server/models/planShantytownModel')(database);

    async function getComments(user, shantytownIds, covid = false) {
        const comments = shantytownIds.reduce((acc, id) => Object.assign({}, acc, {
            [id]: [],
        }), {});

        if (covid === false && !user.isAllowedTo('list', 'shantytown_comment')) {
            return comments;
        }

        const filterPrivateComments = !user.isAllowedTo('listPrivate', 'shantytown_comment');

        const rows = await database.query(
            `SELECT
                shantytown_comments.shantytown_comment_id AS "commentId",
                shantytown_comments.fk_shantytown AS "shantytownId",
                shantytown_comments.description AS "commentDescription",
                shantytown_comments.created_at AS "commentCreatedAt",
                shantytown_comments.created_by AS "commentCreatedBy",
                shantytown_comments.private AS "commentPrivate",
                shantytown_covid_comments.date AS "covidCommentDate",
                shantytown_covid_comments.equipe_maraude AS "covidEquipeMaraude",
                shantytown_covid_comments.equipe_sanitaire AS "covidEquipeSanitaire",
                shantytown_covid_comments.equipe_accompagnement AS "covidEquipeAccompagnement",
                shantytown_covid_comments.distribution_alimentaire AS "covidDistributionAlimentaire",
                shantytown_covid_comments.action_mediation_sante as "covidActionMediationSante",
                shantytown_covid_comments.sensibilisation_vaccination as "covidSensibilisationVaccination",
                shantytown_covid_comments.equipe_mobile_depistage as "covidEquipeMobileDepistage",
                shantytown_covid_comments.equipe_mobile_vaccination as "covidEquipeMobileVaccination",
                shantytown_covid_comments.personnes_orientees AS "covidPersonnesOrientees",
                shantytown_covid_comments.personnes_avec_symptomes AS "covidPersonnesAvecSymptomes",
                shantytown_covid_comments.besoin_action AS "covidBesoinAction",
                users.first_name AS "userFirstName",
                users.last_name AS "userLastName",
                users.position AS "userPosition",
                organizations.organization_id AS "organizationId",
                organizations.name AS "organizationName",
                organizations.abbreviation AS "organizationAbbreviation"
            FROM shantytown_comments
            LEFT JOIN users ON shantytown_comments.created_by = users.user_id
            LEFT JOIN organizations ON users.fk_organization = organizations.organization_id
            LEFT JOIN shantytown_covid_comments ON shantytown_covid_comments.fk_comment = shantytown_comments.shantytown_comment_id
            WHERE
                shantytown_comments.fk_shantytown IN (:ids) 
                AND shantytown_covid_comment_id IS ${covid === true ? 'NOT ' : ''}NULL
                ${filterPrivateComments === true ? 'AND private IS FALSE ' : ''}
            ORDER BY shantytown_comments.created_at DESC`,
            {
                type: database.QueryTypes.SELECT,
                replacements: { ids: shantytownIds },
            },
        );

        rows.forEach((comment) => {
            comments[comment.shantytownId].push(
                serializeComment(comment),
            );
        }, {});

        return comments;
    }

    /**
     * Helper to add filters to restrict access to shantytowns based on user's location
     *
     * @returns {Array.<Object>}
     */
    function updateWhereClauseWithUserLocation(user, feature, where = []) {
        const featureLevel = user.permissions.shantytown[feature].geographic_level;
        const userLevel = user.organization.location.type;

        if (featureLevel !== 'nation' && (featureLevel !== 'local' || userLevel !== 'nation')) {
            const level = featureLevel === 'local' ? userLevel : featureLevel;
            if (user.organization.location[level] === null) {
                return [];
            }

            const clauseGroup = {
                location: {
                    query: `${fromGeoLevelToTableName(level)}.code`,
                    value: user.organization.location[level].code,
                },
            };
            where.push(clauseGroup);

            if (level === 'city') {
                clauseGroup.location_main_city = {
                    query: `${fromGeoLevelToTableName(level)}.fk_main`,
                    value: user.organization.location[level].code,
                };
            }
        }

        return where;
    }

    /**
     * Stringify a list of where clauses
     *
     * @returns String
     */
    function stringifyWhereClause(where, replacements) {
        return where.map((clauses, index) => {
            const clauseGroup = Object.keys(clauses).map((column) => {
                // eslint-disable-next-line no-param-reassign
                replacements[`${column}${index}`] = clauses[column].value || clauses[column];
                return `${clauses[column].query || `shantytowns.${column}`} ${clauses[column].not ? 'NOT ' : ''}IN (:${column}${index})`;
            }).join(' OR ');

            return `(${clauseGroup})`;
        }).join(' AND ');
    }

    /**
     * Fetches a list of shantytowns from the database
     *
     * @returns {Array.<Object>}
     */
    async function query(where = [], order = ['departements.code ASC', 'cities.name ASC'], user, feature, includeChangelog = false) {
        const replacements = {};
        updateWhereClauseWithUserLocation(user, feature, where);
        const whereClause = stringifyWhereClause(where, replacements);

        const towns = await database.query(
            getBaseSql(
                'regular',
                where.length > 0 ? whereClause : null,
                order.join(', '),
            ),
            {
                type: database.QueryTypes.SELECT,
                replacements,
            },
        );

        if (towns.length === 0) {
            return [];
        }
        const serializedTowns = towns.reduce(
            (object, town) => {
                /* eslint-disable no-param-reassign */
                object.hash[town.id] = serializeShantytown(town, user.permissions.shantytown[feature]);
                object.ordered.push(object.hash[town.id]);
                /* eslint-enable no-param-reassign */
                return object;
            },
            {
                hash: {},
                ordered: [],
            },
        );

        const promises = [];
        if (includeChangelog === true) {
            promises.push(
                database.query(
                    getBaseSql(
                        'history',
                        where.length > 0 ? whereClause : null,
                        ['shantytowns.shantytown_id ASC', 'shantytowns."archivedAt" ASC'].join(', '),
                    ),
                    {
                        type: database.QueryTypes.SELECT,
                        replacements,
                    },
                ),
            );
        } else {
            promises.push(Promise.resolve(undefined));
        }

        promises.push(getComments(user, Object.keys(serializedTowns.hash), false));
        promises.push(getComments(user, Object.keys(serializedTowns.hash), true));

        promises.push(
            database.query(
                `SELECT
                    shantytown_closing_solutions.fk_shantytown AS "shantytownId",
                    closing_solutions.closing_solution_id AS "closingSolutionId",
                    shantytown_closing_solutions.number_of_people_affected AS "peopleAffected",
                    shantytown_closing_solutions.number_of_households_affected AS "householdsAffected"
                FROM shantytown_closing_solutions
                LEFT JOIN closing_solutions ON shantytown_closing_solutions.fk_closing_solution = closing_solutions.closing_solution_id
                WHERE shantytown_closing_solutions.fk_shantytown IN (:ids)`,
                {
                    type: database.QueryTypes.SELECT,
                    replacements: { ids: Object.keys(serializedTowns.hash) },
                },
            ),
        );

        promises.push(
            shantytownActorModel.findAll(
                Object.keys(serializedTowns.hash),
            ),
        );

        promises.push(
            planShantytownModel.findAll(
                Object.keys(serializedTowns.hash),
            ),
        );

        const [history, comments, covidComments, closingSolutions, actors, plans] = await Promise.all(promises);

        if (history !== undefined && history.length > 0) {
            const serializedHistory = history.map(h => serializeShantytown(h, user.permissions.shantytown[feature]));
            for (let i = 1, { id } = serializedHistory[0]; i <= serializedHistory.length; i += 1) {
                if (!serializedHistory[i] || id !== serializedHistory[i].id) {
                    if (!serializedTowns.hash[id]) {
                        // eslint-disable-next-line no-continue
                        continue;
                    }

                    const diff = getDiff(serializedHistory[i - 1], serializedTowns.hash[id]);
                    if (diff.length > 0) {
                        serializedTowns.hash[id].changelog.unshift({
                            author: serializedTowns.hash[id].updatedBy,
                            date: serializedTowns.hash[id].updatedAt,
                            diff,
                        });
                    }

                    if (serializedHistory[i]) {
                        ({ id } = serializedHistory[i]);
                    }

                    // eslint-disable-next-line no-continue
                    continue;
                }

                const diff = getDiff(serializedHistory[i - 1], serializedHistory[i]);
                if (diff.length > 0) {
                    serializedTowns.hash[id].changelog.unshift({
                        author: serializedHistory[i].updatedBy,
                        date: serializedHistory[i].updatedAt,
                        diff,
                    });
                }
            }
        }

        // @todo: move the serialization of these entities to their own model component
        Object.keys(serializedTowns.hash).forEach((shantytownId) => {
            serializedTowns.hash[shantytownId].comments.regular = comments[shantytownId];
            serializedTowns.hash[shantytownId].comments.covid = covidComments[shantytownId];
        });

        if (closingSolutions !== undefined) {
            closingSolutions.forEach((closingSolution) => {
                serializedTowns.hash[closingSolution.shantytownId].closingSolutions.push({
                    id: closingSolution.closingSolutionId,
                    peopleAffected: closingSolution.peopleAffected,
                    householdsAffected: closingSolution.householdsAffected,
                });
            });
        }

        actors.forEach((actor) => {
            serializedTowns.hash[actor.shantytownId].actors.push(
                shantytownActorModel.serializeActor(actor),
            );
        });

        plans.forEach((plan) => {
            serializedTowns.hash[plan.shantytown_id].plans.push(
                planShantytownModel.serializePlan(plan),
            );
        });

        return serializedTowns.ordered;
    }

    const methods = {};
    methods.serializeComment = serializeComment;
    methods.getUsenameOf = getUsenameOf;

    methods.findAll = (user, filters = [], feature = 'list', order = undefined) => query(filters, order, user, feature);

    methods.findOne = async (user, shantytownId) => {
        const towns = await query(
            [{ shantytown_id: shantytownId }],
            undefined,
            user,
            'read',
            true, // include changelog
        );
        return towns.length === 1 ? towns[0] : null;
    };

    methods.createCovidComment = async (user, shantytownId, data) => database.transaction(async (transaction) => {
        const [[{ id }]] = await database.query(
            `INSERT INTO
                        shantytown_comments(
                            description,
                            fk_shantytown,
                            created_by,
                            private
                        )
                    VALUES (:description, :shantytownId, :createdBy, false)
                    RETURNING shantytown_comment_id AS id`,
            {
                replacements: {
                    shantytownId,
                    description: data.description,
                    createdBy: user.id,
                },
                transaction,
            },
        );

        return database.query(
            `INSERT INTO
                        shantytown_covid_comments(
                            fk_comment,
                            date,
                            action_mediation_sante,
                            sensibilisation_vaccination,
                            equipe_mobile_depistage,
                            equipe_mobile_vaccination,
                            personnes_orientees,
                            personnes_avec_symptomes,
                            besoin_action,
                            created_by  
                        )
                    VALUES
                        (
                            :id,
                            :date,
                            :action_mediation_sante,
                            :sensibilisation_vaccination,
                            :equipe_mobile_depistage,
                            :equipe_mobile_vaccination,
                            :personnes_orientees,
                            :personnes_avec_symptomes,
                            :besoin_action,
                            :created_by
                        )`,
            {
                replacements: Object.assign({
                    id,
                    created_by: user.id,
                }, data),
                transaction,
            },
        );
    });

    methods.getComments = getComments;


    /**
     * @typedef {Object} HistoryPermissions
     * @param {Object|null} 'shantytown.list'
     * @param {Object|null} 'shantytown_comment.list'
     * @param {Object|null} 'shantytown_comment.listPrivate'
     */

    /**
     * @param {Object} userLocation Location to be used for 'local' permissions
     * @param {HistoryPermissions} permissions See above
     * @param {Object} location Location to be queried
     */
    methods.getHistory = async (userLocation, permissions, location) => {
        // apply geographic level restrictions
        const where = [];
        const replacements = {};

        updateWhereClauseForPermissions({
            permissions,
            permission: 'shantytown.list',
            requestedLocation: location,
            userLocation,
            whereFn: (loc) => {
                if (!loc) {
                    where.push('false');
                    return;
                }

                if (loc.type === 'nation') {
                    return;
                }

                where.push(`${fromGeoLevelToTableName(loc.type)}.code = :shantytownLocationCode`);
                replacements.shantytownLocationCode = loc[loc.type].code;
            },
        });

        const activities = await database.query(
            `
                SELECT
                    activities.*,
                    author.first_name AS author_first_name,
                    author.last_name AS author_last_name,
                    author.fk_organization AS author_organization
                FROM
                    ((
                        SELECT
                            shantytowns.updated_at AS "date",
                            COALESCE(shantytowns.updated_by, shantytowns.created_by) AS author_id,
                            ${Object.keys(SQL.selection).map(key => `${key} AS "${SQL.selection[key]}"`).join(',')}
                        FROM "ShantytownHistories" shantytowns
                        LEFT JOIN shantytowns AS s ON shantytowns.shantytown_id = s.shantytown_id
                        ${SQL.joins.map(({ table, on }) => `LEFT JOIN ${table} ON ${on}`).join('\n')}
                        WHERE s.shantytown_id IS NOT NULL /* filter out history of deleted shantytowns */
                        ${where.length > 0 ? `AND ((${where.join(') OR (')}))` : ''}
                    )
                    UNION
                    (
                        SELECT
                            shantytowns.updated_at AS "date",
                            COALESCE(shantytowns.updated_by, shantytowns.created_by) AS author_id,
                            ${Object.keys(SQL.selection).map(key => `${key} AS "${SQL.selection[key]}"`).join(', ')}
                        FROM shantytowns
                        ${SQL.joins.map(({ table, on }) => `LEFT JOIN ${table} ON ${on}`).join('\n')}
                        ${where.length > 0 ? `WHERE (${where.join(') OR (')})` : ''}
                    )) activities
                LEFT JOIN users author ON activities.author_id = author.user_id
                ORDER BY activities.date ASC
                `,
            {
                type: database.QueryTypes.SELECT,
                replacements,
            },
        );

        const previousVersions = {};

        return activities
            .map((activity) => {
                const o = {
                    entity: 'shantytown',
                    action: null,
                    date: activity.date.getTime() / 1000,
                    author: {
                        name: userModel.formatName({
                            first_name: activity.author_first_name,
                            last_name: activity.author_last_name,
                        }),
                        organization: activity.author_organization,
                    },

                    shantytown: {
                        id: activity.id,
                        usename: getUsenameOf(activity),
                        city: {
                            code: activity.cityCode,
                            name: activity.cityName,
                        },
                        epci: {
                            code: activity.epciCode,
                            name: activity.epciName,
                        },
                        departement: {
                            code: activity.departementCode,
                            name: activity.departementName,
                        },
                        region: {
                            code: activity.regionCode,
                            name: activity.regionName,
                        },
                    },
                };

                const previousVersion = previousVersions[activity.id] || null;
                const serializedShantytown = serializeShantytown(activity, permissions['shantytown.list']);
                previousVersions[activity.id] = serializedShantytown;

                if (previousVersion === null) {
                    o.action = 'creation';
                } else if (previousVersion.closedAt === null && activity.closedAt !== null) {
                    o.action = 'closing';
                } else {
                    o.action = 'update';

                    // on utilise le nom du site dans la précédente version (au cas om ce dernier aurait changé)
                    o.shantytown.usename = getUsenameOf(previousVersion);

                    const diff = getDiff(previousVersion, serializedShantytown);
                    if (diff.length === 0) {
                        return null;
                    }

                    o.diff = diff;
                }

                return o;
            })
            .filter(activity => activity !== null)
            .reverse();
    };

    methods.update = async (editor, shantytownId, data, argTransaction = undefined) => {
        let transaction = argTransaction;
        if (transaction === undefined) {
            transaction = await database.transaction();
        }

        // save the current state of the shantytown
        const [[{ hid }]] = await database.query(
            `INSERT INTO
                    "ShantytownHistories"(
                        shantytown_id,
                        status,
                        name,
                        latitude,
                        longitude,
                        address,
                        address_details,
                        fk_city,
                        built_at,
                        declared_at,
                        closed_at,
                        fk_field_type,
                        owner,
                        fk_owner_type,
                        census_status,
                        census_conducted_at,
                        census_conducted_by,
                        justice_rendered_by,
                        population_total,
                        population_couples,
                        population_minors,
                        population_minors_0_3,
                        population_minors_3_6,
                        population_minors_6_12,
                        population_minors_12_16,
                        population_minors_16_18,
                        minors_in_school,
                        fk_electricity_type,
                        electricity_comments,
                        access_to_water,
                        water_comments,
                        water_potable,
                        water_continuous_access,
                        water_public_point,
                        water_distance,
                        water_roads_to_cross,
                        water_everyone_has_access,
                        water_stagnant_water,
                        water_hand_wash_access,
                        water_hand_wash_access_number,
                        trash_evacuation,
                        trash_cans_on_site,
                        trash_accumulation,
                        trash_evacuation_regular,
                        vermin,
                        vermin_comments,
                        fire_prevention_measures,
                        fire_prevention_diagnostic,
                        fire_prevention_site_accessible,
                        fire_prevention_devices,
                        fire_prevention_comments,
                        access_to_sanitary,
                        sanitary_comments,
                        sanitary_number,
                        sanitary_insalubrious,
                        sanitary_on_site,
                        owner_complaint,
                        justice_procedure,
                        justice_rendered,
                        justice_rendered_at,
                        justice_challenged,
                        police_status,
                        police_requested_at,
                        police_granted_at,
                        bailiff,
                        closed_with_solutions,
                        resorption_target,
                        created_at,
                        created_by,
                        updated_at,
                        updated_by,
                        "archivedAt"
                    )
                SELECT
                    shantytown_id,
                    status,
                    name,
                    latitude,
                    longitude,
                    address,
                    address_details,
                    fk_city,
                    built_at,
                    declared_at,
                    closed_at,
                    fk_field_type,
                    owner,
                    fk_owner_type,
                    census_status::text::"enum_ShantytownHistories_census_status",
                    census_conducted_at,
                    census_conducted_by,
                    justice_rendered_by,
                    population_total,
                    population_couples,
                    population_minors,
                    population_minors_0_3,
                    population_minors_3_6,
                    population_minors_6_12,
                    population_minors_12_16,
                    population_minors_16_18,
                    minors_in_school,
                    fk_electricity_type,
                    electricity_comments,
                    access_to_water,
                    water_comments,
                    water_potable,
                    water_continuous_access,
                    water_public_point,
                    water_distance::text::"enum_ShantytownHistories_water_distance",
                    water_roads_to_cross,
                    water_everyone_has_access,
                    water_stagnant_water,
                    water_hand_wash_access,
                    water_hand_wash_access_number,
                    trash_evacuation,
                    trash_cans_on_site,
                    trash_accumulation,
                    trash_evacuation_regular,
                    vermin,
                    vermin_comments,
                    fire_prevention_measures,
                    fire_prevention_diagnostic,
                    fire_prevention_site_accessible,
                    fire_prevention_devices,
                    fire_prevention_comments,
                    access_to_sanitary,
                    sanitary_comments,
                    sanitary_number,
                    sanitary_insalubrious,
                    sanitary_on_site,
                    owner_complaint,
                    justice_procedure,
                    justice_rendered,
                    justice_rendered_at,
                    justice_challenged,
                    police_status::text::"enum_ShantytownHistories_police_status",
                    police_requested_at,
                    police_granted_at,
                    bailiff,
                    closed_with_solutions,
                    resorption_target,
                    created_at,
                    created_by,
                    updated_at,
                    updated_by,
                    NOW()
                FROM shantytowns WHERE shantytown_id = :id
                RETURNING hid`,
            {
                replacements: {
                    id: shantytownId,
                },
                transaction,
            },
        );

        await Promise.all([
            database.query(
                `INSERT INTO
                        "ShantytownOriginHistories"(
                            fk_shantytown,
                            fk_social_origin,
                            created_at,
                            updated_at,
                            "archivedAt"
                        )
                    SELECT
                        :hid,
                        fk_social_origin,
                        created_at,
                        updated_at,
                        NOW()
                    FROM shantytown_origins WHERE fk_shantytown = :id`,
                {
                    replacements: {
                        hid,
                        id: shantytownId,
                    },
                    transaction,
                },
            ),
            database.query(
                `INSERT INTO
                        "ShantytownClosingSolutionHistories"(
                            fk_shantytown,
                            fk_closing_solution,
                            number_of_people_affected,
                            number_of_households_affected,
                            created_at,
                            updated_at,
                            "archivedAt"
                        )
                    SELECT
                        :hid,
                        fk_closing_solution,
                        number_of_people_affected,
                        number_of_households_affected,
                        created_at,
                        updated_at,
                        NOW()
                    FROM shantytown_closing_solutions WHERE fk_shantytown = :id`,
                {
                    replacements: {
                        hid,
                        id: shantytownId,
                    },
                    transaction,
                },
            ),
        ]);

        // now, update the shantytown
        const justiceKeys = [
            'owner_complaint',
            'justice_procedure',
            'justice_rendered',
            'justice_rendered_at',
            'justice_rendered_by',
            'justice_challenged',
            'police_status',
            'police_requested_at',
            'police_granted_at',
            'bailiff',
        ];
        const { commonData, justiceData } = Object.keys(data).reduce(
            (acc, key) => {
                if (['social_origins', 'closing_solutions'].includes(key)) { // ignore social_origins, they are a special case
                    return acc;
                }

                if (justiceKeys.includes(key)) {
                    return {
                        commonData: acc.commonData,
                        justiceData: {
                            ...acc.justiceData,
                            [key]: data[key],
                        },
                    };
                }

                return {
                    commonData: {
                        ...acc.commonData,
                        [key]: data[key],
                    },
                    justiceData: acc.justiceData,
                };
            },
            { commonData: {}, justiceData: {} },
        );

        const updatedTown = Object.assign(
            commonData,
            {
                updated_by: editor.id,
                updated_at: new Date(),
            },
            editor.permissions.shantytown.update.data_justice === true
                ? justiceData
                : {},
        );

        await database.query(
            `UPDATE shantytowns
                SET
                    ${Object.keys(updatedTown).map(column => `${column} = :${column}`).join(', ')}
                WHERE shantytown_id = :id`,
            {
                replacements: Object.assign(updatedTown, {
                    id: shantytownId,
                }),
                transaction,
            },
        );

        if (Array.isArray(data.social_origins)) {
            await database.query(
                'DELETE FROM shantytown_origins WHERE fk_shantytown = :id',
                {
                    replacements: {
                        id: shantytownId,
                    },
                    transaction,
                },
            );

            if (data.social_origins.length > 0) {
                await database.query(
                    `INSERT INTO
                            shantytown_origins(fk_shantytown, fk_social_origin)
                        VALUES
                            ${data.social_origins.map(() => '(?, ?)').join(', ')}`,
                    {
                        replacements: data.social_origins.reduce((arr, origin) => [
                            ...arr,
                            shantytownId,
                            origin,
                        ], []),
                        transaction,
                    },
                );
            }
        }

        if (Array.isArray(data.closing_solutions)) {
            await database.query(
                'DELETE FROM shantytown_closing_solutions WHERE fk_shantytown = :id',
                {
                    replacements: {
                        id: shantytownId,
                    },
                    transaction,
                },
            );

            if (data.closing_solutions.length > 0) {
                await database.query(
                    `INSERT INTO
                            shantytown_closing_solutions(fk_shantytown, fk_closing_solution, number_of_people_affected, number_of_households_affected)
                        VALUES
                            ${data.closing_solutions.map(() => '(?, ?, ?, ?)').join(', ')}`,
                    {
                        replacements: data.closing_solutions.reduce((arr, solution) => [
                            ...arr,
                            shantytownId,
                            solution.id,
                            solution.people_affected,
                            solution.households_affected,
                        ], []),
                        transaction,
                    },
                );
            }
        }

        if (argTransaction === undefined) {
            await transaction.commit();
        }
    };


    methods.findNearby = async (user, latitude, longitude, distance) => {
        const replacements = {};
        const locationWhere = [];
        updateWhereClauseWithUserLocation(user, 'list', locationWhere);
        const locationWhereClause = stringifyWhereClause(locationWhere, replacements);

        const distanceCalc = '(6371 * 2 * ASIN(SQRT( POWER(SIN(( :latitude - shantytowns.latitude) *  pi()/180 / 2), 2) +COS( :latitude * pi()/180) * COS(shantytowns.latitude * pi()/180) * POWER(SIN(( :longitude - shantytowns.longitude) * pi()/180 / 2), 2) )))';

        return database.query(`
        SELECT 
            shantytowns.shantytown_id,
            shantytowns.name,
            shantytowns.status,
            shantytowns.declared_at,
            shantytowns.built_at,
            shantytowns.closed_at,
            shantytowns.latitude,
            shantytowns.longitude,
            shantytowns.address,
            shantytowns.address_details,
            ${distanceCalc} as distance,
            (SELECT regexp_matches(shantytowns.address, '^(.+) [0-9]+ [^,]+,? [0-9]+,? [^, ]+(,.+)?$'))[1] as address_simple
        FROM shantytowns
        LEFT JOIN cities on shantytowns.fk_city = cities.code
        LEFT JOIN epci on cities.fk_epci = epci.code
        LEFT JOIN departements on cities.fk_departement = departements.code
        LEFT JOIN regions on departements.fk_region = regions.code
        WHERE 
            ${distanceCalc} < :distanceRadius
            AND closed_at is NULL
            ${locationWhereClause ? `AND ${locationWhereClause}` : ''}
        ORDER BY distance ASC
        `,
        {
            type: database.QueryTypes.SELECT,
            replacements: {
                ...replacements, latitude, longitude, distanceRadius: distance,
            },
        });
    };

    return methods;
};
