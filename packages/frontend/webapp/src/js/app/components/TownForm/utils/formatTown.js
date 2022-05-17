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
        livingConditions:
            data.livingConditions?.version === 1
                ? {
                      version: 1,
                      electricity: {
                          status: null,
                          type: data.livingConditions
                              ? data.livingConditions.electricity.type.id
                              : undefined,
                          comments:
                              data.livingConditions?.electricity.comments ||
                              undefined
                      },
                      water: {
                          status: null,
                          access: boolToInt(
                              data.livingConditions?.water.access
                          ),
                          comments:
                              data.livingConditions?.water.comments ||
                              undefined,
                          potable: boolToInt(
                              data.livingConditions?.water.potable
                          ),
                          continuousAccess: boolToInt(
                              data.livingConditions?.water.continuousAccess
                          ),
                          publicPoint: boolToInt(
                              data.livingConditions?.water.publicPoint
                          ),
                          distance: data.livingConditions?.water.distance,
                          roadsToCross: boolToInt(
                              data.livingConditions?.water.roadsToCross
                          ),
                          everyoneHasAccess: boolToInt(
                              data.livingConditions?.water.everyoneHasAccess
                          ),
                          stagnantWater: boolToInt(
                              data.livingConditions?.water.stagnantWater
                          ),
                          handWashAccess: boolToInt(
                              data.livingConditions?.water.handWashAccess
                          ),
                          handWashAccessNumber:
                              data.livingConditions?.water.handWashAccessNumber
                      },
                      trash: {
                          status: null,
                          evacuation: boolToInt(
                              data.livingConditions?.trash.evacuation
                          ),
                          cansOnSite: data.livingConditions?.trash.cansOnSite,
                          accumulation: boolToInt(
                              data.livingConditions?.trash.accumulation
                          ),
                          evacuationRegular: boolToInt(
                              data.livingConditions?.trash.evacuationRegular
                          )
                      },
                      sanitary: {
                          access: boolToInt(
                              data.livingConditions?.sanitary.access
                          ),
                          comments:
                              data.livingConditions?.sanitary.comments ||
                              undefined,
                          number: data.livingConditions?.sanitary.number,
                          insalubrious: boolToInt(
                              data.livingConditions?.sanitary.insalubrious
                          ),
                          onSite: boolToInt(
                              data.livingConditions?.sanitary.onSite
                          )
                      },
                      vermin: {
                          vermin: boolToInt(
                              data.livingConditions?.vermin.vermin
                          ),
                          comments: data.livingConditions?.vermin.comments
                      },
                      firePrevention: {
                          measures: boolToInt(
                              data.livingConditions?.firePrevention.measures
                          ),
                          diagnostic: boolToInt(
                              data.livingConditions?.firePrevention.diagnostic
                          ),
                          siteAccessible: boolToInt(
                              data.livingConditions?.firePrevention
                                  .siteAccessible
                          ),
                          devices: boolToInt(
                              data.livingConditions?.firePrevention.devices
                          ),
                          comments:
                              data.livingConditions?.firePrevention.comments
                      }
                  }
                : {
                      version: 2
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
