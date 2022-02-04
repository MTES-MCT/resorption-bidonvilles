<template>
    <PrivateLayout v-if="loading">
        <div class="text-center text-primary text-display-lg mt-16">
            <Spinner />
        </div>
    </PrivateLayout>

    <PrivateLayout v-else-if="error !== null">
        <LoadingError :retry="fetchData">
            {{ error }}
        </LoadingError>
    </PrivateLayout>

    <PrivateLayout v-else>
        <PrivateContainer class="py-10">
            <PlanDetailsHeader :plan="plan" @closePlan="closePlan" />
            <div class="flex pt-10 ">
                <PlanDetailsLeftColumn :plan="plan" class="leftColumnWidth" />
                <div class="flex-1">
                    <PlanDetailsPanelCharacteristics
                        :plan="plan"
                        class="mb-10"
                        id="characteristics"
                    />
                    <PlanDetailsPanelLocation
                        :plan="plan"
                        class="mb-10"
                        id="location"
                    />
                    <PlanDetailsPanelPeople
                        :plan="plan"
                        class="mb-10"
                        id="people"
                    />
                    <PlanDetailsPanelFinancial
                        :plan="plan"
                        class="mb-10"
                        id="financial"
                    />
                    <PlanDetailsPanelTeam
                        :plan="plan"
                        class="mb-10"
                        id="team"
                        v-if="plan.states.length > 0"
                    />
                    <PlanDetailsPanelAudience
                        :plan="plan"
                        class="mb-10"
                        id="audience"
                        v-if="plan.states.length > 0"
                    />
                    <PlanDetailsPanelDroitsCommuns
                        :plan="plan"
                        class="mb-10"
                        id="droits_communs"
                        v-if="plan.states.length > 0"
                    />
                    <PlanDetailsPanelSante
                        :plan="plan"
                        class="mb-10"
                        id="sante"
                        v-if="
                            plan.states.length > 0 && topics.includes('health')
                        "
                    />
                    <PlanDetailsPanelEducation
                        :plan="plan"
                        class="mb-10"
                        id="education"
                        v-if="
                            plan.states.length > 0 && topics.includes('school')
                        "
                    />
                    <PlanDetailsPanelEmploi
                        :plan="plan"
                        class="mb-10"
                        id="emploi"
                        v-if="plan.states.length > 0 && topics.includes('work')"
                    />
                    <PlanDetailsPanelLogement
                        :plan="plan"
                        class="mb-10"
                        id="logement"
                        v-if="
                            plan.states.length > 0 && topics.includes('housing')
                        "
                    />
                    <PlanDetailsPanelSecurisation
                        :plan="plan"
                        class="mb-10"
                        id="securisation"
                        v-if="
                            plan.states.length > 0 && topics.includes('safety')
                        "
                    />
                </div>
            </div>
        </PrivateContainer>
    </PrivateLayout>
</template>

<script>
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import PrivateLayout from "#app/components/PrivateLayout";
import LoadingError from "#app/components/PrivateLayout/LoadingError";
import PlanDetailsHeader from "./PlanDetailsHeader.vue";
import PlanDetailsLeftColumn from "./PlanDetailsLeftColumn.vue";
import PlanDetailsPanelCharacteristics from "./PlanDetailsPanelCharacteristics.vue";
import PlanDetailsPanelLocation from "./PlanDetailsPanelLocation.vue";
import PlanDetailsPanelPeople from "./PlanDetailsPanelPeople.vue";
import PlanDetailsPanelFinancial from "./PlanDetailsPanelFinancial.vue";
import PlanDetailsPanelTeam from "./PlanDetailsPanelTeam.vue";
import PlanDetailsPanelAudience from "./PlanDetailsPanelAudience.vue";
import PlanDetailsPanelDroitsCommuns from "./PlanDetailsPanelDroitsCommuns.vue";
import PlanDetailsPanelSante from "./PlanDetailsPanelSante.vue";
import PlanDetailsPanelEducation from "./PlanDetailsPanelEducation.vue";
import PlanDetailsPanelEmploi from "./PlanDetailsPanelEmploi.vue";
import PlanDetailsPanelLogement from "./PlanDetailsPanelLogement.vue";
import PlanDetailsPanelSecurisation from "./PlanDetailsPanelSecurisation.vue";
import { get } from "#helpers/api/plan";

export default {
    components: {
        PrivateLayout,
        PrivateContainer,
        PlanDetailsHeader,
        PlanDetailsLeftColumn,
        PlanDetailsPanelCharacteristics,
        PlanDetailsPanelLocation,
        PlanDetailsPanelPeople,
        PlanDetailsPanelFinancial,
        PlanDetailsPanelTeam,
        PlanDetailsPanelAudience,
        PlanDetailsPanelDroitsCommuns,
        PlanDetailsPanelSante,
        PlanDetailsPanelEducation,
        PlanDetailsPanelEmploi,
        PlanDetailsPanelLogement,
        PlanDetailsPanelSecurisation,
        LoadingError
    },

    data() {
        return {
            loading: false,
            error: null,
            plan: null
        };
    },

    computed: {
        topics() {
            if (!this.plan) {
                return [];
            }

            return this.plan.topics.map(({ uid }) => uid);
        }
    },

    watch: {
        "$route.params.id": function() {
            this.loading = false;
            this.fetchData();
        }
    },

    created() {
        this.fetchData();
    },

    methods: {
        async fetchData() {
            if (this.loading === true) {
                return;
            }

            this.loading = true;
            this.error = null;
            this.plan = null;

            try {
                this.plan = await get(this.$route.params.id);
                setTimeout(this.goToAnchor, 50);
            } catch (error) {
                this.error =
                    (error && error.user_message) ||
                    "Une erreur inconnue est survenue";
            }

            this.loading = false;
        },

        goToAnchor() {
            if (!this.$route.hash) {
                return;
            }

            const el = document.querySelector(this.$route.hash);
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
            }
        },

        closePlan() {
            console.log("fermeture");
        }
    }
};
</script>

<style scoped>
.leftColumnWidth {
    min-width: 300px;
    max-width: 300px;
    @apply pr-10;
}
</style>
