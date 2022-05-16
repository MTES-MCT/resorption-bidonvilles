export const lifeConditionsMixin = {
    props: {
        shantytown: {
            type: Object,
            required: true
        }
    },
    computed: {
        stableConditions() {
            const conditions = {
                water: "eau",
                sanitary: "toilettes",
                electricity: "électricité",
                trash: "évacuation des déchets",
                vermin: "prévention des nuisibles",
                firePrevention: "prévention incendie"
            };

            return Object.keys(conditions)
                .filter(key => {
                    return (
                        this.shantytown.livingConditions[key].status.status ===
                        "good"
                    );
                })
                .map(key => conditions[key]);
        }
    }
};
