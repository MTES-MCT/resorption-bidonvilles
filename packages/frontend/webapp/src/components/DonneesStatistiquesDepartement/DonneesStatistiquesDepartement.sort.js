function sortByCityName(a, b, order) {
    if (order === "asc") {
        return a.city.name >= b.city.name;
    } else {
        return a.city.name <= b.city.name;
    }
}

function sortBySummaryKey(key) {
    return (a, b, order) => {
        if (order === "asc") {
            return a.summary[key] >= b.summary[key];
        } else {
            return a.summary[key] <= b.summary[key];
        }
    };
}

export default {
    summary: {
        city_name: sortByCityName,
        number_of_towns: sortBySummaryKey("number_of_towns"),

        number_of_persons: sortBySummaryKey("number_of_persons"),

        number_of_towns_with_water: sortBySummaryKey(
            "number_of_towns_with_water"
        ),
    },
    inhabitants: {
        city_name: sortByCityName,
        number_of_towns: sortBySummaryKey("number_of_towns"),
        number_of_persons: sortBySummaryKey("number_of_persons"),

        number_of_households: sortBySummaryKey("number_of_households"),
        number_of_minors: sortBySummaryKey("number_of_minors"),
    },
    livingConditions: {
        city_name: sortByCityName,
        number_of_persons: sortBySummaryKey("number_of_persons"),

        number_of_towns_with_water: sortBySummaryKey(
            "number_of_towns_with_water"
        ),
        number_of_towns_with_electricity: sortBySummaryKey(
            "number_of_towns_with_electricity"
        ),
        number_of_towns_with_trash_evacuation: sortBySummaryKey(
            "number_of_towns_with_trash_evacuation"
        ),
        number_of_towns_with_fire_prevention: sortBySummaryKey(
            "number_of_towns_with_fire_prevention"
        ),
        number_of_towns_with_toilets: sortBySummaryKey(
            "number_of_towns_with_toilets"
        ),
        number_of_towns_without_pest_animals: sortBySummaryKey(
            "number_of_towns_without_pest_animals"
        ),
    },
    justice: {
        city_name: sortByCityName,
        number_of_towns_with_owner_complaint: sortBySummaryKey(
            "number_of_towns_with_owner_complaint"
        ),

        number_of_towns_with_justice_procedure: sortBySummaryKey(
            "number_of_towns_with_justice_procedure"
        ),
        number_of_towns_with_police: sortBySummaryKey(
            "number_of_towns_with_police"
        ),
    },
};
