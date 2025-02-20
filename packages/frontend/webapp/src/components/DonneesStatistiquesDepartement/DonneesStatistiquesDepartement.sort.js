function sortByCityName(a, b, order) {
    if (order === "asc") {
        return a.city.name >= b.city.name ? 1 : -1;
    }

    return a.city.name <= b.city.name ? 1 : -1;
}

function sortBySummaryKey(key) {
    return (a, b, order) => {
        if (a.summary[key] === b.summary[key]) {
            return sortByCityName(a, b, "asc");
        }

        if (order === "asc") {
            return a.summary[key] > b.summary[key] ? 1 : -1;
        }

        return a.summary[key] < b.summary[key] ? 1 : -1;
    };
}

function sortByKeyName(key) {
    return (a, b, order) => {
        if (a[key] === b[key]) {
            if (key === "usename") {
                return 0;
            }

            return sortByKeyName("usename")(a, b, "asc");
        }

        if (order === "asc") {
            return a[key] > b[key] ? 1 : -1;
        }

        return a[key] < b[key] ? 1 : -1;
    };
}

function sortLivingConditionByKeyName(key) {
    return (a, b, order) => {
        if (
            (a[key] === "good" && b[key] === "good") ||
            (a[key] !== "good" && b[key] !== "good")
        ) {
            return sortByKeyName("usename")(a, b, "asc");
        }

        if (order === "asc") {
            if (a[key] === "good") {
                return 1;
            }

            return -1;
        }

        if (a[key] === "good") {
            return -1;
        }

        return 1;
    };
}

function sortBooleanByKeyName(key) {
    return (a, b, order) => {
        if (a[key] === b[key]) {
            return sortByKeyName("usename")(a, b, "asc");
        }
        if (order === "asc") {
            if (a[key] === true) {
                return 1;
            } else if (a[key] === false && b[key] === null) {
                return 1;
            }

            return -1;
        } else {
            if (a[key] === true) {
                return -1;
            } else if (a[key] === false && b[key] === null) {
                return -1;
            }
            return 1;
        }
    };
}

