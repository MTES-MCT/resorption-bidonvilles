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
                this.shantytown.accessToWater === true &&
                details.water.negative.length === 0
            ) {
                conditions.push("eau");
            }
            if (
                this.shantytown.accessToSanitary === true &&
                details.sanitary.negative.length === 0
            ) {
                conditions.push("toilettes");
            }
            if (this.shantytown.electricityType.value === true) {
                conditions.push("électricité");
            }
            if (
                this.shantytown.trashEvacuation === true &&
                details.trash.negative.length === 0
            ) {
                conditions.push("évacuation des déchets");
            }
            if (this.shantytown.vermin === false) {
                conditions.push("prévention des nuisibles");
            }
            if (
                this.shantytown.firePreventionMeasures === true &&
                details.firePrevention.negative.length === 0
            ) {
                conditions.push("prévention incendie");
            }
            return conditions;
        }
    }
};
