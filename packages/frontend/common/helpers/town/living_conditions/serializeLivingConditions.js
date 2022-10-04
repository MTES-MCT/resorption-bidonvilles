import waterAccessTypes from "./water_access_types";
import toiletTypes from "./toilet_types";
import electricityAccessTypes from "./electricity_access_types";

export default (town) => {
    const response = {
        water: [],
        sanitary: [],
        electricity: [],
        trash: [],
        pest_animals: [],
        fire_prevention: []
    };

    const { livingConditions } = town;
    if (livingConditions.version === 1) {
        if (livingConditions.water.comments) {
            response.water.push({
                label: "Commentaires",
                content: livingConditions.water.comments
            });
        }

        if (livingConditions.sanitary.comments) {
            response.sanitary.push({
                label: "Commentaires",
                content: livingConditions.sanitary.comments
            });
        }

        if (livingConditions.electricity.comments) {
            response.electricity.push({
                label: "Commentaires",
                content: livingConditions.electricity.comments
            });
        }

        if (livingConditions.vermin.comments) {
            response.pest_animals.push({
                label: "Commentaires",
                content: livingConditions.vermin.comments
            });
        }

        if (livingConditions.firePrevention.comments) {
            response.fire_prevention.push({
                label: "Commentaires",
                content: livingConditions.firePrevention.comments
            });
        }

        return response;
    }

    // water
    let accessType =
        waterAccessTypes[livingConditions.water.access_type];
    if (livingConditions.water.access_type_details) {
        accessType = `${accessType} — ${livingConditions.water.access_type_details}`;
    }
    response.water.push({
        label: "Type d'accès",
        content: accessType
    });

    if (livingConditions.water.access_is_continuous_details) {
        response.water.push({
            label: "L'accès n'est pas continu",
            content: livingConditions.water.access_is_continuous_details
        });
    }

    if (livingConditions.water.access_is_unequal_details) {
        response.water.push({
            label: "Des inégalités d'accès ont été constatées",
            content: livingConditions.water.access_is_unequal_details
        });
    }

    if (livingConditions.water.access_comments) {
        response.water.push({
            label: "Commentaires",
            content: livingConditions.water.access_comments
        });
    }

    // sanitary
    if (
        livingConditions.sanitary.toilet_types &&
        livingConditions.sanitary.toilet_types.length
    ) {
        response.sanitary.push({
            label: "Types de toilettes",
            content: livingConditions.sanitary.toilet_types
                .map(id => toiletTypes[id])
                .join(", ")
        });
    }

    // electricity
    if (
        livingConditions.electricity.access_types &&
        livingConditions.electricity.access_types.length
    ) {
        response.electricity.push({
            label: "Types d'accès",
            content: livingConditions.electricity.access_types
                .map(id => electricityAccessTypes[id])
                .join(", ")
        });
    }

    // pest animals
    if (livingConditions.pest_animals.details) {
        response.pest_animals.push({
            label: "Commentaires",
            content: livingConditions.pest_animals.details
        });
    }

    return response;
};