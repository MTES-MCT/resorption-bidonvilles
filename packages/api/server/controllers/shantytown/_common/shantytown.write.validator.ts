/* eslint-disable no-restricted-syntax */
/* eslint-disable newline-per-chained-call */
import { body, param } from 'express-validator';
import validator from 'validator';
import permissionUtils from '#server/utils/permission';
import shantytownService from '#server/services/shantytown';
// models
import shantytownModel from '#server/models/shantytownModel';
import fieldTypeModel from '#server/models/fieldTypeModel';
import geoModel from '#server/models/geoModel';
import ownerTypeModel from '#server/models/ownerTypeModel';
import socialOriginModel from '#server/models/socialOriginModel';
import preparatoryPhasesTowardResorptionModel from '#server/models/preparatoryPhasesTowardResorptionModel';
// types
import { SocialOrigin } from '#root/types/resources/SocialOrigin.d';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import { PreparatoryPhaseTowardResorption } from '#root/types/resources/PreparatoryPhaseTowardResorption.d';
import { SimplifiedPhase } from '#root/types/resources/ShantytownPreparatoryPhasesTowardResorption.d';

const { isLatLong, trim } = validator;
const { can } = permissionUtils;

const valueMap = [null, false, true];

function formatDateToYYYYMMDD(date: Date): string {
    return date.toISOString().slice(0, 10);
}

function fromIntToBoolSanitizer(value) {
    if (value === -1) {
        return null;
    }

    return value === 1;
}

function validateNull(value: any): number | null {
    return value === '' ? null : value;
}

function validateInteger(value: any): number | null {
    return Number.isInteger(value) ? value : null;
}

function validateIntegerWithMinValue(fieldName: string, min: number, firstSanitizer: (value: any) => number | null, secondSanitizer: (value: any) => number | null) {
    return [
        body(fieldName)
            .optional({ nullable: true })
            .customSanitizer(firstSanitizer)
            .toInt()
            .isInt().bail().withMessage(`Le champ "${fieldName}" est invalide`)
            .isInt({ min }).withMessage(`Le champ "${fieldName}" ne peut pas être inférieur à ${min}`)
            .customSanitizer(secondSanitizer),
    ];
}

function getStringOrNull(value: string | null | undefined): string | null {
    if (value === undefined || value === null || value === '') {
        return null;
    }
    return value;
}

function getNumberOrNull(value: string | number | null | undefined): number | null {
    if (value === undefined || value === null) {
        return null;
    }
    const stringValue = value.toString();
    return stringValue !== '' ? parseInt(stringValue, 10) : null;
}

function checkForInValueMap(value: number | undefined): boolean | undefined {
    return value !== undefined ? valueMap[value + 1] : undefined;
}

const excludeSignedUrls = (key: string, value: any): any => {
    if (key === 'urls') {
        return undefined;
    }
    return value;
};

