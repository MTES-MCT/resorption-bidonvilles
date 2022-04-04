<template>
    <div
        :class="[
            'rounded-sm cursor-pointer border border-cardBorder',
            isHover ? 'bg-blue200 border-transparent' : ''
        ]"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
        @click="routeToPlan"
    >
        <div class="-mt-1">
            <div class="mb-4 px-6">
                <Tag
                    :class="[
                        'text-xs uppercase text-primary',
                        isHover ? 'shadow-md' : ''
                    ]"
                >
                    <span v-if="plan.expected_to_end_at"
                        >du {{ formatDate(plan.started_at) }} au
                        {{ formatDate(plan.expected_to_end_at) }}</span
                    >
                    <span v-else>
                        depuis le {{ formatDate(plan.started_at) }}
                    </span>
                </Tag>
            </div>

            <template>
                <div class="text-md px-6">
                    <div class="text-display-md">
                        <span class="font-bold">
                            {{ plan.name }}
                        </span>
                    </div>
                </div>
            </template>

            <template>
                <!-- Début des colonnes -->
                <div class="md:grid cardGridTemplateColumns gap-10 px-6 py-4">
                    <!-- 1ère colonne -->
                    <PlanCardInterventionTopicColumn :topics="plan.topics">
                    </PlanCardInterventionTopicColumn>

                    <!-- 2ème colonne -->
                    <PlanCardDepartementColumn :departement="plan.departement">
                    </PlanCardDepartementColumn>

                    <!-- 3ème colonne -->
                    <PlanCardLocationColumn :plan="plan">
                    </PlanCardLocationColumn>

                    <!-- 4ème colonne -->
                    <PlanCardPiloteColumn
                        :government_contact="plan.government_contacts[0]"
                    >
                    </PlanCardPiloteColumn>

                    <!-- 5ème colonne -->
                    <PlanCardOperatorColumn
                        :operator_contact="plan.operator_contacts[0]"
                    >
                    </PlanCardOperatorColumn>

                    <!-- fin des colonnes -->
                </div>
                <div class="flex justify-end px-4 pt-4">
                    <div>
                        <Button
                            variant="primaryText"
                            icon="arrow-right"
                            class="text-display-sm hover:underline -mb-1"
                        >
                            Voir la fiche de l'action
                        </Button>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import PlanCardDepartementColumn from "./PlanCardDepartementColumn.vue";
import PlanCardInterventionTopicColumn from "./PlanCardInterventionTopicColumn.vue";
import PlanCardLocationColumn from "./PlanCardLocationColumn.vue";
import PlanCardPiloteColumn from "./PlanCardPiloteColumn.vue";
import PlanCardOperatorColumn from "./PlanCardOperatorColumn.vue";

const moment = require("moment");

export default {
    props: {
        plan: {
            type: Object
        }
    },
    data() {
        return {
            isHover: false
        };
    },
    components: {
        PlanCardDepartementColumn,
        PlanCardInterventionTopicColumn,
        PlanCardLocationColumn,
        PlanCardPiloteColumn,
        PlanCardOperatorColumn
    },
    methods: {
        /**
         * Redirects to a plan's details page
         *
         * @param {Object}
         */
        routeToPlan() {
            this.$router.push(`/action/${this.plan.id}`);
        },
        formatDate(value) {
            const date = new Date();
            date.setTime(value);
            return moment(date).format("DD/MM/YYYY");
        }
    }
};
</script>

<style scoped lang="scss">
.cardGridTemplateColumns {
    grid-template-columns: 222px 208px 164px 200px auto;
}
</style>
