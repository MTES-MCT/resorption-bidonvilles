
const {
    sequelize,
    Shantytown: ShantyTowns,
} = require('#db/models');

module.exports = () => async (req, res, next) => {
    const town = await ShantyTowns.findOne({
        where: {
            shantytown_id: req.params.id,
        },
    });

    if (town === null) {
        return res.status(400).send({
            error: {
                developer_message: `Tried to update unknown town of id #${req.params.id}`,
                user_message: `Le site d'identifiant ${req.params.id} n'existe pas : mise à jour impossible`,
            },
        });
    }

    try {
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
                owner: req.body.owner,
                declaredAt: req.body.declared_at,
                censusStatus: req.body.census_status,
                censusConductedAt: req.body.census_conducted_at,
                censusConductedBy: req.body.census_conducted_by,
                updatedBy: req.user.id,
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

            await town.update(
                Object.assign(
                    {},
                    baseTown,
                    req.user.permissions.shantytown.update.data_justice === true
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
                        : {
                            ownerComplaint: town.ownerComplaint,
                            justiceProcedure: town.justiceProcedure,
                            justiceRendered: town.justiceRendered,
                            justiceRenderedBy: town.justiceRenderedBy,
                            justiceRenderedAt: town.justiceRenderedAt,
                            justiceChallenged: town.justiceChallenged,
                            policeStatus: town.policeStatus,
                            policeRequestedAt: town.policeRequestedAt,
                            policeGrantedAt: town.policeGrantedAt,
                            bailiff: town.bailiff,
                        },
                ),
                {
                    transaction,
                },
            );

            await town.setSocialOrigins(req.body.social_origins, {
                transaction,
            });
        });

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
};
