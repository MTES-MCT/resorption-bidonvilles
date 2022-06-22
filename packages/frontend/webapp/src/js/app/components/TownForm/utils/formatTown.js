function boolToInt(bool) {
    if (bool === undefined) {
        return undefined;
    }

    if (bool === true) {
        return 1;
    }

    if (bool === false) {
        return 0;
    }

    return -1;
}

function intToStr(int) {
    if (typeof int === "number") {
        return `${int}`;
    }

    return undefined;
}

function toNullableStr(value) {
    if (value === undefined || value === null) {
        return "null";
    }

    return value;
}

export default function formatTown(data) {
    return {
        // location data necessary for permission checks
        region: data.region || null,
        departement: data.departement || null,
        epci: data.epci || null,
        city: data.city || null,
        location: {
            address: {
                label: data.address ? data.address : undefined,
                citycode: data.city ? data.city.code : undefined
            },
            name: data.name || undefined,
            coordinates: data.latitude
                ? [data.latitude, data.longitude]
                : undefined
        },
        characteristics: {
            built_at: data.builtAt ? new Date(data.builtAt * 1000) : undefined,
            declared_at: data.declaredAt
                ? new Date(data.declaredAt * 1000)
                : undefined,
            field_type: data.fieldType ? data.fieldType.id : undefined,
            detailed_address: data.addressDetails,
            owner_type: data.ownerType ? data.ownerType.id : undefined,
            owner: data.owner,
            is_reinstallation: boolToInt(data.isReinstallation),
            reinstallation_comments: data.reinstallationComments || undefined
        },
        people: {
            population: {
                populationTotal: intToStr(data.populationTotal),
                populationCouples: intToStr(data.populationCouples),
                populationMinors: intToStr(data.populationMinors)
            },
            populationMinors: {
                populationMinors0To3: intToStr(data.populationMinors0To3),
                populationMinors3To6: intToStr(data.populationMinors3To6),
                populationMinors6To12: intToStr(data.populationMinors6To12),
                populationMinors12To16: intToStr(data.populationMinors12To16),
                populationMinors16To18: intToStr(data.populationMinors16To18),
                minorsInSchool: intToStr(data.minorsInSchool)
            },
            caravansAndHuts: {
                caravans: intToStr(data.caravans),
                huts: intToStr(data.huts)
            },
            social_origins: data.socialOrigins
                ? data.socialOrigins.map(({ id }) => id)
                : [],
            census_status: toNullableStr(data.censusStatus),
            census_conducted_at: data.censusConductedAt
                ? new Date(data.censusConductedAt * 1000)
                : undefined,
            census_conducted_by: data.censusConductedBy
        },
        living_conditions: {
            access_to_water: boolToInt(data.accessToWater),
            water_comments: data.waterComments || undefined,
            electricity_type: data.electricityType
                ? data.electricityType.id
                : undefined,
            electricity_comments: data.electricityComments || undefined,
            access_to_sanitary: boolToInt(data.accessToSanitary),
            sanitary_comments: data.sanitaryComments || undefined,
            trash_evacuation: boolToInt(data.trashEvacuation),
            water_potable: boolToInt(data.waterPotable),
            water_public_point: boolToInt(data.waterPublicPoint),
            water_continuous_access: boolToInt(data.waterContinuousAccess),
            water_distance: data.waterDistance,
            water_roads_to_cross: boolToInt(data.waterRoadsToCross),
            water_everyone_has_access: boolToInt(data.waterEveryoneHasAccess),
            water_stagnant_water: boolToInt(data.waterStagnantWater),
            water_hand_wash_access: boolToInt(data.waterHandWashAccess),
            water_hand_wash_access_number: data.waterHandWashAccessNumber,
            sanitary_number: data.sanitaryNumber,
            sanitary_insalubrious: boolToInt(data.sanitaryInsalubrious),
            sanitary_on_site: boolToInt(data.sanitaryOnSite),
            trash_cans_on_site: data.trashCansOnSite,
            trash_accumulation: boolToInt(data.trashAccumulation),
            trash_evacuation_regular: boolToInt(data.trashEvacuationRegular),
            vermin: boolToInt(data.vermin),
            vermin_comments: data.verminComments,
            fire_prevention_measures: boolToInt(data.firePreventionMeasures),
            fire_prevention_diagnostic: boolToInt(
                data.firePreventionDiagnostic
            ),
            fire_prevention_devices: boolToInt(data.firePreventionDevices),
            fire_prevention_site_accessible: boolToInt(
                data.firePreventionSiteAccessible
            ),
            fire_prevention_comments: data.firePreventionComments
        },
        judicial: {
            owner_complaint: boolToInt(data.ownerComplaint),
            justice_procedure: boolToInt(data.justiceProcedure),
            justice_rendered: boolToInt(data.justiceRendered),
            justice_rendered_at: data.justiceRenderedAt
                ? new Date(data.justiceRenderedAt * 1000)
                : undefined,
            justice_rendered_by: data.justiceRenderedBy || undefined,
            justice_challenged: boolToInt(data.justiceChallenged),
            police_status: toNullableStr(data.policeStatus),
            police_requested_at: data.policeRequestedAt
                ? new Date(data.policeRequestedAt * 1000)
                : undefined,
            police_granted_at: data.policeGrantedAt
                ? new Date(data.policeGrantedAt * 1000)
                : undefined,
            bailiff: data.bailiff || undefined
        }
    };
}
