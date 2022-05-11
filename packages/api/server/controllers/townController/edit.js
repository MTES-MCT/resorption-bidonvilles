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
                fk_electricity_type: req.body.electricity_type,
                electricity_comments: req.body.electricity_comments,
                access_to_sanitary: req.body.access_to_sanitary,
                // Sanitary
                sanitary_comments: req.body.sanitary_comments,
                sanitary_number: req.body.sanitary_number,
                sanitary_insalubrious: req.body.sanitary_insalubrious,
                sanitary_on_site: req.body.sanitary_on_site,
                // Water
                access_to_water: req.body.access_to_water,
                water_comments: req.body.water_comments,
                water_potable: req.body.water_potable,
                water_continuous_access: req.body.water_continuous_access,
                water_public_point: req.body.water_public_point,
                water_distance: req.body.water_distance,
                water_roads_to_cross: req.body.water_roads_to_cross,
                water_everyone_has_access: req.body.water_everyone_has_access,
                water_stagnant_water: req.body.water_stagnant_water,
                water_hand_wash_access: req.body.water_hand_wash_access,
                water_hand_wash_access_number: req.body.water_hand_wash_access_number,
                // Trash
                trash_evacuation: req.body.trash_evacuation,
                trash_cans_on_site: req.body.trash_cans_on_site,
                trash_accumulation: req.body.trash_accumulation,
                trash_evacuation_regular: req.body.trash_evacuation_regular,
                // Vermin
                vermin: req.body.vermin,
                vermin_comments: req.body.vermin_comments,
                // Fire prevention
                fire_prevention_measures: req.body.fire_prevention_measures,
                fire_prevention_diagnostic: req.body.fire_prevention_diagnostic,
                fire_prevention_site_accessible: req.body.fire_prevention_site_accessible,
                fire_prevention_devices: req.body.fire_prevention_devices,
                fire_prevention_comments: req.body.fire_prevention_comments,
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
