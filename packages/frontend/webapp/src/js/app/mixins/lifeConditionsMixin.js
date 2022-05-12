import { formatLivingConditions } from "#app/pages/TownDetails/formatLivingConditions";

export const lifeConditionsMixin = {
    props: {
        shantytown: {
            type: Object,
            required: true
        }
    },
    computed: {
        stableConditions() {
            const details = formatLivingConditions(this.shantytown);
            const conditions = [];
            if (
                this.shantytown.livingConditions.water.access === true &&
                details.water.negative.length === 0
            ) {
                conditions.push("eau");
            }
            if (
                this.shantytown.livingConditions.sanitary.access === true &&
                details.sanitary.negative.length === 0
            ) {
                conditions.push("toilettes");
            }
            if (
                this.shantytown.livingConditions.electricity.type.value === true
            ) {
                conditions.push("électricité");
            }
            if (
                this.shantytown.livingConditions.trash.evacuation === true &&
                details.trash.negative.length === 0
            ) {
                conditions.push("évacuation des déchets");
            }
            if (this.shantytown.livingConditions.vermin.vermin === false) {
                conditions.push("prévention des nuisibles");
            }
            if (
                this.shantytown.livingConditions.firePrevention.measures ===
                    true &&
                details.firePrevention.negative.length === 0
            ) {
                conditions.push("prévention incendie");
            }
            return conditions;
        }
    }
};
