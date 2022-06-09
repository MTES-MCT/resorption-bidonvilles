const shantytownModel = require('#server/models/shantytownModel');

module.exports = async (req, res, next) => {
    let town;
    try {
        town = await shantytownModel.findOne(req.user, req.params.id);
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur de lecture en base de données est survenue',
        });
        return next(error);
    }

    if (town === null) {
        return res.status(404).send({
            user_message: `Le site d'identifiant ${req.params.id} n'existe pas : mise à jour impossible`,
        });
    }
    try {
        await shantytownModel.update(
            req.user,
            req.params.id,
            {
                name: req.body.name,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                address: req.body.address,
                address_details: req.body.detailed_address,
                built_at: req.body.built_at || null,
                is_reinstallation: req.body.is_reinstallation,
                reinstallation_comments: req.body.reinstallation_comments,
                social_origins: req.body.social_origins,
                population_total: req.body.population_total,
                population_couples: req.body.population_couples,
                population_minors: req.body.population_minors,
                population_minors_0_3: req.body.population_minors_0_3,
                population_minors_3_6: req.body.population_minors_3_6,
                population_minors_6_12: req.body.population_minors_6_12,
                population_minors_12_16: req.body.population_minors_12_16,
                population_minors_16_18: req.body.population_minors_16_18,
                minors_in_school: req.body.minors_in_school,
                caravans: req.body.caravans,
                huts: req.body.huts,
                fk_field_type: req.body.field_type,
                fk_owner_type: req.body.owner_type,
                fk_city: req.body.citycode,
                owner: req.body.owner,
                declared_at: req.body.declared_at,
                census_status: req.body.census_status,
                census_conducted_at: req.body.census_conducted_at,
                census_conducted_by: req.body.census_conducted_by,
                owner_complaint: req.body.owner_complaint,
                justice_procedure: req.body.justice_procedure,
                justice_rendered: req.body.justice_rendered,
                justice_rendered_at: req.body.justice_rendered_at,
                justice_rendered_by: req.body.justice_rendered_by,
                justice_challenged: req.body.justice_challenged,
                police_status: req.body.police_status,
                police_requested_at: req.body.police_requested_at,
                police_granted_at: req.body.police_granted_at,
                bailiff: req.body.bailiff,

                // reset old living conditions fields
                fk_electricity_type: null,
                electricity_comments: null,
                access_to_sanitary: null,
                // Sanitary
                sanitary_comments: null,
                sanitary_number: null,
                sanitary_insalubrious: null,
                sanitary_on_site: null,
                // Water
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
                // Trash
                trash_evacuation: null,
                trash_cans_on_site: null,
                trash_accumulation: null,
                trash_evacuation_regular: null,
                // Vermin
                vermin: null,
                vermin_comments: null,
                // Fire prevention
                fire_prevention_measures: null,
                fire_prevention_diagnostic: null,
                fire_prevention_site_accessible: null,
                fire_prevention_devices: null,
                fire_prevention_comments: null,

                // tous les sites modifiés passent nécessairement en v2
                living_conditions_version: 2,

                water_access_type: req.body.water_access_type,
                water_access_type_details: req.body.water_access_type_details,
                water_access_is_public: req.body.water_access_is_public,
                water_access_is_continuous: req.body.water_access_is_continuous,
                water_access_is_continuous_details: req.body.water_access_is_continuous_details,
                water_access_is_local: req.body.water_access_is_local,
                water_access_is_close: req.body.water_access_is_close,
                water_access_is_unequal: req.body.water_access_is_unequal,
                water_access_is_unequal_details: req.body.water_access_is_unequal_details,
                water_access_has_stagnant_water: req.body.water_access_has_stagnant_water,
                water_access_comments: req.body.water_access_comments,

                sanitary_access_open_air_defecation: req.body.sanitary_open_air_defecation,
                sanitary_access_working_toilets: req.body.sanitary_working_toilets,
                sanitary_access_toilets_are_inside: req.body.sanitary_toilets_are_inside,
                sanitary_access_toilets_are_lighted: req.body.sanitary_toilets_are_lighted,
                sanitary_access_hand_washing: req.body.sanitary_hand_washing,
                sanitary_toilet_types: req.body.sanitary_toilet_types,

                electricity_access: req.body.electricity_access,
                electricity_access_types: req.body.electricity_access_types,
                electricity_access_is_unequal: req.body.electricity_access_is_unequal,

                trash_is_piling: req.body.trash_is_piling,
                trash_evacuation_is_close: req.body.trash_evacuation_is_close,
                trash_evacuation_is_safe: req.body.trash_evacuation_is_safe,
                trash_evacuation_is_regular: req.body.trash_evacuation_is_regular,
                trash_bulky_is_piling: req.body.trash_bulky_is_piling,

                pest_animals: req.body.pest_animals_presence,
                pest_animals_details: req.body.pest_animals_details,

                fire_prevention: req.body.fire_prevention_diagnostic,
            },
        );
        const updatedTown = await shantytownModel.findOne(req.user, req.params.id);
        return res.status(200).send(updatedTown);
    } catch (e) {
        res.status(500).send({
            user_message: 'Une erreur est survenue dans l\'enregistrement du site en base de données',
        });
        return next(e);
    }
};
