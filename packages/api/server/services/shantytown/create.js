const sequelize = require('#db/sequelize');
const shantytownModel = require('#server/models/shantytownModel');
const socialOriginModel = require('#server/models/socialOriginModel');
const shantytownToiletTypesModel = require('#server/models/shantytownToiletTypesModel');
const electricityAccessTypesModel = require('#server/models/electricityAccessTypesModel');
const config = require('#server/config');
const mattermostUtils = require('#server/utils/mattermost');
const userModel = require('#server/models/userModel');
const mails = require('#server/mails/mails');

function generateReinstallationComment(originalComment, shantytowns) {
    let finalComment = (originalComment)
        ? `${originalComment}
Liste des sites fermés dans le département:`
        : `
Liste des sites fermés dans le département:
`;

    finalComment
        += shantytowns.map(town => `- ${town.name ? town.name : ''} ${town.address} fermé le ${town.closedAt}.`).join('\n');
    return finalComment;
}

module.exports = async (townData, user) => {
    const baseTown = {
        name: townData.name,
        latitude: townData.latitude,
        longitude: townData.longitude,
        address: townData.address,
        addressDetails: townData.detailed_address,
        builtAt: townData.built_at,
        populationTotal: townData.population_total,
        populationCouples: townData.population_couples,
        populationMinors: townData.population_minors,
        populationMinors0To3: townData.population_minors_0_3,
        populationMinors3To6: townData.population_minors_3_6,
        populationMinors6To12: townData.population_minors_6_12,
        populationMinors12To16: townData.population_minors_12_16,
        populationMinors16To18: townData.population_minors_16_18,
        minorsInSchool: townData.minors_in_school,
        caravans: townData.caravans,
        huts: townData.huts,
        fieldType: townData.field_type,
        ownerType: townData.owner_type,
        isReinstallation: townData.is_reinstallation,
        reinstallationComments: townData.reinstallation_comments,
        reinstallationShantytowns: townData.reinstallation_shantytowns_full,
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

    if (townData.reinstallation_shantytowns_full.length > 0) {
        baseTown.reinstallationComments = generateReinstallationComment(baseTown.reinstallationComments, townData.reinstallation_shantytowns_full);
    }

    const transaction = await sequelize.transaction();

    const shantytown_id = await shantytownModel.create(
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
        promises.push(socialOriginModel.create(shantytown_id, townData.social_origins, transaction));
    }

    if (townData.sanitary_toilet_types.length > 0) {
        promises.push(shantytownToiletTypesModel.create(
            shantytown_id,
            townData.sanitary_toilet_types,
            transaction,
        ));
    }

    if (townData.electricity_access_types.length > 0) {
        promises.push(electricityAccessTypesModel.create(
            shantytown_id,
            townData.electricity_access_types,
            transaction,
        ));
    }

    await Promise.all(promises);
    await transaction.commit();

    const town = await shantytownModel.findOne(user, shantytown_id);

    // Send a Mattermost alert, if it fails, do nothing
    try {
        if (config.mattermost) {
            const promises = [mattermostUtils.triggerShantytownCreationAlert(town, user)];
            if (baseTown.reinstallationComments && baseTown.reinstallationComments.length > 0) {
                promises.push(mattermostUtils.triggerReinstallation(town, baseTown.reinstallationShantytowns));
            }
            await Promise.all(promises);
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`Error with shantytown creation Mattermost webhooks : ${err.message}`);
    }

    // Send a notification to all users of the related departement
    try {
        const watchers = await userModel.getLocationWatchers(townData.city, 'shantytown_creation', true);
        watchers
            .filter(({ user_id }) => user_id !== user.id) // do not send an email to the user who created the town
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
        // ignore
    }

    return town;
};
