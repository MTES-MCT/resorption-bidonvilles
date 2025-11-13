import L from "leaflet";
import collections from "../utils/icon-collections.js";

const iconMap = {
    livingConditionsByTown: null,
    livingConditionsByInhabitant: null,
    summary: {
        access_to_water: "faucet-drip",
        access_to_electricity: "bolt",
        trash_evacuation: "trash-can",
        fire_prevention: "fire-extinguisher",
        working_toilets: "toilet",
        absence_of_pest_animals: "bug-slash",
        heatwave: collections.filter((c) => c.prefix === "ri")[0].icons[
            "sun-fill"
        ].body,
    },
    schooling: {
        number_of_schooled_minors: "school",
    },
};
// On donne temporairement les mêmes valeurs que summary aux livingConditions
iconMap.livingConditionsByInhabitant = iconMap.summary;
iconMap.livingConditionsByTown = iconMap.summary;

const colorizeSchooling = (minors, percentage) => {
    if (minors === 0 || minors === null) {
        return "text-G400";
    }

    if (percentage >= 70) {
        return "text-green";
    } else if (percentage >= 30) {
        return "text-warningOrange";
    }

    return "text-red";
};

export default (town, activeTab) => {
    const livingConditionsHTML = Object.keys(iconMap[activeTab])
        .reduce((acc, key) => {
            let color;
            if (activeTab === "schooling") {
                const schoolingPercentage = Math.round(
                    (town.number_of_schooled_minors / town.number_of_minors) *
                        100
                );
                color = colorizeSchooling(
                    town.number_of_minors,
                    schoolingPercentage
                );
            } else {
                if (
                    town[key] === "bad" ||
                    town[key] === "unknown" ||
                    !town[key]
                ) {
                    return acc;
                }

                color = town[key] === "good" ? "text-green" : "text-red";
            }

            // Double run temporaire tant que toutes les icônes ne sont pas DSFR
            if (key === "heatwave") {
                acc.push(
                    `<svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        aria-hidden="true"
                        role="img"
                        width=".8em"
                        height=".8em"
                        viewBox="0 0 26 26"
                        class="iconify iconify--ri vicon !text-secondary ml-1"
                        style="font-size: 1.2rem; vertical-align: -0.2em; display: inline-block; color: inherit;"
                    >
                        ${iconMap[activeTab][key]}
                    </svg>`
                );
            } else {
                acc.push(
                    `<i class="fa-solid fa-${iconMap[activeTab][key]} ${color} ml-1"></i>`
                );
            }
            return acc;
        }, [])
        .join("");

    return L.marker([town.latitude, town.longitude], {
        icon: L.divIcon({
            className: "my-marker",
            html: `<span id="marqueur-site-stats-${
                town.id
            }" class="border-2 border-primary rounded bg-white px-2 py-1 whitespace-nowrap">
                ${
                    activeTab === "schooling"
                        ? town.number_of_minors || "0"
                        : town.number_of_persons || "0"
                } ${livingConditionsHTML}`,
        }),
    });
};