export default {
    summary: {
        city_name: {
            city_level: sortByCityName,
            town_level: sortByKeyName("usename"),
        },
        number_of_towns: {
            city_level: sortBySummaryKey("number_of_towns"),
            town_level: sortByKeyName("usename"),
        },

        number_of_persons: {
            city_level: sortBySummaryKey("number_of_persons"),
            town_level: sortByKeyName("number_of_persons"),
        },

        number_of_towns_with_water: {
            city_level: sortBySummaryKey("number_of_towns_with_water"),
            town_level: sortLivingConditionByKeyName("access_to_water"),
        },
    },
    inhabitants: {
        city_name: {
            city_level: sortByCityName,
            town_level: sortByKeyName("usename"),
        },
        number_of_towns: {
            city_level: sortBySummaryKey("number_of_towns"),
            town_level: sortByKeyName("usename"),
        },
        number_of_persons: {
            city_level: sortBySummaryKey("number_of_persons"),
            town_level: sortByKeyName("number_of_persons"),
        },

        number_of_households: {
            city_level: sortBySummaryKey("number_of_households"),
            town_level: sortByKeyName("number_of_households"),
        },
        number_of_minors: {
            city_level: sortBySummaryKey("number_of_minors"),
            town_level: sortByKeyName("number_of_minors"),
        },
        number_of_schooled_minors: {
            city_level: sortBySummaryKey("number_of_schooled_minors"),
            town_level: sortByKeyName("number_of_schooled_minors"),
        },
    },
    livingConditionsByInhabitant: {
        city_name: {
            city_level: sortByCityName,
            town_level: sortByKeyName("usename"),
        },
        number_of_persons: {
            city_level: sortBySummaryKey("number_of_persons"),
            town_level: sortByKeyName("number_of_persons"),
        },

        number_of_inhabitants_with_water: {
            city_level: sortBySummaryKey("number_of_inhabitants_with_water"),
            town_level: sortLivingConditionByKeyName("access_to_water"),
        },
        number_of_inhabitants_with_electricity: {
            city_level: sortBySummaryKey(
                "number_of_inhabitants_with_electricity"
            ),
            town_level: sortLivingConditionByKeyName("access_to_electricity"),
        },
        number_of_inhabitants_with_trash_evacuation: {
            city_level: sortBySummaryKey(
                "number_of_inhabitants_with_trash_evacuation"
            ),
            town_level: sortLivingConditionByKeyName("trash_evacuation"),
        },
        number_of_inhabitants_with_fire_prevention: {
            city_level: sortBySummaryKey(
                "number_of_inhabitants_with_fire_prevention"
            ),
            town_level: sortLivingConditionByKeyName("fire_prevention"),
        },
        number_of_inhabitants_with_toilets: {
            city_level: sortBySummaryKey("number_of_inhabitants_with_toilets"),
            town_level: sortLivingConditionByKeyName("working_toilets"),
        },
        number_of_inhabitants_without_pest_animals: {
            city_level: sortBySummaryKey(
                "number_of_inhabitants_without_pest_animals"
            ),
            town_level: sortLivingConditionByKeyName("absence_of_pest_animals"),
        },
        number_of_inhabitants_with_heatwave: {
            city_level: sortBySummaryKey("number_of_inhabitants_with_heatwave"),
            town_level: sortBooleanByKeyName("heatwave"),
        },
    },
    livingConditionsByTown: {
        city_name: {
            city_level: sortByCityName,
            town_level: sortByKeyName("usename"),
        },
        number_of_persons: {
            city_level: sortBySummaryKey("number_of_persons"),
            town_level: sortByKeyName("number_of_persons"),
        },

        number_of_towns_with_water: {
            city_level: sortBySummaryKey("number_of_towns_with_water"),
            town_level: sortLivingConditionByKeyName("access_to_water"),
        },
        number_of_towns_with_electricity: {
            city_level: sortBySummaryKey("number_of_towns_with_electricity"),
            town_level: sortLivingConditionByKeyName("access_to_electricity"),
        },
        number_of_towns_with_trash_evacuation: {
            city_level: sortBySummaryKey(
                "number_of_towns_with_trash_evacuation"
            ),
            town_level: sortLivingConditionByKeyName("trash_evacuation"),
        },
        number_of_towns_with_fire_prevention: {
            city_level: sortBySummaryKey(
                "number_of_towns_with_fire_prevention"
            ),
            town_level: sortLivingConditionByKeyName("fire_prevention"),
        },
        number_of_towns_with_toilets: {
            city_level: sortBySummaryKey("number_of_towns_with_toilets"),
            town_level: sortLivingConditionByKeyName("working_toilets"),
        },
        number_of_towns_without_pest_animals: {
            city_level: sortBySummaryKey(
                "number_of_towns_without_pest_animals"
            ),
            town_level: sortLivingConditionByKeyName("absence_of_pest_animals"),
        },
        number_of_towns_with_heatwave: {
            city_level: sortBySummaryKey("number_of_towns_with_heatwave"),
            town_level: sortBooleanByKeyName("heatwave"),
        },
    },
    schooling: {
        city_name: {
            city_level: sortByCityName,
            town_level: sortByKeyName("usename"),
        },
        number_of_schooled_minors: {
            city_level: sortBySummaryKey("number_of_schooled_minors"),
            town_level: sortByKeyName("usename"),
        },
    },
    justice: {
        city_name: {
            city_level: sortByCityName,
            town_level: sortByKeyName("usename"),
        },
        number_of_towns_with_owner_complaint: {
            city_level: sortBySummaryKey(
                "number_of_towns_with_owner_complaint"
            ),
            town_level: sortBooleanByKeyName("owner_complaint"),
        },

        number_of_towns_with_justice_procedure: {
            city_level: sortBySummaryKey(
                "number_of_towns_with_justice_procedure"
            ),
            town_level: sortBooleanByKeyName("justice_procedure"),
        },
        number_of_towns_with_police: {
            city_level: sortBySummaryKey("number_of_towns_with_police"),
            town_level: sortBooleanByKeyName("police"),
        },
    },
};
