import L from "leaflet";

const iconMap = {
    access_to_water: "faucet-drip",
    access_to_electricity: "bolt",
    trash_evacuation: "trash-can",
    fire_prevention: "fire-extinguisher",
    working_toilets: "toilet",
    absence_of_pest_animals: "bug-slash",
};

export default (town) => {
    const livingConditionsHTML = Object.keys(iconMap)
        .reduce((acc, key) => {
            if (town[key] === "bad" || town[key] === "unknown") {
                return acc;
            }

            const color = town[key] === "good" ? "text-green" : "text-red";
            acc.push(
                `<i class="fa-solid fa-${iconMap[key]} ${color} ml-1"></i>`
            );
            return acc;
        }, [])
        .join("");

    return L.marker([town.latitude, town.longitude], {
        icon: L.divIcon({
            className: "my-marker",
            html: `<span id="marqueur-site-stats-${
                town.id
            }" class="border-2 border-primary rounded bg-white px-2 py-1 whitespace-nowrap">
                ${town.number_of_persons || "0"} ${livingConditionsHTML}
            </span>`,
        }),
    });
};
