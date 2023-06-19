function sortByCityName(a, b, order) {
    if (order === "asc") {
        return a.city.name >= b.city.name;
    } else {
        return a.city.name <= b.city.name;
    }
}

function sortBySummaryKey(key) {
    return (a, b, order) => {
        if (a.summary[key] === b.summary[key]) {
            return sortByCityName(a, b, "asc");
        }
        if (order === "asc") {
            return a.summary[key] > b.summary[key];
        } else {
            return a.summary[key] < b.summary[key];
        }
    };
}

function sortByKeyName(key) {
    return (a, b, order) => {
        if (a[key] === b[key]) {
            return sortByKeyName("usename")(a, b, "asc");
        }
        if (order === "asc") {
            return a[key] > b[key];
        } else {
            return a[key] < b[key];
        }
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
                return true;
            }
            return false;
        } else {
            if (a[key] === "good") {
                return false;
            }
            return true;
        }
    };
}

function sortJusticeByKeyName(key) {
    return (a, b, order) => {
        if (a[key] === b[key]) {
            return sortByKeyName("usename")(a, b, "asc");
        }
        if (order === "asc") {
            if (a[key] === true) {
                return true;
            } else if (a[key] === false && b[key] === null) {
                return true;
            }
            return false;
        } else {
            if (a[key] === true) {
                return false;
            } else if (a[key] === false && b[key] === null) {
                return false;
            }
            return true;
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
    },
    livingConditions: {
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
            town_level: sortJusticeByKeyName("owner_complaint"),
        },

        number_of_towns_with_justice_procedure: {
            city_level: sortBySummaryKey(
                "number_of_towns_with_justice_procedure"
            ),
            town_level: sortJusticeByKeyName("justice_procedure"),
        },
        number_of_towns_with_police: {
            city_level: sortBySummaryKey("number_of_towns_with_police"),
            town_level: sortJusticeByKeyName("police"),
        },
    },
};
