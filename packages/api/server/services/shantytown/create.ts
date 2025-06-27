import { sequelize } from '#db/sequelize';
import createShantytown from '#server/models/shantytownModel/create';
import findOneShantytown from '#server/models/shantytownModel/findOne';
import insertSocialOrigin from '#server/models/socialOriginModel/create';
import insertToiletType from '#server/models/shantytownToiletTypesModel/create';
import insertElectricityAccessType from '#server/models/electricityAccessTypesModel/create';
import insertIncomingTown from '#server/models/incomingTownsModel/create';
import getLocationWatchers from '#server/models/userModel/getLocationWatchers';
import { triggerShantytownCreationAlert } from '#server/utils/mattermost';
import mails from '#server/mails/mails';

export default async (townData, user) => {
    const baseTown = {
        name: townData.name,
        latitude: townData.latitude,
        longitude: townData.longitude,
        address: townData.address,
        addressDetails: townData.detailed_address,
        builtAt: townData.built_at,
        populationTotal: townData.population_total,
        populationTotalFemales: townData.population_total_females,
        populationCouples: townData.population_couples,
        populationMinors: townData.population_minors,
        populationMinorsGirls: townData.population_minors_girls,
        populationMinors0To3: townData.population_minors_0_3,
        populationMinors3To6: townData.population_minors_3_6,
        populationMinors6To12: townData.population_minors_6_12,
        populationMinors12To16: townData.population_minors_12_16,
        populationMinors16To18: townData.population_minors_16_18,
        minorsInSchool: townData.minors_in_school,
        caravans: townData.caravans,
        huts: townData.huts,
        tents: townData.tents,
        cars: townData.cars,
        mattresses: townData.mattresses,
        fieldType: townData.field_type,
        ownerType: townData.owner_type,
        isReinstallation: townData.is_reinstallation,
        reinstallationComments: townData.reinstallation_comments,
        city: townData.citycode,
        createdBy: user.id,
        declaredAt: townData.declared_at,
        censusStatus: townData.census_status,
        censusConductedAt: townData.census_conducted_at,
        censusConductedBy: townData.census_conducted_by,

        // living conditions
        living_conditions_version: 2,

        water_access_type: townData.water_access_type,
        water_access_type_details: townData.water_access_type_details,
        water_access_is_public: townData.water_access_is_public,
        water_access_is_continuous: townData.water_access_is_continuous,
        water_access_is_continuous_details: townData.water_access_is_continuous_details,
        water_access_is_local: townData.water_access_is_local,
        water_access_is_close: townData.water_access_is_close,
        water_access_is_unequal: townData.water_access_is_unequal,
        water_access_is_unequal_details: townData.water_access_is_unequal_details,
        water_access_has_stagnant_water: townData.water_access_has_stagnant_water,
        water_access_comments: townData.water_access_comments,

        sanitary_open_air_defecation: townData.sanitary_open_air_defecation,
        sanitary_access_working_toilets: townData.sanitary_working_toilets,
        sanitary_access_toilets_are_inside: townData.sanitary_toilets_are_inside,
        sanitary_access_toilets_are_lighted: townData.sanitary_toilets_are_lighted,
        sanitary_access_hand_washing: townData.sanitary_hand_washing,

        electricity_access: townData.electricity_access,
        electricity_access_is_unequal: townData.electricity_access_is_unequal,

        trash_is_piling: townData.trash_is_piling,
        trash_evacuation_is_close: townData.trash_evacuation_is_close,
        trash_evacuation_is_safe: townData.trash_evacuation_is_safe,
        trash_evacuation_is_regular: townData.trash_evacuation_is_regular,
        trash_bulky_is_piling: townData.trash_bulky_is_piling,

        pest_animals: townData.pest_animals_presence,
        pest_animals_details: townData.pest_animals_details,

        fire_prevention: townData.fire_prevention_diagnostic,
    };

    const transaction = await sequelize.transaction();
    let shantytown_id;
    try {
        shantytown_id = await createShantytown(
            Object.assign(
                {},
                baseTown,
                user.isAllowedTo('access', 'shantytown_justice')
                    ? {
                        ownerComplaint: townData.owner_complaint,
                        justiceProcedure: townData.justice_procedure,
                        justiceRendered: townData.justice_rendered,
                        justiceRenderedBy: townData.justice_rendered_by,
                        justiceRenderedAt: townData.justice_rendered_at,
                        justiceChallenged: townData.justice_challenged,
                        policeStatus: townData.police_status,
                        policeRequestedAt: townData.police_requested_at,
                        policeGrantedAt: townData.police_granted_at,
                        bailiff: townData.bailiff,
                    }
                    : {},
                user.isAllowedTo('access', 'shantytown_owner')
                    ? {
                        owner: townData.owner,
                    }
                    : {},
            ),
            transaction,
        );

        const promises = [];
        if (townData.social_origins.length > 0) {
            promises.push(insertSocialOrigin(shantytown_id, townData.social_origins, transaction));
        }

        if (townData.sanitary_toilet_types.length > 0) {
            promises.push(insertToiletType(
                shantytown_id,
                townData.sanitary_toilet_types,
                transaction,
            ));
        }

        if (townData.electricity_access_types.length > 0) {
            promises.push(insertElectricityAccessType(
                shantytown_id,
                townData.electricity_access_types,
                transaction,
            ));
        }

        if (townData.reinstallation_incoming_towns_full.length > 0) {
            promises.push(insertIncomingTown(
                shantytown_id,
                townData.reinstallation_incoming_towns_full.map(({ id }) => id),
                transaction,
            ));
        }

        await Promise.all(promises);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }

    const town = await findOneShantytown(user, shantytown_id);

    // Send a Mattermost alert, if it fails, do nothing
    try {
        await triggerShantytownCreationAlert(town, user);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`Error with shantytown creation Mattermost webhook : ${err.message}`);
    }

    // Send a notification to all users of the related departement
    try {
        const watchers = await getLocationWatchers(townData.city, 'shantytown_creation');
        watchers
            .filter(({ user_id }: any) => user_id !== user.id) // do not send an email to the user who created the town
            .forEach((watcher) => {
                mails.sendUserShantytownDeclared(watcher, {
                    variables: {
                        departement: townData.city.departement,
                        shantytown: town,
                        creator: user,
                    },
                    preserveRecipient: false,
                });
            });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }

    return town;
};
