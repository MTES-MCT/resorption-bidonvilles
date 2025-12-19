/* eslint-disable no-restricted-syntax */
import { sequelize } from '#db/sequelize';
import shantytownResorptionService from '#server/services/shantytownResorption';
import shantytownModel from '#server/models/shantytownModel';
import attachmentService from '#server/services/attachment';
import shantytownParcelOwnerService from '#server/services/shantytownParcelOwner';
import ServiceError from '#server/errors/ServiceError';
import { triggerReinstallationAlert } from '#server/utils/mattermost';
import find from './find';
import { Shantytown } from '#root/types/resources/Shantytown.d';

type DecreeAttachments = {
    filesDatas: {
        [key: string]: {
            name: string,
            type: string,
            size: number,
        },
    },
    files: Express.Multer.File[],
};

export default async (shantytown, user, decreeAttachments: DecreeAttachments): Promise<Shantytown> => {
    // Récupérer le site avant modification pour comparer les changements
    const originalShantytown = await find(user, shantytown.id);
    if (!originalShantytown) {
        throw new ServiceError('fetch_failed', new Error('Impossible de retrouver le site en base de données'));
    }

    const transaction = await sequelize.transaction();

    try {
        await shantytownModel.update(
            user,
            shantytown.id,
            {
                updated_without_any_change: shantytown.updated_without_any_change,
                name: shantytown.name,
                latitude: shantytown.latitude,
                longitude: shantytown.longitude,
                address: shantytown.address,
                address_details: shantytown.detailed_address,
                updated_at: shantytown.updated_at ?? new Date(),
                built_at: shantytown.built_at ?? null,
                is_reinstallation: shantytown.is_reinstallation,
                reinstallation_comments: shantytown.reinstallation_comments,
                reinstallation_incoming_towns: shantytown.reinstallation_incoming_towns_full.map(({ id }) => id),
                social_origins: shantytown.social_origins,
                population_total: shantytown.population_total,
                population_total_females: shantytown.population_total_females,
                population_couples: shantytown.population_couples,
                population_minors: shantytown.population_minors,
                population_minors_girls: shantytown.population_minors_girls,
                population_minors_0_3: shantytown.population_minors_0_3,
                population_minors_3_6: shantytown.population_minors_3_6,
                population_minors_6_12: shantytown.population_minors_6_12,
                population_minors_12_16: shantytown.population_minors_12_16,
                population_minors_16_18: shantytown.population_minors_16_18,
                minors_in_school: shantytown.minors_in_school,
                caravans: shantytown.caravans,
                huts: shantytown.huts,
                tents: shantytown.tents,
                cars: shantytown.cars,
                mattresses: shantytown.mattresses,
                fk_field_type: shantytown.field_type,
                fk_city: shantytown.citycode,
                declared_at: shantytown.declared_at,
                census_status: shantytown.census_status,
                census_conducted_at: shantytown.census_conducted_at,
                census_conducted_by: shantytown.census_conducted_by,
                owner_complaint: shantytown.owner_complaint,
                justice_procedure: shantytown.justice_procedure,
                justice_rendered: shantytown.justice_rendered,
                justice_rendered_at: shantytown.justice_rendered_at,
                justice_rendered_by: shantytown.justice_rendered_by,
                justice_challenged: shantytown.justice_challenged,
                police_status: shantytown.police_status,
                police_requested_at: shantytown.police_requested_at,
                police_granted_at: shantytown.police_granted_at,
                bailiff: shantytown.bailiff,

                // Nouveaux champs procédure administrative
                existing_litigation: shantytown.existing_litigation,
                evacuation_under_time_limit: shantytown.evacuation_under_time_limit,
                administrative_order_decision_at: shantytown.administrative_order_decision_at ?? null,
                administrative_order_decision_rendered_by: shantytown.administrative_order_decision_rendered_by,
                administrative_order_evacuation_at: shantytown.administrative_order_evacuation_at ?? null,
                insalubrity_order: shantytown.insalubrity_order,
                insalubrity_order_displayed: shantytown.insalubrity_order_displayed,
                insalubrity_order_type: shantytown.insalubrity_order_type ?? null,
                insalubrity_order_by: shantytown.insalubrity_order_by ?? null,
                insalubrity_order_at: shantytown.insalubrity_order_at ?? null,
                insalubrity_parcels: shantytown.insalubrity_parcels ?? null,
                // insalubrity_attachment: shantytown.insalubrity_attachment || null,
                // Fin nouveaux champs procédure administrative

                // si les conditions de vie sont en V2 on reset les anciennes et on engistre les
                // nouvelles
                // sinon, on garder les anciennes conditions de vie et on ne touche à rien
                ...(shantytown.living_conditions_version === 2 ? {
                    // anciennes conditions
                    fk_electricity_type: null,
                    electricity_comments: null,
                    access_to_sanitary: null,
                    sanitary_comments: null,
                    sanitary_number: null,
                    sanitary_insalubrious: null,
                    sanitary_on_site: null,
                    access_to_water: null,
                    water_comments: null,
                    water_potable: null,
                    water_continuous_access: null,
                    water_public_point: null,
                    water_distance: null,
                    water_roads_to_cross: null,
                    water_everyone_has_access: null,
                    water_stagnant_water: null,
                    water_hand_wash_access: null,
                    water_hand_wash_access_number: null,
                    trash_evacuation: null,
                    trash_cans_on_site: null,
                    trash_accumulation: null,
                    trash_evacuation_regular: null,
                    vermin: null,
                    vermin_comments: null,
                    fire_prevention_measures: null,
                    fire_prevention_diagnostic: null,
                    fire_prevention_site_accessible: null,
                    fire_prevention_devices: null,
                    fire_prevention_comments: null,

                    // nouvelles conditions
                    living_conditions_version: 2,

                    water_access_type: shantytown.water_access_type,
                    water_access_type_details: shantytown.water_access_type_details,
                    water_access_is_public: shantytown.water_access_is_public,
                    water_access_is_continuous: shantytown.water_access_is_continuous,
                    water_access_is_continuous_details: shantytown.water_access_is_continuous_details,
                    water_access_is_local: shantytown.water_access_is_local,
                    water_access_is_close: shantytown.water_access_is_close,
                    water_access_is_unequal: shantytown.water_access_is_unequal,
                    water_access_is_unequal_details: shantytown.water_access_is_unequal_details,
                    water_access_has_stagnant_water: shantytown.water_access_has_stagnant_water,
                    water_access_comments: shantytown.water_access_comments,

                    sanitary_access_open_air_defecation: shantytown.sanitary_open_air_defecation,
                    sanitary_access_working_toilets: shantytown.sanitary_working_toilets,
                    sanitary_access_toilets_are_inside: shantytown.sanitary_toilets_are_inside,
                    sanitary_access_toilets_are_lighted: shantytown.sanitary_toilets_are_lighted,
                    sanitary_access_hand_washing: shantytown.sanitary_hand_washing,
                    sanitary_toilet_types: shantytown.sanitary_toilet_types,

                    electricity_access: shantytown.electricity_access,
                    electricity_access_types: shantytown.electricity_access_types,
                    electricity_access_is_unequal: shantytown.electricity_access_is_unequal,

                    trash_is_piling: shantytown.trash_is_piling,
                    trash_evacuation_is_close: shantytown.trash_evacuation_is_close,
                    trash_evacuation_is_safe: shantytown.trash_evacuation_is_safe,
                    trash_evacuation_is_regular: shantytown.trash_evacuation_is_regular,
                    trash_bulky_is_piling: shantytown.trash_bulky_is_piling,

                    pest_animals: shantytown.pest_animals_presence,
                    pest_animals_details: shantytown.pest_animals_details,

                    fire_prevention: shantytown.fire_prevention_diagnostic,
                } : {}),
            },
            transaction,
        );
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('insert_failed', error);
    }

    // on tente d'enregistrer les fichiers joints
    if (decreeAttachments.files?.length > 0) {
        try {
            await attachmentService.upload(
                'shantytown_decree',
                shantytown.id,
                user.id,
                decreeAttachments.files,
                transaction,
                shantytown.attachments,
            );
        } catch (error) {
            await transaction.rollback();
            throw new ServiceError('upload_failed', error);
        }
    }

    // On met à jour les propriétaires de parcelles liés au site
    if (shantytown.owners?.length > 0) {
        try {
            if (user.isAllowedTo('access', 'shantytown_owner')) {
                await shantytownParcelOwnerService.update(
                    user,
                    shantytown,
                    shantytown.owners,
                    transaction,
                );
            }
        } catch (error) {
            await transaction.rollback();
            throw new ServiceError('parcel_owner_update_failed', error);
        }
    }

    // on tente d'enregistrer les phases transitoires vers la résorption APRÈS l'historisation
    if (shantytown.preparatory_phases_toward_resorption?.length > 0) {
        try {
            if (user.isAllowedTo('update', 'shantytown')) {
                await shantytownResorptionService.update(
                    shantytown.id,
                    shantytown.preparatory_phases_toward_resorption,
                    shantytown.terminated_preparatory_phases_toward_resorption,
                    user,
                    transaction,
                );

                // Créer un second hid pour capturer l'état avec les phases
                // Cela permet d'avoir un hid avec les bonnes métadonnées (user, date)
                await shantytownModel.update(
                    user,
                    shantytown.id,
                    {
                        updated_at: new Date(),
                    },
                    transaction,
                );
            }
        } catch (error) {
            await transaction.rollback();
            throw new ServiceError('update_failed', error);
        }
    }

    // on finalise
    try {
        await transaction.commit();
    } catch (commitError) {
        await transaction.rollback();
        throw new ServiceError('commit_failed', commitError);
    }

    let updatedShantytown: Shantytown = null;

    // on retourne la liste mise à jour des commentaires du site
    try {
        updatedShantytown = await find(user, shantytown.id);

        if (!updatedShantytown) {
            throw new ServiceError('fetch_failed', new Error('Impossible de retrouver les commentaires en base de données'));
        }
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    // Envoie une notification Mattermost seulement si l'une des informlations liées à la réinstallation change
    const reinstallationChanged = originalShantytown.isReinstallation !== updatedShantytown.isReinstallation
        || originalShantytown.reinstallationComments !== updatedShantytown.reinstallationComments
        || JSON.stringify(originalShantytown.reinstallationIncomingTowns.map(t => t.id))
        !== JSON.stringify(updatedShantytown.reinstallationIncomingTowns.map(t => t.id));

    if (updatedShantytown.isReinstallation === true && reinstallationChanged) {
        try {
            await triggerReinstallationAlert(updatedShantytown, user);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`Error with reinstallation Mattermost webhook : ${err.message}`);
        }
    }

    return updatedShantytown;
};