export default mode => ([
    param('id')
        .if(() => mode === 'update')
        .custom(async (value, { req }) => {
            let town: Shantytown;
            try {
                town = await shantytownService.find(req.user, value);
            } catch (error) {
                throw new Error('Une erreur de lecture en base de données est survenue');
            }

            if (town === null) {
                throw new Error('Le site à modifier n\'existe pas ou vous n\'avez pas le droit pour le modifier');
            }

            req.town = town;
        }),


    /* **********************************************************************************************
     * Mise à jour de site sans modification de données
     ********************************************************************************************* */
    body('updated_without_any_change')
        .isBoolean().withMessage('Le champ "updated_without_any_change" doit être un booléen')
        .custom(async (value, { req }) => {
            let hasChanges = false;

            let existingPreparatoryPhasesTowardResorption = [];
            let updatedPreparatoryPhasesTowardResorption = [];
            if (mode !== 'create') {
                existingPreparatoryPhasesTowardResorption = req.town.preparatoryPhasesTowardResorption.map((phase: SimplifiedPhase) => ({
                    preparatoryPhaseId: phase.preparatoryPhaseId,
                    completedAt: phase.completedAt,
                }));

                updatedPreparatoryPhasesTowardResorption = req.body.preparatory_phases_toward_resorption.map(phase => ({
                    preparatoryPhaseId: phase,
                    completedAt: req.body.terminated_preparatory_phases_toward_resorption[phase] ? new Date(req.body.terminated_preparatory_phases_toward_resorption[phase]).getTime() / 1000 : null,
                }));
            }


            if (req.town) {
                const fieldsToCheck = [
                    {
                        key: 'address',
                        submitedValue: getStringOrNull(req.body.address),
                        storedValue: getStringOrNull(req.town.address),
                    },
                    {
                        key: 'name',
                        submitedValue: getStringOrNull(req.body.name),
                        storedValue: getStringOrNull(req.town.name),
                    },
                    {
                        key: 'coordinates',
                        submitedValue: req.body.coordinates,
                        storedValue: `${req.town.latitude},${req.town.longitude}`,
                    },
                    {
                        key: 'built_at',
                        submitedValue: getStringOrNull(req.body.built_at),
                        storedValue: req.town.builtAt ? formatDateToYYYYMMDD(new Date(req.town.builtAt * 1000)) : null,
                    },
                    {
                        key: 'declared_at',
                        submitedValue: getStringOrNull(req.body.declared_at),
                        storedValue: req.town.declaredAt ? formatDateToYYYYMMDD(new Date(req.town.declaredAt * 1000)) : null,
                    },
                    {
                        key: 'field_type',
                        submitedValue: req.body.field_type,
                        storedValue: req.town.fieldType.id,
                    },
                    {
                        key: 'detailed_address',
                        submitedValue: getStringOrNull(req.body.detailed_address),
                        storedValue: getStringOrNull(req.town.addressDetails),
                    },
                    {
                        key: 'owner_type',
                        submitedValue: req.body.owner_type,
                        storedValue: req.town.ownerType.id,
                    },
                    {
                        key: 'owner',
                        submitedValue: getStringOrNull(req.body.owner),
                        storedValue: getStringOrNull(req.town.owner),
                    },
                    {
                        key: 'population_total',
                        submitedValue: getNumberOrNull(req.body.population_total),
                        storedValue: getNumberOrNull(req.town.populationTotal),
                    },
                    {
                        key: 'population_total_females',
                        submitedValue: getNumberOrNull(req.body.population_total_females),
                        storedValue: getNumberOrNull(req.town.populationTotalFemales),
                    },
                    {
                        key: 'population_couples',
                        submitedValue: getNumberOrNull(req.body.population_couples),
                        storedValue: getNumberOrNull(req.town.populationCouples),
                    },
                    {
                        key: 'population_minors',
                        submitedValue: getNumberOrNull(req.body.population_minors),
                        storedValue: getNumberOrNull(req.town.populationMinors),
                    },
                    {
                        key: 'population_minors_girls',
                        submitedValue: getNumberOrNull(req.body.population_minors_girls),
                        storedValue: getNumberOrNull(req.town.populationMinorsGirls),
                    },
                    {
                        key: 'population_minors_0_3',
                        submitedValue: getNumberOrNull(req.body.population_minors_0_3),
                        storedValue: getNumberOrNull(req.town.populationMinors0To3),
                    },
                    {
                        key: 'population_minors_3_6',
                        submitedValue: getNumberOrNull(req.body.population_minors_3_6),
                        storedValue: getNumberOrNull(req.town.populationMinors3To6),
                    },
                    {
                        key: 'population_minors_6_12',
                        submitedValue: getNumberOrNull(req.body.population_minors_6_12),
                        storedValue: getNumberOrNull(req.town.populationMinors6To12),
                    },
                    {
                        key: 'population_minors_12_16',
                        submitedValue: getNumberOrNull(req.body.population_minors_12_16),
                        storedValue: getNumberOrNull(req.town.populationMinors12To16),
                    },
                    {
                        key: 'population_minors_16_18',
                        submitedValue: getNumberOrNull(req.body.population_minors_16_18),
                        storedValue: getNumberOrNull(req.town.populationMinors16To18),
                    },
                    {
                        key: 'minors_in_school',
                        submitedValue: getNumberOrNull(req.body.minors_in_school),
                        storedValue: getNumberOrNull(req.town.minorsInSchool),
                    },
                    {
                        key: 'social_origins',
                        submitedValue: req.body.social_origins ? JSON.stringify(req.body.social_origins.sort()) : null,
                        storedValue: req.town.socialOrigins ? JSON.stringify(req.town.socialOrigins.map((so: SocialOrigin) => so.id).sort()) : null,
                    },
                    {
                        key: 'caravans',
                        submitedValue: getNumberOrNull(req.body.caravans),
                        storedValue: getNumberOrNull(req.town.caravans),
                    },
                    {
                        key: 'huts',
                        submitedValue: getNumberOrNull(req.body.huts),
                        storedValue: getNumberOrNull(req.town.huts),
                    },
                    {
                        key: 'tents',
                        submitedValue: getNumberOrNull(req.body.tents),
                        storedValue: getNumberOrNull(req.town.tents),
                    },
                    {
                        key: 'cars',
                        submitedValue: getNumberOrNull(req.body.cars),
                        storedValue: getNumberOrNull(req.town.cars),
                    },
                    {
                        key: 'mattresses',
                        submitedValue: getNumberOrNull(req.body.mattresses),
                        storedValue: getNumberOrNull(req.town.mattresses),
                    },
                    {
                        key: 'census_status',
                        submitedValue: req.body.census_status,
                        storedValue: req.town.censusStatus,
                    },
                    {
                        key: 'census_conducted_at',
                        submitedValue: req.body.census_conducted_at ? req.body.census_conducted_at : null,
                        storedValue: req.town.censusConductedAt ? formatDateToYYYYMMDD(new Date(req.town.censusConductedAt * 1000)) : null,
                    },
                    {
                        key: 'census_conducted_by',
                        submitedValue: req.body.census_conducted_by,
                        storedValue: req.town.censusConductedBy,
                    },
                    {
                        key: 'is_reinstallation',
                        submitedValue: checkForInValueMap(req.body.is_reinstallation),
                        storedValue: req.town.isReinstallation,
                    },
                    {
                        key: 'reinstallation_comments',
                        submitedValue: getStringOrNull(req.body.reinstallation_comments),
                        storedValue: getStringOrNull(req.town.reinstallationComments),
                    },
                    {
                        key: 'reinstallation_incoming_towns',
                        submitedValue: req.body.reinstallation_incoming_towns ? JSON.stringify(req.body.reinstallation_incoming_towns.sort()) : null,
                        storedValue: req.town.reinstallationIncomingTowns ? JSON.stringify(req.town.reinstallationIncomingTowns.map(rit => rit.id).sort()) : null,
                    },
                    {
                        key: 'water_access_type',
                        submitedValue: getStringOrNull(req.body.water_access_type),
                        storedValue: getStringOrNull(req.town.livingConditions.water.access_type),
                    },
                    {
                        key: 'water_access_type_details',
                        submitedValue: getStringOrNull(req.body.water_access_type_details),
                        storedValue: getStringOrNull(req.town.livingConditions.water.access_type_details),
                    },
                    {
                        key: 'water_access_is_public',
                        submitedValue: checkForInValueMap(req.body.water_access_is_public),
                        storedValue: req.town.livingConditions.water.access_is_public,
                    },
                    {
                        key: 'water_access_is_continuous',
                        submitedValue: checkForInValueMap(req.body.water_access_is_continuous),
                        storedValue: req.town.livingConditions.water.access_is_continuous,
                    },
                    {
                        key: 'water_access_is_continuous_details',
                        submitedValue: req.body.water_access_is_continuous_details,
                        storedValue: req.town.livingConditions.water.access_is_continuous_details,
                    },
                    {
                        key: 'water_access_is_local',
                        submitedValue: checkForInValueMap(req.body.water_access_is_local),
                        storedValue: req.town.livingConditions.water.access_is_local,
                    },
                    {
                        key: 'water_access_is_close',
                        submitedValue: checkForInValueMap(req.body.water_access_is_close),
                        storedValue: req.town.livingConditions.water.access_is_close,
                    },
                    {
                        key: 'water_access_is_unequal',
                        submitedValue: checkForInValueMap(req.body.water_access_is_unequal),
                        storedValue: req.town.livingConditions.water.access_is_unequal,
                    },
                    {
                        key: 'water_access_is_unequal_details',
                        submitedValue: req.body.water_access_is_unequal_details,
                        storedValue: req.town.livingConditions.water.access_is_unequal_details,
                    },
                    {
                        key: 'water_access_has_stagnant_water',
                        submitedValue: checkForInValueMap(req.body.water_access_has_stagnant_water),
                        storedValue: req.town.livingConditions.water.access_has_stagnant_water,
                    },
                    {
                        key: 'water_access_comments',
                        submitedValue: getStringOrNull(req.body.water_access_comments),
                        storedValue: getStringOrNull(req.town.livingConditions.water.access_comments),
                    },
                    {
                        key: 'sanitary_working_toilets',
                        submitedValue: checkForInValueMap(req.body.sanitary_working_toilets),
                        storedValue: req.town.livingConditions.sanitary.working_toilets,
                    },
                    {
                        key: 'sanitary_open_air_defecation',
                        submitedValue: checkForInValueMap(req.body.sanitary_open_air_defecation),
                        storedValue: req.town.livingConditions.sanitary.open_air_defecation,
                    },
                    {
                        key: 'sanitary_toilet_types',
                        submitedValue: req.body.sanitary_toilet_types && req.body.sanitary_toilet_types.length > 0 ? JSON.stringify(req.body.sanitary_toilet_types.sort()) : '[]',
                        storedValue: req.town.livingConditions.sanitary.toilet_types ? JSON.stringify(req.town.livingConditions.sanitary.toilet_types.sort()) : '[]',
                    },
                    {
                        key: 'sanitary_toilets_are_inside',
                        submitedValue: checkForInValueMap(req.body.sanitary_toilets_are_inside),
                        storedValue: req.town.livingConditions.sanitary.toilets_are_inside,
                    },
                    {
                        key: 'sanitary_toilets_are_lighted',
                        submitedValue: checkForInValueMap(req.body.sanitary_toilets_are_lighted),
                        storedValue: req.town.livingConditions.sanitary.toilets_are_lighted,
                    },
                    {
                        key: 'sanitary_hand_washing',
                        submitedValue: checkForInValueMap(req.body.sanitary_hand_washing),
                        storedValue: req.town.livingConditions.sanitary.hand_washing,
                    },
                    {
                        key: 'electricity_access',
                        submitedValue: checkForInValueMap(req.body.electricity_access),
                        storedValue: req.town.livingConditions.electricity.access,
                    },
                    {
                        key: 'electricity_access_types',
                        submitedValue: req.body.electricity_access_types && req.body.electricity_access_types?.length > 0 ? JSON.stringify(req.body.electricity_access_types.sort()) : '[]',
                        storedValue: req.town.livingConditions.electricity.access_types ? JSON.stringify(req.town.livingConditions.electricity.access_types.sort()) : '[]',
                    },
                    {
                        key: 'electricity_access_is_unequal',
                        submitedValue: checkForInValueMap(req.body.electricity_access_is_unequal),
                        storedValue: req.town.livingConditions.electricity.access_is_unequal,
                    },
                    {
                        key: 'trash_is_piling',
                        submitedValue: checkForInValueMap(req.body.trash_is_piling),
                        storedValue: req.town.livingConditions.trash.is_piling,
                    },
                    {
                        key: 'trash_evacuation_is_close',
                        submitedValue: checkForInValueMap(req.body.trash_evacuation_is_close),
                        storedValue: req.town.livingConditions.trash.evacuation_is_close,
                    },
                    {
                        key: 'trash_evacuation_is_safe',
                        submitedValue: checkForInValueMap(req.body.trash_evacuation_is_safe),
                        storedValue: req.town.livingConditions.trash.evacuation_is_safe,
                    },
                    {
                        key: 'trash_evacuation_is_regular',
                        submitedValue: checkForInValueMap(req.body.trash_evacuation_is_regular),
                        storedValue: req.town.livingConditions.trash.evacuation_is_regular,
                    },
                    {
                        key: 'trash_bulky_is_piling',
                        submitedValue: checkForInValueMap(req.body.trash_bulky_is_piling),
                        storedValue: req.town.livingConditions.trash.bulky_is_piling,
                    },
                    {
                        key: 'pest_animals_presence',
                        submitedValue: checkForInValueMap(req.body.pest_animals_presence),
                        storedValue: req.town.livingConditions.pest_animals ? req.town.livingConditions.pest_animals.presence : null,
                    },
                    {
                        key: 'pest_animals_details',
                        submitedValue: getStringOrNull(req.body.pest_animals_details),
                        storedValue: req.town.livingConditions.pest_animals ? getStringOrNull(req.town.livingConditions.pest_animals.details) : null,
                    },
                    {
                        key: 'fire_prevention_diagnostic',
                        submitedValue: checkForInValueMap(req.body.fire_prevention_diagnostic),
                        storedValue: req.town.livingConditions.fire_prevention ? req.town.livingConditions.fire_prevention.diagnostic : null,
                    },
                    {
                        key: 'owner_complaint',
                        submitedValue: checkForInValueMap(req.body.owner_complaint),
                        storedValue: req.town.ownerComplaint,
                    },
                    {
                        key: 'justice_procedure',
                        submitedValue: checkForInValueMap(req.body.justice_procedure),
                        storedValue: req.town.justiceProcedure,
                    },
                    {
                        key: 'justice_rendered',
                        submitedValue: checkForInValueMap(req.body.justice_rendered),
                        storedValue: req.town.justiceRendered,
                    },
                    {
                        key: 'justice_rendered_by',
                        submitedValue: getStringOrNull(req.body.justice_rendered_by),
                        storedValue: getStringOrNull(req.town.justiceRenderedBy),
                    },
                    {
                        key: 'justice_rendered_at',
                        submitedValue: req.body.justice_rendered_at ? req.body.justice_rendered_at : null,
                        storedValue: req.town.justiceRenderedAt ? formatDateToYYYYMMDD(new Date(req.town.justiceRenderedAt * 1000)) : null,
                    },
                    {
                        key: 'justice_challenged',
                        submitedValue: checkForInValueMap(req.body.justice_challenged),
                        storedValue: req.town.justiceChallenged,
                    },
                    {
                        key: 'evacuation_under_time_limit',
                        submitedValue: checkForInValueMap(req.body.evacuation_under_time_limit),
                        storedValue: req.town.evacuationUnderTimeLimit,
                    },
                    {
                        key: 'administrative_order_decision_at',
                        submitedValue: req.body.administrative_order_decision_at ? req.body.administrative_order_decision_at : null,
                        storedValue: req.town.administrativeOrderDecisionAt ? formatDateToYYYYMMDD(new Date(req.town.administrativeOrderDecisionAt * 1000)) : null,
                    },
                    {
                        key: 'administrative_order_decision_rendered_by',
                        submitedValue: getStringOrNull(req.body.administrative_order_decision_rendered_by),
                        storedValue: getStringOrNull(req.town.administrativeOrderDecisionRenderedBy),
                    },
                    {
                        key: 'administrative_order_evacuation_at',
                        submitedValue: req.body.administrative_order_evacuation_at ? req.body.administrative_order_evacuation_at : null,
                        storedValue: req.town.administrativeOrderEvacuationAt ? formatDateToYYYYMMDD(new Date(req.town.administrativeOrderEvacuationAt * 1000)) : null,
                    },
                    {
                        key: 'insalubrity_order',
                        submitedValue: checkForInValueMap(req.body.insalubrity_order),
                        storedValue: req.town.insalubrityOrder,
                    },
                    {
                        key: 'insalubrity_order_displayed',
                        submitedValue: checkForInValueMap(req.body.insalubrity_order_displayed),
                        storedValue: req.town.insalubrityOrderDisplayed,
                    },
                    {
                        key: 'insalubrity_order_type',
                        submitedValue: getStringOrNull(req.body.insalubrity_order_type),
                        storedValue: getStringOrNull(req.town.insalubrityOrderType),
                    },
                    {
                        key: 'insalubrity_order_by',
                        submitedValue: getStringOrNull(req.body.insalubrity_order_by),
                        storedValue: getStringOrNull(req.town.insalubrityOrderBy),
                    },
                    {
                        key: 'insalubrity_order_at',
                        submitedValue: req.body.insalubrity_order_at ? req.body.insalubrity_order_at : null,
                        storedValue: req.town.insalubrityOrderAt ? formatDateToYYYYMMDD(new Date(req.town.insalubrityOrderAt * 1000)) : null,
                    },
                    {
                        key: 'insalubrity_parcels',
                        submitedValue: getStringOrNull(req.body.insalubrity_parcels),
                        storedValue: getStringOrNull(req.town.insalubrityParcels),
                    },
                    {
                        key: 'police_status',
                        submitedValue: req.body.police_status,
                        storedValue: req.town.policeStatus,
                    },
                    {
                        key: 'police_requested_at',
                        submitedValue: req.body.police_requested_at ? req.body.police_requested_at : null,
                        storedValue: req.town.policeRequestedAt ? formatDateToYYYYMMDD(new Date(req.town.policeRequestedAt * 1000)) : null,
                    },
                    {
                        key: 'police_granted_at',
                        submitedValue: req.body.police_granted_at ? req.body.police_granted_at : null,
                        storedValue: req.town.policeGrantedAt ? formatDateToYYYYMMDD(new Date(req.town.policeGrantedAt * 1000)) : null,
                    },
                    {
                        key: 'existing_litigation',
                        submitedValue: checkForInValueMap(req.body.existing_litigation),
                        storedValue: req.town.existingLitigation,
                    },
                    {
                        key: 'bailiff',
                        submitedValue: getStringOrNull(req.body.bailiff),
                        storedValue: getStringOrNull(req.town.bailiff),
                    },
                    {
                        key: 'newAttachments',
                        submitedValue: req.body.newAttachments && req.body.newAttachments.length > 0 ? JSON.stringify(req.body.newAttachments) : null,
                        storedValue: req.town.newAttachments ? JSON.stringify(req.town.newAttachments) : null,
                    },
                    {
                        key: 'attachments',
                        submitedValue: req.body.existingAttachments && req.body.existingAttachments.length > 0 ? JSON.stringify(req.body.existingAttachments, excludeSignedUrls) : '[]',
                        storedValue: req.town.attachments ? JSON.stringify(req.town.attachments, excludeSignedUrls) : '[]',
                    },
                ];

                if (mode !== 'create') {
                    fieldsToCheck.push({
                        key: 'preparatory_phases_toward_resorption',
                        submitedValue: updatedPreparatoryPhasesTowardResorption ? JSON.stringify(updatedPreparatoryPhasesTowardResorption) : null,
                        storedValue: existingPreparatoryPhasesTowardResorption ? JSON.stringify(existingPreparatoryPhasesTowardResorption) : null,
                    });
                }

                // Y at'il des modifications des données dans les champs du formulaire ?
                hasChanges = fieldsToCheck.some(field => field.submitedValue !== field.storedValue);
            }

            // Si update_without_any_change est à true, alors aucun champ ne doit être modifié
            if (value) {
                // Vérifier qu'aucun autre champ n'a été modifié
                if (hasChanges) {
                    throw new Error('Aucun autre champ ne doit être modifié s\'il s\'agit d\'une mise à jour de site sans modification de données');
                }
            // Si update_without_any_change est à false, alors au moins un champ doit être modifié
            } else if (req.town && !hasChanges) {
                throw new Error('Au moins un champ doit être modifié s\'il ne s\'agit pas d\'une mise à jour de site sans modification de données');
            }
            return true;
        }),


    /* **********************************************************************************************
     * Localisation géographique
     ********************************************************************************************* */
    body('address')
        // adresse
        .custom(async (value, { req }) => {
            if (value === undefined || value === null) {
                throw new Error('Le champ "Localisation géographique" est obligatoire');
            }

            if (typeof value !== 'string') {
                throw new Error('Le champ "Localisation géographique" est invalide');
            }

            const trimmed = trim(value);
            if (trimmed === '') {
                throw new Error('Le champ "Localisation géographique" est obligatoire');
            }

            req.body.address = trimmed;
            return true;
        })
        // ville
        .custom(async (value, { req }) => {
            if (req.body.citycode === undefined || req.body.citycode === null) {
                throw new Error('Le code communal est obligatoire');
            }

            if (typeof req.body.citycode !== 'string') {
                throw new Error('Le code communal est invalide');
            }

            let city;
            try {
                city = await geoModel.getLocation('city', req.body.citycode);
            } catch (e) {
                throw new Error('Une erreur de lecture en base de données est survenue lors de la validation du code communal');
            }

            if (city === null) {
                throw new Error('Le code communal ne correspond à aucune commune référencée en base de données');
            }

            req.body.city = city;
            return true;
        })
        // permissions d'écriture
        .custom((value, { req }) => {
            if (!req.body.city) {
                return true;
            }

            if (!can(req.user).do(mode, 'shantytown').on(req.body.city)) {
                let wording;
                switch (mode) {
                    case 'create':
                        wording = 'de déclarer un';
                        break;
                    case 'edit':
                        wording = 'de modifier un';
                        break;
                    case 'report':
                        wording = 'd\'informer d\'un nouveau';
                        break;
                    default:
                        break;
                }
                throw new Error(`Vous n'avez pas le droit ${wording} site sur ce territoire`);
            }

            return true;
        })
        // coordonnées GPS
        .custom((value, { req }) => {
            if (!req.body.coordinates) {
                throw new Error('Les coordonnées GPS sont obligatoires');
            }

            if (!isLatLong(req.body.coordinates)) {
                throw new Error('Les coordonnées GPS sont invalides');
            }

            const [latitude, longitude] = req.body.coordinates.split(',');
            req.body.latitude = parseFloat(latitude);
            req.body.longitude = parseFloat(longitude);

            return true;
        }),


    /* **********************************************************************************************
     * Date de mise à jour des données du site
     ********************************************************************************************* */
    body('updated_at')
        .customSanitizer((value) => {
            if (mode === 'update') {
                return value;
            }

            return new Date();
        })
        .exists({ checkNull: true }).bail().withMessage('Le champ "Date de mise à jour" est obligatoire')
        .toDate()
        .customSanitizer((value) => {
            const today = new Date();

            if (value > today) {
                return today;
            }
            return value;
        })
        .custom((value, { req }) => {
            // for updates only
            if (req.town) {
                const lastUpdate = new Date(req.town.updatedAt);

                if (value < lastUpdate) {
                    throw new Error('La date de mise à jour du site ne peut pas être antérieure à la précédente mise à jour');
                }
            }

            return true;
        }),
    /* **********************************************************************************************
     * Appellation du site
     ********************************************************************************************* */
    body('name')
        .optional({ nullable: true })
        .isString().bail().withMessage('Le champ "Appellation du site" est invalide')
        .trim()
        .isLength({ max: 35 }).bail().withMessage('Le champ "Appellation du site" ne peut excéder 35 caractères'),

    body('name')
        .customSanitizer(value => value || null)
        .matches(/^[^<>]*$/, 'i').withMessage('Le champ "Appellation du site" n\'est pas correctement renseigné'),

    /* **********************************************************************************************
     * Information d'accès
     ********************************************************************************************* */
    body('detailed_address')
        .optional({ nullable: true })
        .isString().bail().withMessage('Le champ "Information d\'accès" est invalide')
        .trim(),

    body('detailed_address')
        .customSanitizer(value => value || null),

    /* **********************************************************************************************
     * Date d'installation du site
     ********************************************************************************************* */
    body('built_at')
        .optional({ nullable: true })
        .isDate().bail().withMessage('Le champ "Date d\'installation du site" est invalide')
        .toDate()
        .customSanitizer((value) => {
            value.setHours(0, 0, 0, 0);
            return value;
        })
        .custom((value) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (value > today) {
                throw new Error('La date d\'installation du site ne peut pas être future');
            }

            return true;
        }),

    /* **********************************************************************************************
     * Date de signalement du site
     ********************************************************************************************* */
    body('declared_at')
        .customSanitizer((value) => {
            if (!value) {
                return null;
            }
            return value;
        })
        .if(() => mode !== 'update')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Date de signalement du site" est obligatoire')
        .isDate().bail().withMessage('Le champ "Date de signalement du site" est invalide')
        .toDate()
        .if((value, { req }) => mode !== 'update' || !req.town || value.getTime() / 1000 !== req.town.declaredAt)
        .customSanitizer((value) => {
            value.setHours(0, 0, 0, 0);
            return value;
        })
        .custom((value, { req }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (value > today) {
                throw new Error('La date de signalement du site ne peut pas être future');
            }

            if (value < req.body.built_at) {
                throw new Error('La date de signalement du site ne peut pas être antérieure à la date d\'installation');
            }

            return true;
        }),

    /* **********************************************************************************************
     * Type de site
     ********************************************************************************************* */
    body('field_type')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Type de site" est obligatoire')
        .toInt()
        .isInt().bail().withMessage('Le champ "Type de site" est invalide')
        .custom(async (value, { req }) => {
            let fieldType;
            try {
                fieldType = await fieldTypeModel.findOne(value);
            } catch (error) {
                throw new Error('Une erreur de lecture en base de données est survenue lors de la validation du champ "Type de site"');
            }

            if (fieldType === null) {
                throw new Error('Le type de site sélectionné n\'existe pas en base de données');
            }

            req.body.field_type_full = fieldType;
            return true;
        }),

    /* **********************************************************************************************
     * Type de propriétaire
     ********************************************************************************************* */
    body('owner_type')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Type de propriétaire" est obligatoire')
        .toInt()
        .isInt().bail().withMessage('Le champ "Type de propriétaire" est invalide')
        .custom(async (value, { req }) => {
            let ownerType;
            try {
                ownerType = await ownerTypeModel.findOne(value);
            } catch (error) {
                throw new Error('Une erreur de lecture en base de données est survenue lors de la validation du champ "Type de propriétaire"');
            }

            if (ownerType === null) {
                throw new Error('Le type de propriétaire sélectionné n\'existe pas en base de données');
            }

            req.body.owner_type_full = ownerType;
            return true;
        }),

    /* **********************************************************************************************
     * Identité du propriétaire
     ********************************************************************************************* */
    body('owner')
        .customSanitizer((value, { req }) => {
            if (!req.user.isAllowedTo('access', 'shantytown_owner')) {
                return null;
            }

            if (!req.body.owner_type_full || req.body.owner_type_full.label === 'Inconnu') {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .if((value, { req }) => req.user.isAllowedTo('access', 'shantytown_owner') && req.body.owner_type_full && req.body.owner_type_full.label !== 'Inconnu')
        .isString().bail().withMessage('Le champ "Identité du propriétaire" est invalide')
        .trim(),

    body('owner')
        .customSanitizer(value => value || null),

    /* **********************************************************************************************
     * Reinstallation
     ********************************************************************************************* */
    body('is_reinstallation')
        .exists({ checkNull: true }).bail().withMessage('Le champ "S\'agit-il d\'une réinstallation ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "S\'agit-il d\'une réinstallation ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    /* **********************************************************************************************
     * Précisions sur la réinstallation
     ********************************************************************************************* */
    body('reinstallation_comments')
        .optional({ nullable: true })
        .isString().bail().withMessage('Le champ "Précisions sur la réinstallation" est invalide')
        .trim(),

    body('reinstallation_comments')
        .customSanitizer(value => value || null),

    /* **********************************************************************************************
     * Sites d'origines de la réinstallation
     * ********************************************************************************************* */
    body('reinstallation_incoming_towns')
        .optional({ nullable: true })
        .isArray().bail().withMessage('Le champ "Sites dont sont originaires les habitant(e)s" est invalide')
        .if(value => value.length > 0)
        .customSanitizer(value => value.map(id => parseInt(id, 10)))
        .custom(async (value, { req }) => {
            try {
                req.body.reinstallation_incoming_towns_full = await shantytownModel.findAll(req.user, [
                    { shantytown_id: value },
                ]);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la validation des sites dont sont originaires les habitant(e)s');
            }

            if (req.body.reinstallation_incoming_towns_full.length !== value.length) {
                throw new Error('Certains des sites sélectionnés comme sites d\'origine des habitants n\'existent pas en base de données');
            }

            return true;
        }),

    body('reinstallation_incoming_towns')
        .custom((value, { req }) => {
            if (!req.body.reinstallation_incoming_towns_full) {
                req.body.reinstallation_incoming_towns_full = [];
            }

            return true;
        }),

    /* **********************************************************************************************
     * Statut du diagnostic social
     ********************************************************************************************* */
    body('census_status')
        .optional({ nullable: true })
        .isIn(['none', 'scheduled', 'done']).withMessage('Le champ "Statut du diagnostic social" est invalide'),

    body('census_status')
        .customSanitizer(value => value || null),

    /* **********************************************************************************************
     * Date du diagnostic
     ********************************************************************************************* */
    body('census_conducted_at')
        .customSanitizer((value, { req }) => {
            if (!['scheduled', 'done'].includes(req.body.census_status)) {
                return null;
            }

            return value;
        })
        .if((value, { req }) => ['scheduled', 'done'].includes(req.body.census_status))
        .exists({ checkNull: true }).bail().withMessage('Le champ "Date du diagnostic" est obligatoire')
        .isDate().bail().withMessage('Le champ "Date du diagnostic" est invalide')
        .toDate()
        .if((value, { req }) => mode !== 'update' || !req.town || value.getTime() / 1000 !== req.town.censusConductedAt)
        .customSanitizer((value) => {
            value.setHours(0, 0, 0, 0);
            return value;
        })
        .custom((value, { req }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (req.body.built_at && value < req.body.built_at) {
                throw new Error('La date du diagnostic ne peut être antérieure à celle d\'installation du site');
            }

            if (req.body.census_status === 'scheduled') {
                if (value < today) {
                    throw new Error('La date d\'un diagnostic prévu ne peut être passée');
                }
            } else if (value > today) {
                throw new Error('La date d\'un diagnostic réalisé ne peut être future');
            }

            return true;
        }),

    /* **********************************************************************************************
     * Service ou opérateur en charge du diagnostic
     ********************************************************************************************* */
    body('census_conducted_by')
        .customSanitizer((value, { req }) => {
            if (!['scheduled', 'done'].includes(req.body.census_status)) {
                return null;
            }

            return value;
        })
        .if((value, { req }) => ['scheduled', 'done'].includes(req.body.census_status))
        .exists({ checkNull: true }).bail().withMessage('Le champ "Service ou opérateur en charge du diagnostic" est obligatoire')
        .isString().bail().withMessage('Le champ "Service ou opérateur en charge du diagnostic" est invalide')
        .trim()
        .notEmpty().withMessage('Le champ "Service ou opérateur en charge du diagnostic" est obligatoire'),

    /* **********************************************************************************************
     * Nombre de personnes
     ********************************************************************************************* */
    body('population_total')
        .optional({ nullable: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de personnes" est invalide')
        .isInt({ min: 1 }).withMessage('Le champ "Nombre de personnes" ne peut pas être inférieur à 1'),

    body('population_total')
        .customSanitizer(validateInteger),

    /* **********************************************************************************************
     * Nombre de caravanes
     ********************************************************************************************* */
    ...validateIntegerWithMinValue('caravans', 0, validateNull, validateInteger),

    /* **********************************************************************************************
     * Nombre de cabanes
     ********************************************************************************************* */
    ...validateIntegerWithMinValue('huts', 0, validateNull, validateInteger),

    /* **********************************************************************************************
     * Nombre de tentes
     ********************************************************************************************* */
    ...validateIntegerWithMinValue('tents', 0, validateNull, validateInteger),

    /* **********************************************************************************************
     * Nombre de voitures dortoir
     ********************************************************************************************* */
    ...validateIntegerWithMinValue('cars', 0, validateNull, validateInteger),

    /* **********************************************************************************************
     * Nombre de matelas
     ********************************************************************************************* */
    ...validateIntegerWithMinValue('mattresses', 0, validateNull, validateInteger),

    /* **********************************************************************************************
     * Nombre de ménages
     ********************************************************************************************* */
    body('population_couples')
        .optional({ nullable: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de ménages" est invalide')
        .isInt({ min: 1 }).withMessage('Le champ "Nombre de ménages" ne peut pas être inférieur à 1')
        .custom((value, { req }) => {
            if (!Number.isInteger(req.body.population_total)) {
                return true;
            }

            if (value > req.body.population_total) {
                throw new Error('Le champ "Nombre de ménages" ne peut pas être supérieur au champ "Nombre de personnes"');
            }

            return true;
        }),

    body('population_couples')
        .customSanitizer(validateInteger),

    /* **********************************************************************************************
     * Nombre de mineurs
     ********************************************************************************************* */
    // Tranches d'âge
    ...[
        { min: 0, max: 3 },
        { min: 3, max: 6 },
        { min: 6, max: 12 },
        { min: 12, max: 16 },
        { min: 16, max: 18 },
    ]
        .reduce((acc, { min, max }) => [
            ...acc,
            body(`population_minors_${min}_${max}`)
                .optional({ nullable: true, checkFalsy: true })
                .trim()
                .toInt()
                .isInt().bail().withMessage(`Le champ "Nombre de mineurs entre ${min} et ${max} ans" est invalide`)
                .isInt({ min: 0 }).withMessage(`Le champ "Nombre de mineurs entre ${min} et ${max} ans" ne peut pas être inférieur à 0`),

            body(`population_minors_${min}_${max}`)
                .customSanitizer(validateInteger),
        ], []),

    // Total
    body('population_minors')
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de mineurs" est invalide')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre de mineurs" ne peut pas être inférieur à 0')
        .custom((value, { req }) => {
            if (Number.isInteger(req.body.population_total) && value > req.body.population_total) {
                throw new Error('Le champ "Nombre de mineurs" ne peut pas être supérieur au champ "Nombre de personnes"');
            }

            const detailedMinorsTotal = ['0_3', '3_6', '6_12', '12_16', '16_18'].reduce((total, ages) => total + (req.body[`population_minors_${ages}`] || 0), 0);
            if (detailedMinorsTotal > value) {
                throw new Error('La somme du nombre de mineurs par tranche d\'âge est supérieure à la valeur du champ "Nombre de mineurs"');
            }

            return true;
        }),

    body('population_minors')
        .customSanitizer(validateInteger),

    /* **********************************************************************************************
     * Nombre d'enfants inscrits dans un établissement scolaire
     ********************************************************************************************* */

    body('minors_in_school')
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre d\'enfants inscrits dans un établissement scolaire" est invalide')
        .isInt({ min: 0 }).withMessage('Le champ "Nombre d\'enfants inscrits dans un établissement scolaire" ne peut pas être inférieur à 0')
        .custom((value, { req }) => {
            if (Number.isInteger(req.body.population_total) && value > req.body.population_total) {
                throw new Error('Le champ "Nombre d\'enfants inscrits dans un établissement scolaire" ne peut pas être supérieur au champ "Nombre de personnes"');
            }

            if (Number.isInteger(req.body.population_minors) && value > req.body.population_minors) {
                throw new Error('Le champ "Nombre d\'enfants inscrits dans un établissement scolaire" ne peut pas être supérieur au champ "Nombre de mineurs"');
            }

            return true;
        }),

    body('minors_in_school')
        .customSanitizer(validateInteger),

    /* **********************************************************************************************
     * Origines
     ********************************************************************************************* */
    body('social_origins')
        .customSanitizer((value) => {
            if (value === undefined || value === null) {
                return [];
            }

            return value;
        })
        .isArray().bail().withMessage('Le champ "Origines" est invalide')
        .custom(async (value, { req }) => {
            let socialOrigins: SocialOrigin[] = [];
            if (value.length > 0) {
                try {
                    socialOrigins = await socialOriginModel.find(value);
                } catch (error) {
                    throw new Error('Une erreur de lecture en base de données est survenue lors de la validation du champ "Origines"');
                }

                if (socialOrigins.length !== value.length) {
                    throw new Error('Certaines origines sélectionnées n\'existent pas en base de données');
                }
            }

            req.body.social_origins_full = socialOrigins;
            return true;
        }),

    /* **********************************************************************************************
     * Dépôt de plainte par le propriétaire
     ********************************************************************************************* */
    body('owner_complaint')
        .customSanitizer((value, { req }) => {
            if (!req.user.isAllowedTo('access', 'shantytown_justice')) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .if((value, { req }) => req.user.isAllowedTo('access', 'shantytown_justice'))
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Dépôt de plainte par le propriétaire" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    /* **********************************************************************************************
     * Existence d'une procédure judiciaire
     ********************************************************************************************* */
    body('justice_procedure')
        .customSanitizer((value, { req }) => {
            if (!req.user.isAllowedTo('access', 'shantytown_justice')) {
                return null;
            }

            return value;
        })
        .if((value, { req }) => req.user.isAllowedTo('access', 'shantytown_justice'))
        .exists({ checkNull: true }).bail().withMessage('Le champ "Existence d\'une procédure judiciaire" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Existence d\'une procédure judiciaire" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    /* **********************************************************************************************
     * Décision de justice rendue
     ********************************************************************************************* */
    body('justice_rendered')
        .customSanitizer((value, { req }) => {
            if (req.body.justice_procedure !== true) {
                return null;
            }

            return value;
        })
        .if((value, { req }) => req.body.justice_procedure === true)
        .exists({ checkNull: true }).bail().withMessage('Le champ "Décision de justice rendue" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Décision de justice rendue" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    /* **********************************************************************************************
     * Origine de la décision
     ********************************************************************************************* */
    body('justice_rendered_by')
        .customSanitizer((value, { req }) => {
            if (req.body.justice_rendered !== true) {
                return null;
            }

            return value;
        })
        .if((value, { req }) => req.body.justice_rendered === true)
        .exists({ checkNull: true }).bail().withMessage('Le champ "Origine de la décision" est obligatoire')
        .isString().bail().withMessage('Le champ "Origine de la décision" est invalide')
        .trim()
        .notEmpty().withMessage('Le champ "Origine de la décision" est obligatoire'),

    /* **********************************************************************************************
     * Date de la décision
     ********************************************************************************************* */
    body('justice_rendered_at')
        .customSanitizer((value, { req }) => {
            if (req.body.justice_rendered !== true) {
                return null;
            }

            return value;
        })
        .if((value, { req }) => req.body.justice_rendered === true)
        .exists({ checkNull: true }).bail().withMessage('Le champ "Date de la décision" est obligatoire')
        .isDate().bail().withMessage('Le champ "Date de la décision" est invalide')
        .toDate()
        .customSanitizer((value) => {
            value.setHours(0, 0, 0, 0);
            return value;
        })
        .custom((value, { req }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (value > today) {
                throw new Error('La date de la décision ne peut être future');
            }

            if (req.body.built_at && value < req.body.built_at) {
                throw new Error('La date de la décision ne peut être antérieure à celle d\'installation');
            }

            return true;
        }),

    /* **********************************************************************************************
     * Contentieux relatif à la décision de justice
     ********************************************************************************************* */
    body('justice_challenged')
        .customSanitizer((value, { req }) => {
            if (req.body.justice_rendered !== true) {
                return null;
            }

            return value;
        })
        .if((value, { req }) => req.body.justice_rendered === true)
        .exists({ checkNull: true }).bail().withMessage('Le champ "Y a-t-il un appel en cours ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Y a-t-il un appel en cours ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    /* **********************************************************************************************
     * Nouveaux champs - procédure administrative
     ********************************************************************************************* */
    // Une procédure administrative prescrivant l'évacuation sous délai est-elle en cours ?
    body('evacuation_under_time_limit').customSanitizer((value, { req }) => {
        if (!req.user.isAllowedTo('access', 'shantytown_justice')) {
            return null;
        }

        return value;
    })
        .optional({ nullable: true })
        .if((value, { req }) => req.user.isAllowedTo('access', 'shantytown_justice'))
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Une procédure administrative prescrivant l\'évacuation sous délai est-elle en cours ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    // Date de l'arrêté prescrivant l'évacuation sous délai
    body('administrative_order_decision_at')
        .optional({ nullable: true })
        .customSanitizer((value, { req }) => {
            if (req.body.evacuation_under_time_limit !== true) {
                return null;
            }

            return value;
        })
        .isDate().bail().withMessage('Le champ "Date de l\'arrêté" est invalide')
        .toDate()
        .customSanitizer((value) => {
            value.setHours(0, 0, 0, 0);
            return value;
        })
        .custom((value, { req }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (value > today) {
                throw new Error('La date de l\'arrêté ne peut être future');
            }

            if (req.body.built_at && value < req.body.built_at) {
                throw new Error('La date de l\'arrêté ne peut être antérieure à celle d\'installation');
            }

            return true;
        }),

    // Auteur de l'arrêté prescrivant l'évacuation sous délai
    body('administrative_order_decision_rendered_by')
        .optional({ nullable: true })
        .customSanitizer((value, { req }) => {
            if (req.body.evacuation_under_time_limit !== true) {
                return null;
            }

            return value;
        })
        .isString().bail().withMessage('Le champ "Qui a pris l\'arrêté ?" est invalide')
        .trim(),

    body('administrative_order_decision_rendered_by')
        .customSanitizer(value => value || null),


    // Date de l'évacuation consécutive à l'arrêté prescrivant l'évacuation sous délai
    body('administrative_order_evacuation_at')
        .optional({ nullable: true })
        .customSanitizer((value, { req }) => {
            if (req.body.evacuation_under_time_limit !== true) {
                return null;
            }

            return value;
        })
        .isDate().bail().withMessage('Le champ "Date de l\'évacuation" est invalide')
        .toDate()
        .customSanitizer((value) => {
            value.setHours(0, 0, 0, 0);
            return value;
        })
        .custom((value, { req }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (value > today) {
                throw new Error(`La date ${value} de l'évacuation ne peut être future (supérieure à ${today})`);
            }

            if (req.body.built_at && value < req.body.built_at) {
                throw new Error('La date de l\'évacuation ne peut être antérieure à celle d\'installation');
            }

            return true;
        }),

    // Arrêté d'insalubrité dans le cadre d'une opération RHI bidonville - Un arrêté d'insalubrité dans le cadre d'une opération RHI bidonville est-il en cours ?
    body('insalubrity_order').customSanitizer((value, { req }) => {
        if (!req.user.isAllowedTo('access', 'shantytown_justice')) {
            return null;
        }

        return value;
    })
        .optional({ nullable: true })
        .if((value, { req }) => req.user.isAllowedTo('access', 'shantytown_justice'))
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Un arrêté d\'insalubrité dans le cadre d\'une opération RHI bidonville est-il en cours ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    // Arrêté d'insalubrité dans le cadre d'une opération RHI bidonville - Affichage de l'arrêté ou notification
    body('insalubrity_order_displayed').customSanitizer((value, { req }) => {
        if (!req.user.isAllowedTo('access', 'shantytown_justice')) {
            return null;
        }

        return value;
    })
        .optional({ nullable: true })
        .customSanitizer((value, { req }) => {
            if (req.body.insalubrity_order !== true) {
                return null;
            }

            return value;
        })
        .if((value, { req }) => req.user.isAllowedTo('access', 'shantytown_justice'))
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Affichage de l\'arrêté ou notification" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    // Arrêté d'insalubrité dans le cadre d'une opération RHI bidonville -  Type d'arrêté (arrêté de mise en sécurité...)
    body('insalubrity_order_type')
        .optional({ nullable: true })
        .customSanitizer((value, { req }) => {
            if (req.body.insalubrity_order !== true) {
                return null;
            }

            return value;
        })
        .isString().withMessage('Le champ "Type d\'arrêté (arrêté de mise en sécurité...)" est invalide')
        .trim(),

    body('insalubrity_order_type')
        .customSanitizer(value => value || null),

    // Arrêté d'insalubrité dans le cadre d'une opération RHI bidonville - Qui a pris l'arrêté ?
    body('insalubrity_order_by')
        .optional({ nullable: true })
        .customSanitizer((value, { req }) => {
            if (req.body.insalubrity_order !== true) {
                return null;
            }

            return value;
        })
        .isString().withMessage('Le champ "Qui a pris l\'arrêté ?" est invalide')
        .trim(),

    body('insalubrity_order_by')
        .customSanitizer(value => value || null),

    // Arrêté d'insalubrité dans le cadre d'une opération RHI bidonville - Date de l'arrêté ?
    body('insalubrity_order_at')
        .optional({ nullable: true })
        .customSanitizer((value, { req }) => {
            if (req.body.insalubrity_order !== true) {
                return null;
            }

            return value;
        })
        .isDate().bail().withMessage('Le champ "Date de l\'arrêté" est invalide')
        .toDate()
        .customSanitizer((value) => {
            value.setHours(0, 0, 0, 0);
            return value;
        })
        .custom((value, { req }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (value > today) {
                throw new Error('La date de l\'arrêté ne peut être future');
            }

            if (req.body.built_at && value < req.body.built_at) {
                throw new Error('La date de l\'arrêté ne peut être antérieure à celle d\'installation');
            }

            return true;
        }),

    // Arrêté d'insalubrité dans le cadre d'une opération RHI bidonville - Parcelles concernées
    body('insalubrity_parcels')
        .optional({ nullable: true })
        .customSanitizer((value, { req }) => {
            if (req.body.insalubrity_order !== true) {
                return null;
            }

            return value;
        })
        .isString().withMessage('Le champ "Parcelles concernées par l\'arrêté" est invalide')
        .trim(),

    body('insalubrity_parcels')
        .customSanitizer(value => value || null),

    /* **********************************************************************************************
     * Concours de la force publique
     ********************************************************************************************* */
    body('police_status')
        .optional({ nullable: true })
        .custom((value, { req }) => {
            if (
                req.body.justice_procedure !== true
                && req.body.evacuation_under_time_limit !== true
                && req.body.insalubrity_order !== true
            ) {
                return value === null;
            }
            return ['none', 'requested', 'granted', 'refused'].includes(value);
        })
        .withMessage('Le champ "Concours de la force publique" est invalide'),

    body('police_status')
        .customSanitizer(value => value || null),

    /* **********************************************************************************************
     * Date de la demande du CFP
     ********************************************************************************************* */
    body('police_requested_at')
        .customSanitizer((value, { req }) => {
            if (!['requested', 'granted', 'refused'].includes(req.body.police_status)) {
                return null;
            }

            return value;
        })
        .if((value, { req }) => ['requested', 'granted', 'refused'].includes(req.body.police_status))
        .exists({ checkNull: true }).bail().withMessage('Le champ "Date de la demande du CFP" est obligatoire')
        .isDate().bail().withMessage('Le champ "Date de la demande du CFP" est invalide')
        .toDate()
        .customSanitizer((value) => {
            value.setHours(0, 0, 0, 0);
            return value;
        })
        .custom((value, { req }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (value > today) {
                throw new Error('La date de la demande du CFP ne peut être future');
            }

            if (req.body.built_at && value < req.body.built_at) {
                throw new Error('La date de la demande du CFP ne peut être antérieure à celle d\'installation');
            }

            return true;
        }),

    /* **********************************************************************************************
     * Date d'octroi du CFP
     ********************************************************************************************* */
    body('police_granted_at')
        .customSanitizer((value, { req }) => {
            if (req.body.police_status !== 'granted') {
                return null;
            }

            return value;
        })
        .if((value, { req }) => req.body.police_status === 'granted')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Date d\'octroi du CFP" est obligatoire')
        .isDate().bail().withMessage('Le champ "Date d\'octroi du CFP" est invalide')
        .toDate()
        .customSanitizer((value) => {
            value.setHours(0, 0, 0, 0);
            return value;
        })
        .custom((value, { req }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (value > today) {
                throw new Error('La date d\'octroi du CFP ne peut être future');
            }

            if (req.body.built_at && value < req.body.built_at) {
                throw new Error('La date d\'octroi du CFP ne peut être antérieure à celle d\'installation');
            }

            if (req.body.police_requested_at && value < req.body.police_requested_at) {
                throw new Error('La date d\'octroi du CFP ne peut être antérieur à la date de demande');
            }

            return true;
        }),

    /* **********************************************************************************************
     * Existence d'un contentieux ?
     ********************************************************************************************* */
    body('existing_litigation')
        .customSanitizer((value, { req }) => {
            if (!req.user.isAllowedTo('access', 'shantytown_justice')) {
                return null;
            }

            return value;
        })
        .custom((value, { req }) => {
            if (req.body.police_status !== 'granted' && value !== -1) {
                throw new Error('Un contentieux ne peut exister que si le recours à la force publique a été accordé');
            }
            return true;
        })
        .customSanitizer((value, { req }) => {
            if (req.body.police_status !== 'granted') {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Existence d\'un contentieux" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    /* **********************************************************************************************
     * Nom de l'étude d'huissiers
     ********************************************************************************************* */
    body('bailiff')
        .optional({ nullable: true })
        .isString().withMessage('Le champ "Nom de l\'étude d\'huissiers" est invalide')
        .trim(),

    body('bailiff')
        .customSanitizer(value => value || null),

    /* *********************************************************************************************
     * Conditions de vie
     ******************************************************************************************** */

    // version
    body('living_conditions_version')
        .custom((value, { req }) => {
            if (mode === 'create' && value !== 2) {
                throw new Error('Vous ne pouvez pas déclarer un site sans les nouvelles conditions de vie');
            } else if (mode === 'update' && value < req.town.livingConditions.version) {
                throw new Error('Les conditions de vie saisies ne sont pas à la bonne version');
            }

            return true;
        }),

    // water
    body('water_access_type')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .exists().bail().withMessage('Le champ "Comment les habitants ont-ils accès à l\'eau ?" est obligatoire')
        .custom((value) => {
            if (![
                'fontaine_publique',
                'borne_incendie',
                'achat_bouteille',
                'reservoir',
                'robinet_connecte_au_reseau',
                'autre',
                'inconnu',
            ].includes(value)) {
                throw new Error('Le type d\'accès à l\'eau sélectionné n\'est pas reconnu');
            }

            return true;
        }),

    body('water_access_type_details')
        .if((value, { req }) => req.body.living_conditions_version === 2 && req.body.water_access_type === 'autre')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Veuillez préciser les modalités d\'accès à l\'eau" est obligatoire')
        .isString().bail().withMessage('Le champ "Veuillez préciser les modalités d\'accès à l\'eau" est invalide')
        .trim()
        .notEmpty().withMessage('Le champ "Veuillez préciser les modalités d\'accès à l\'eau" est obligatoire'),

    body('water_access_type_details')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .customSanitizer((value, { req }) => {
            if (req.body.water_access_type !== 'autre') {
                return null;
            }

            return value;
        }),

    body('water_access_is_public')
        .if((value, { req }) => req.body.living_conditions_version === 2 && ['autre', 'robinet_connecte_au_reseau'].includes(req.body.water_access_type))
        .customSanitizer(value => (value === null || value === undefined ? -1 : value))
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Est-ce un point d\'eau sur la voie publique ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('water_access_is_public')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .customSanitizer((value, { req }) => {
            if (!['robinet_connecte_au_reseau', 'autre'].includes(req.body.water_access_type)) {
                return null;
            }

            return value;
        }),

    body('water_access_is_continuous')
        .if((value, { req }) => req.body.living_conditions_version === 2 && req.body.water_access_is_public === false)
        .customSanitizer(value => (value === null || value === undefined ? -1 : value))
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "L\'accès est-il continu ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('water_access_is_continuous')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .customSanitizer((value, { req }) => {
            if (req.body.water_access_is_public !== false) {
                return null;
            }

            return value;
        }),

    body('water_access_is_continuous_details')
        .if((value, { req }) => req.body.living_conditions_version === 2 && req.body.water_access_is_continuous === false)
        .isString().bail().withMessage('Le champ "Veuillez préciser la discontinuité de l\'accès à l\'eau" est invalide')
        .trim()
        .notEmpty().withMessage('Le champ "Veuillez préciser la discontinuité de l\'accès à l\'eau" est obligatoire'),

    body('water_access_is_continuous_details')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .customSanitizer((value, { req }) => {
            if (req.body.water_access_is_continuous !== false) {
                return null;
            }

            return value;
        }),

    body('water_access_is_local')
        .if((value, { req }) => req.body.living_conditions_version === 2 && req.body.water_access_is_public === false)
        .customSanitizer(value => (value === null || value === undefined ? -1 : value))
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Où se situe l’accès ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('water_access_is_local')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .customSanitizer((value, { req }) => {
            if (req.body.water_access_is_public !== false) {
                return null;
            }

            return value;
        }),

    body('water_access_is_close')
        .if((value, { req }) => req.body.living_conditions_version === 2 && req.body.water_access_is_local === true)
        .customSanitizer(value => (value === null || value === undefined ? -1 : value))
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Distance point d’eau / habitation la plus éloignée ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('water_access_is_close')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .customSanitizer((value, { req }) => {
            if (req.body.water_access_is_local !== true) {
                return null;
            }

            return value;
        }),

    body('water_access_is_unequal')
        .if((value, { req }) => req.body.living_conditions_version === 2 && req.body.water_access_is_local === true)
        .customSanitizer(value => (value === null || value === undefined ? -1 : value))
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Des inégalités d\'accès ont-elles été constatées ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('water_access_is_unequal')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .customSanitizer((value, { req }) => {
            if (req.body.water_access_is_local !== true) {
                return null;
            }

            return value;
        }),

    body('water_access_is_unequal_details')
        .if((value, { req }) => req.body.living_conditions_version === 2 && req.body.water_access_is_unequal === true)
        .isString().bail().withMessage('Le champ "Veuillez préciser l\'inégalité de l\'accès à l\'eau" est invalide')
        .trim()
        .notEmpty().withMessage('Le champ "Veuillez préciser l\'inégalité de l\'accès à l\'eau" est obligatoire'),

    body('water_access_is_unequal_details')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .customSanitizer((value, { req }) => {
            if (req.body.water_access_is_unequal !== true) {
                return null;
            }

            return value;
        }),

    body('water_access_has_stagnant_water')
        .if((value, { req }) => req.body.living_conditions_version === 2 && req.body.water_access_is_local === true)
        .customSanitizer(value => (value === null || value === undefined ? -1 : value))
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Existe-t-il des eaux stagnantes autour du point de distribution ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('water_access_has_stagnant_water')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .customSanitizer((value, { req }) => {
            if (req.body.water_access_is_local !== true) {
                return null;
            }

            return value;
        }),

    body('water_access_comments')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .optional({ nullable: true })
        .isString().bail().withMessage('Le champ "Informations complémentaires concernant l\'accès à l\'eau" est invalide')
        .trim(),

    body('water_access_comments')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .customSanitizer(value => value || null),

    // sanitary
    body('sanitary_open_air_defecation')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .customSanitizer(value => (value === null || value === undefined ? -1 : value))
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Constate-t-on des marques de défécation à l’air libre ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('sanitary_working_toilets')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .exists({ checkNull: true }).bail().withMessage('Le champ "Présence de toilettes fonctionnelles et utilisées ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Présence de toilettes fonctionnelles et utilisées ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('sanitary_toilet_types')
        .if((value, { req }) => req.body.living_conditions_version === 2 && req.body.sanitary_working_toilets === true)
        .customSanitizer(value => (value === undefined || value === null ? [] : value))
        .isArray().bail().withMessage('Le champ "Quels sont les types de toilettes installées ?" est invalide')
        .custom((value) => {
            if (value.some(item => !['latrines', 'toilettes_chimiques', 'toilettes_seches', 'toilettes_a_chasse'].includes(item))) {
                throw new Error('Certains types de toilettes sélectionnés ne sont pas reconnus');
            }

            return true;
        }),

    body('sanitary_toilet_types')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .customSanitizer((value, { req }) => {
            if (req.body.sanitary_working_toilets !== true) {
                return [];
            }

            return value;
        }),

    body('sanitary_toilets_are_inside')
        .if((value, { req }) => req.body.living_conditions_version === 2 && (req.body.sanitary_toilet_types.length > 1 || (req.body.sanitary_toilet_types.length === 1 && !req.body.sanitary_toilet_types.includes('latrines'))))
        .customSanitizer(value => (value === null || value === undefined ? -1 : value))
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Les toilettes sont-elles à l’intérieur du site ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('sanitary_toilets_are_inside')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .customSanitizer((value, { req }) => {
            if (req.body.sanitary_toilet_types.length === 0 || (req.body.sanitary_toilet_types.length === 1 && req.body.sanitary_toilet_types.includes('latrines'))) {
                return null;
            }

            return value;
        }),

    body('sanitary_toilets_are_lighted')
        .if((value, { req }) => req.body.living_conditions_version === 2 && (req.body.sanitary_toilet_types.length > 1 || (req.body.sanitary_toilet_types.length === 1 && !req.body.sanitary_toilet_types.includes('latrines'))))
        .customSanitizer(value => (value === null || value === undefined ? -1 : value))
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Ces toilettes sont-elles éclairées et verrouillables de l’intérieur ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('sanitary_toilets_are_lighted')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .customSanitizer((value, { req }) => {
            if (req.body.sanitary_toilet_types.length === 0 || (req.body.sanitary_toilet_types.length === 1 && req.body.sanitary_toilet_types.includes('latrines'))) {
                return null;
            }

            return value;
        }),

    body('sanitary_hand_washing')
        .if((value, { req }) => req.body.living_conditions_version === 2 && (req.body.sanitary_toilet_types.length > 1 || (req.body.sanitary_toilet_types.length === 1 && !req.body.sanitary_toilet_types.includes('latrines'))))
        .customSanitizer(value => (value === null || value === undefined ? -1 : value))
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Y a-t-il un point de lavage des mains à proximité des toilettes ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('sanitary_hand_washing')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .customSanitizer((value, { req }) => {
            if (req.body.sanitary_toilet_types.length === 0 || (req.body.sanitary_toilet_types.length === 1 && req.body.sanitary_toilet_types.includes('latrines'))) {
                return null;
            }

            return value;
        }),

    // electricity
    body('electricity_access')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .exists({ checkNull: true }).bail().withMessage('Le champ "Y a-t-il présence d’une installation électrique ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Y a-t-il présence d’une installation électrique ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('electricity_access_types')
        .if((value, { req }) => req.body.living_conditions_version === 2 && req.body.electricity_access === true)
        .customSanitizer(value => (value === undefined || value === null ? [] : value))
        .isArray().bail().withMessage('Le champ "Quelle est la source de l’accès à l\'électricité ?" est invalide')
        .custom((value) => {
            if (value.some(item => !['electrogene', 'reseau_urbain', 'installation_du_bati'].includes(item))) {
                throw new Error('Certaines sources d\'accès sélectionnées ne sont pas reconnues');
            }

            return true;
        }),

    body('electricity_access_types')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .customSanitizer((value, { req }) => {
            if (req.body.electricity_access !== true) {
                return [];
            }

            return value;
        }),

    body('electricity_access_is_unequal')
        .if((value, { req }) => req.body.living_conditions_version === 2 && req.body.electricity_access_types.length > 0)
        .customSanitizer(value => (value === null || value === undefined ? -1 : value))
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Des inégalités d’accès ont-elles été constatées ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('electricity_access_is_unequal')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .customSanitizer((value, { req }) => {
            if (req.body.electricity_access_types.length === 0) {
                return null;
            }

            return value;
        }),

    // trash
    body('trash_is_piling')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .exists({ checkNull: true }).bail().withMessage('Le champ "Constate-t-on une accumulation de déchets type ordures ménagères ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Constate-t-on une accumulation de déchets type ordures ménagères ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('trash_evacuation_is_close')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .exists({ checkNull: true }).bail().withMessage('Le champ "Y a-t-il des dispositifs de ramassage des ordures ménagères ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Y a-t-il des dispositifs de ramassage des ordures ménagères ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('trash_evacuation_is_safe')
        .if((value, { req }) => req.body.living_conditions_version === 2 && req.body.trash_evacuation_is_close === true)
        .customSanitizer(value => (value === null || value === undefined ? -1 : value))
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Les dispositifs de ramassage des ordures ménagères sont-ils en bon état ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('trash_evacuation_is_safe')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .customSanitizer((value, { req }) => {
            if (req.body.trash_evacuation_is_close !== true) {
                return null;
            }

            return value;
        }),

    body('trash_evacuation_is_regular')
        .if((value, { req }) => req.body.living_conditions_version === 2 && req.body.trash_evacuation_is_close === true)
        .customSanitizer(value => (value === null || value === undefined ? -1 : value))
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "La collecte des poubelles est-elle réalisée de manière régulière ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('trash_evacuation_is_regular')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .customSanitizer((value, { req }) => {
            if (req.body.trash_evacuation_is_close !== true) {
                return null;
            }

            return value;
        }),

    body('trash_bulky_is_piling')
        .if((value, { req }) => req.body.living_conditions_version === 2 && req.body.trash_evacuation_is_close === true)
        .customSanitizer(value => (value === null || value === undefined ? -1 : value))
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Constate-t-on une accumulation de déchets type encombrants ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('trash_bulky_is_piling')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .customSanitizer((value, { req }) => {
            if (req.body.trash_evacuation_is_close !== true) {
                return null;
            }

            return value;
        }),

    // pest animals
    body('pest_animals_presence')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .exists({ checkNull: true }).bail().withMessage('Le champ "Y a-t-il des nuisibles sur le site ou à proximité ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Y a-t-il des nuisibles sur le site ou à proximité ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    body('pest_animals_details')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .optional({ nullable: true })
        .isString().bail().withMessage('Le champ "Informations complémentaires concernant la présence de nuisibles" est invalide')
        .trim(),

    body('pest_animals_details')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .customSanitizer(value => value || null),

    // fire prevention
    body('fire_prevention_diagnostic')
        .if((value, { req }) => req.body.living_conditions_version === 2)
        .exists({ checkNull: true }).bail().withMessage('Le champ "Un diagnostic prévention incendie a-t-il été réalisé ?" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Un diagnostic prévention incendie a-t-il été réalisé ?" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    /* **********************************************************************************************
     * Phases transitoires vers la résorption
     ********************************************************************************************* */
    body('preparatory_phases_toward_resorption')
        .customSanitizer((value) => {
            if (value === undefined || value === null) {
                return [];
            }

            return value;
        })
        .isArray().bail().withMessage('Le champ "Phases transitoires vers la résorption" est invalide')
        .custom(async (value) => {
            // On vérifie si les uid des phases transiqstoires existent en base de données dans les types de phases
            let preparatoryPhasesTowrdResorption: PreparatoryPhaseTowardResorption[] = [];
            if (value.length > 0) {
                try {
                    preparatoryPhasesTowrdResorption = await preparatoryPhasesTowardResorptionModel.getSome(value);
                } catch (error) {
                    throw new Error('Une erreur de lecture en base de données est survenue lors de la validation du champ "Phases transitoires vers la résorption"');
                }

                if (preparatoryPhasesTowrdResorption.length !== value.length) {
                    throw new Error('Certaines phases transitoires vers la résorption sélectionnées n\'existent pas en base de données');
                }
            }

            return true;
        }),
    body('active_preparatory_phases_toward_resorption')
        .customSanitizer((value) => {
            if (value === undefined || value === null) {
                return [];
            }

            return value;
        })
        .isArray().bail().withMessage('La valeur des "Phases préparatoires à la résorption" est invalide')
        .custom(async (value, { req }) => {
            req.body.active_preparatory_phases_toward_resorption = value;
            return true;
        }),
]);
