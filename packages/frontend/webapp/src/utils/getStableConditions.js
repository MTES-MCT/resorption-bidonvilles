import { computed } from "vue";

export default function (shantytownRef) {
    return computed(() => {
        let verminKey = "vermin";
        let fireKey = "firePrevention";
        if (shantytownRef.value.livingConditions.version === 2) {
            verminKey = "pest_animals";
            fireKey = "fire_prevention";
        }

        const conditions = {
            water: "eau",
            sanitary: "toilettes",
            electricity: "électricité",
            trash: "évacuation des déchets",
            [verminKey]: "prévention des nuisibles",
            [fireKey]: "prévention incendie",
        };

        return Object.keys(conditions)
            .filter((key) => {
                return (
                    shantytownRef.value.livingConditions[key].status.status ===
                    "good"
                );
            })
            .map((key) => conditions[key]);
    });
}
