const shantytownModel = require('#server/models/shantytownModel');
const socialOriginModel = require('#server/models/socialOriginModel');
const config = require('#server/config');
const mattermostUtils = require('#server/utils/mattermost');
const userModel = require('#server/models/userModel');
const mails = require('#server/mails/mails');

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
        electricityType: townData.electricity_type,
        electricityComments: townData.electricity_comments,
        accessToSanitary: townData.access_to_sanitary,
        sanitaryComments: townData.sanitary_comments,
        accessToWater: townData.access_to_water,
        waterComments: townData.water_comments,
        trashEvacuation: townData.trash_evacuation,
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
        // New fields
        // Water
        waterPotable: townData.water_potable,
        waterContinuousAccess: townData.water_continuous_access,
        waterPublicPoint: townData.water_public_point,
        waterDistance: townData.water_distance,
        waterRoadsToCross: townData.water_roads_to_cross,
        waterEveryoneHasAccess: townData.water_everyone_has_access,
        waterStagnantWater: townData.water_stagnant_water,
        waterHandWashAccess: townData.water_hand_wash_access,
        waterHandWashAccessNumber: townData.water_hand_wash_access_number,
        // Sanitary
        sanitaryNumber: townData.sanitary_number,
        sanitaryInsalubrious: townData.sanitary_insalubrious,
        sanitaryOnSite: townData.sanitary_on_site,
        // Trash
        trashCansOnSite: townData.trash_cans_on_site,
        trashAccumulation: townData.trash_accumulation,
        trashEvacuationRegular: townData.trash_evacuation_regular,
        // Vermin
        vermin: townData.vermin,
        verminComments: townData.vermin_comments,
        // Fire prevention
        firePreventionMeasures: townData.fire_prevention_measures,
        firePreventionDiagnostic: townData.fire_prevention_diagnostic,
        firePreventionSiteAccessible: townData.fire_prevention_site_accessible,
        firePreventionDevices: townData.fire_prevention_devices,
        firePreventionComments: townData.fire_prevention_comments,
    };

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
    );

    if (townData.social_origins.length > 0) {
        await socialOriginModel.create(shantytown_id, townData.social_origins);
    }


    const town = await shantytownModel.findOne(user, shantytown_id);

    // Send a Mattermost alert, if it fails, do nothing
    try {
        if (config.mattermost) {
            await mattermostUtils.triggerShantytownCreationAlert(town, user);
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`Error with shantytown creation Mattermost webhook : ${err.message}`);
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
