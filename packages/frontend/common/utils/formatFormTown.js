import formatBoolToInt from "./formatBoolToInt";
import formatIntToStr from "./formatIntToStr";
import formatNullableStr from "./formatNullableStr";

export default function (data) {
    const formatted = {
        // location data necessary for permission checks
        location: {
            region: data.region || null,
            departement: data.departement || null,
            epci: data.epci || null,
            city: data.city || null,
        },
        address: data.address
            ? {
                  search: data.address || "",
                  data: {
                      citycode: data.city ? data.city.code : undefined,
                      city: "",
                      label: data.address ? data.address : undefined,
                      coordinates: data.latitude
                          ? [data.latitude, data.longitude]
                          : [],
                  },
              }
            : undefined,
        coordinates: data.latitude ? [data.latitude, data.longitude] : [],
        name: data.name || undefined,
        built_at: data.builtAt ? new Date(data.builtAt * 1000) : undefined,
        declared_at: data.declaredAt
            ? new Date(data.declaredAt * 1000)
            : undefined,
        field_type: data.fieldType ? data.fieldType.id : undefined,
        detailed_address: data.addressDetails,
        owner_type: data.ownerType ? data.ownerType.id : undefined,
        owner: data.owner,
        population_total: formatIntToStr(data.populationTotal),
        population_couples: formatIntToStr(data.populationCouples),
        population_minors: formatIntToStr(data.populationMinors),
        population_minors_0_3: formatIntToStr(data.populationMinors0To3),
        population_minors_3_6: formatIntToStr(data.populationMinors3To6),
        population_minors_6_12: formatIntToStr(data.populationMinors6To12),
        population_minors_12_16: formatIntToStr(data.populationMinors12To16),
        population_minors_16_18: formatIntToStr(data.populationMinors16To18),
        minors_in_school: formatIntToStr(data.minorsInSchool),
        caravans: formatIntToStr(data.caravans),
        huts: formatIntToStr(data.huts),
        tents: formatIntToStr(data.tents),
        cars: formatIntToStr(data.cars),
        mattresses: formatIntToStr(data.mattresses),
        social_origins: data.socialOrigins
            ? data.socialOrigins.map(({ id }) => id)
            : [],
        census_status: formatNullableStr(data.censusStatus),
        census_conducted_at: data.censusConductedAt
            ? new Date(data.censusConductedAt * 1000)
            : undefined,
        census_conducted_by: data.censusConductedBy,
        is_reinstallation: formatBoolToInt(data.isReinstallation),
        reinstallation_comments: data.reinstallationComments || undefined,
        reinstallation_incoming_towns: data.reinstallationIncomingTowns
            ? data.reinstallationIncomingTowns.map(({ id }) => id)
            : [],
        // original_version: data.livingConditions?.version || 2,
        version: data.livingConditions?.version || 2,
        water_access_type: data.livingConditions?.water.access_type,
        water_access_type_details:
            data.livingConditions?.water.access_type_details,
        water_access_is_public: formatBoolToInt(
            data.livingConditions?.water.access_is_public
        ),
        water_access_is_continuous: formatBoolToInt(
            data.livingConditions?.water.access_is_continuous
        ),
        water_access_is_continuous_details:
            data.livingConditions?.water.access_is_continuous_details,
        water_access_is_local: formatBoolToInt(
            data.livingConditions?.water.access_is_local
        ),
        water_access_is_close: formatBoolToInt(
            data.livingConditions?.water.access_is_close
        ),
        water_access_is_unequal: formatBoolToInt(
            data.livingConditions?.water.access_is_unequal
        ),
        water_access_is_unequal_details:
            data.livingConditions?.water.access_is_unequal_details,
        water_access_has_stagnant_water: formatBoolToInt(
            data.livingConditions?.water.access_has_stagnant_water
        ),
        water_access_comments: data.livingConditions?.water.access_comments,
        sanitary_open_air_defecation: formatBoolToInt(
            data.livingConditions?.sanitary.open_air_defecation
        ),
        sanitary_working_toilets: formatBoolToInt(
            data.livingConditions?.sanitary.working_toilets
        ),
        sanitary_toilet_types:
            data.livingConditions?.sanitary.toilet_types || [],
        sanitary_toilets_are_inside: formatBoolToInt(
            data.livingConditions?.sanitary.toilets_are_inside
        ),
        sanitary_toilets_are_lighted: formatBoolToInt(
            data.livingConditions?.sanitary.toilets_are_lighted
        ),
        sanitary_hand_washing: formatBoolToInt(
            data.livingConditions?.sanitary.hand_washing
        ),
        electricity_access: formatBoolToInt(
            data.livingConditions?.electricity.access
        ),
        electricity_access_types:
            data.livingConditions?.electricity.access_types || [],
        electricity_access_is_unequal: formatBoolToInt(
            data.livingConditions?.electricity.access_is_unequal
        ),
        trash_is_piling: formatBoolToInt(
            data.livingConditions?.trash.is_piling
        ),
        trash_evacuation_is_close: formatBoolToInt(
            data.livingConditions?.trash.evacuation_is_close
        ),
        trash_evacuation_is_safe: formatBoolToInt(
            data.livingConditions?.trash.evacuation_is_safe
        ),
        trash_evacuation_is_regular: formatBoolToInt(
            data.livingConditions?.trash.evacuation_is_regular
        ),
        trash_bulky_is_piling: formatBoolToInt(
            data.livingConditions?.trash.bulky_is_piling
        ),
        pest_animals_presence: formatBoolToInt(
            data.livingConditions?.pest_animals?.presence
        ),
        pest_animals_details: data.livingConditions?.pest_animals?.details,
        fire_prevention_diagnostic: formatBoolToInt(
            data.livingConditions?.fire_prevention?.diagnostic
        ),
        owner_complaint: formatBoolToInt(data.ownerComplaint),
        justice_procedure: formatBoolToInt(data.justiceProcedure),
        justice_rendered: formatBoolToInt(data.justiceRendered),
        justice_rendered_at: data.justiceRenderedAt
            ? new Date(data.justiceRenderedAt * 1000)
            : undefined,
        justice_rendered_by: data.justiceRenderedBy || undefined,
        justice_challenged: formatBoolToInt(data.justiceChallenged),
        police_status: formatNullableStr(data.policeStatus),
        police_requested_at: data.policeRequestedAt
            ? new Date(data.policeRequestedAt * 1000)
            : undefined,
        police_granted_at: data.policeGrantedAt
            ? new Date(data.policeGrantedAt * 1000)
            : undefined,
        bailiff: data.bailiff || undefined,
        existing_litigation: formatBoolToInt(data.existingLitigation),
        evacuation_under_time_limit: formatBoolToInt(data.evacuationUnderTimeLimit),
        administrative_order_decision_at: data.administrativeOrderDecisionAt
            ? new Date(data.administrativeOrderDecisionAt * 1000)
            : undefined,
        administrative_order_decision_rendered_by: data.administrativeOrderDecisionRenderedBy || undefined,
        administrative_order_evacuation_at: data.administrativeOrderEvacuationAt
            ? new Date(data.administrativeOrderEvacuationAt * 1000)
            : undefined,
        insalubrity_order: formatBoolToInt(data.insalubrityOrder),
        insalubrity_order_displayed: formatBoolToInt(data.insalubrityOrderDisplayed),
        insalubrity_order_type: data.insalubrityOrderType || undefined,
        insalubrity_order_by: data.insalubrityOrderBy || undefined,
        insalubrity_order_at: data.insalubrityOrderAt
            ? new Date(data.insalubrityOrderAt * 1000)
            : undefined,
        insalubrity_parcels: data.insalubrityParcels || undefined,
    };

    if (data.livingConditions?.version === 1) {
        Object.keys(data.livingConditions).forEach((sectionKey) => {
            if (typeof data.livingConditions[sectionKey] !== "object") {
                return;
            }

            Object.keys(data.livingConditions[sectionKey]).forEach((key) => {
                formatted[`old_${sectionKey}_${key}`] =
                    data.livingConditions[sectionKey][key];
            });
        });

        formatted.old_electricity_type =
            data.livingConditions.electricity.type.id;
    }

    return formatted;
}
