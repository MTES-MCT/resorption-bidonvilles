<template>
    <PrivateLayout v-if="loading">
        <div class="text-center text-primary text-display-lg font-bold mt-16">
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
            <PlanDetailsInfo />
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
                        v-if="
                            $store.getters['config/hasPermission'](
                                'plan_finances.access'
                            )
                        "
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
                        :audience="audience"
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
                    <PlanDetailsPanelMarks
                        :planId="plan.id"
                        v-if="plan.states.length === 0 && plan.canUpdateMarks"
                    />
                </div>
            </div>
        </PrivateContainer>
        <div v-if="$store.getters['config/hasPermission']('plan_comment.list')">
            <div class="bg-green100 py-10 mt-8 border">
                <PrivateContainer class="flex items-center">
                    <div class="leftColumnWidth text-sm">
                        <NewCommentLeftColumn
                            class="mb-4"
                            icon="info-circle"
                            title="À qui sont destinés les messages ?"
                            description="À tous les acteurs concernés par l'action. Un mail est automatiquement envoyé aux opérateurs ou services en charge de l'action et aux acteurs en DDETS et Préfecture."
                        ></NewCommentLeftColumn>
                        <NewCommentLeftColumn
                            icon="exclamation-triangle"
                            title="Quelles sont les règles de confidentialités ?"
                            description="Ne pas citer l’identité des individus (nom, âge, sexe, origine…), ni les infos relatives à d'éventuelles condamnations judiciaires. Ne pas tenir de propos à visée insultante, discriminatoire, raciste…"
                        ></NewCommentLeftColumn>
                    </div>
                    <PlanDetailsNewComment
                        :class="[
                            'flex-1',
                            plan.comments.length === 0 && 'pb-32'
                        ]"
                        id="comment"
                        :departementCode="plan.departement.code"
                        :nbComments="plan.comments.length"
                    />
                </PrivateContainer>
            </div>

            <div
                :class="[
                    'bg-green100',
                    'pt-10',
                    plan.comments.length > 0 && 'pb-32'
                ]"
                v-if="plan.comments.length > 0"
            >
                <PrivateContainer class="flex" id="comments">
                    <div class="leftColumnWidth" />
                    <PlanDetailsComments
                        :comments="plan.comments"
                    ></PlanDetailsComments>
                </PrivateContainer>
            </div>
        </div>

        <!--  Close Shantytown Modal -->
        <PlanDetailsCloseModal
            :plan="plan"
            :audience="audience"
            :isOpen="showCloseModal"
            @closeModal="showCloseModal = false"
        />
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
import PlanDetailsPanelMarks from "./PlanDetailsPanelMarks.vue";
import PlanDetailsInfo from "./PlanDetailsInfo.vue";
import PlanDetailsCloseModal from "./PlanDetailsCloseModal.vue";
import { get } from "#helpers/api/plan";
import PlanDetailsNewComment from "./PlanDetailsNewComment.vue";
import PlanDetailsComments from "./PlanDetailsComments.vue";
import NewCommentLeftColumn from "#app/components/NewCommentLeftColumn/NewCommentLeftColumn.vue";

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
        PlanDetailsPanelMarks,
        PlanDetailsInfo,
        PlanDetailsCloseModal,
        LoadingError,
        PlanDetailsNewComment,
        PlanDetailsComments,
        NewCommentLeftColumn
    },

    data() {
        return {
            loading: false,
            error: null,
            showCloseModal: false
        };
    },

    computed: {
        plan() {
            return this.$store.state.plans.detailedPlan;
        },
        topics() {
            if (!this.plan) {
                return [];
            }

            return this.plan.topics.map(({ uid }) => uid);
        },
        audience() {
            if (!this.plan || this.plan.states.length === 0) {
                return null;
            }

            function sum(originalObj, additionalObj) {
                return {
                    total: originalObj.total + additionalObj.total,
                    families: originalObj.families + additionalObj.families,
                    women: originalObj.women + additionalObj.women,
                    minors: originalObj.minors + additionalObj.minors
                };
            }

            return this.plan.states.reduce(
                (acc, { audience }) => {
                    if (audience.in) {
                        acc.in = sum(acc.in, audience.in);
                    }

                    if (audience.out_positive) {
                        acc.out_positive = sum(
                            acc.out_positive,
                            audience.out_positive
                        );
                    }

                    if (audience.out_abandoned) {
                        acc.out_abandoned = sum(
                            acc.out_abandoned,
                            audience.out_abandoned
                        );
                    }

                    if (audience.out_excluded) {
                        acc.out_excluded = sum(
                            acc.out_excluded,
                            audience.out_excluded
                        );
                    }

                    return acc;
                },
                {
                    in: {
                        total: 0,
                        families: 0,
                        women: 0,
                        minors: 0
                    },
                    out_positive: {
                        total: 0,
                        families: 0,
                        women: 0,
                        minors: 0
                    },
                    out_abandoned: {
                        total: 0,
                        families: 0,
                        women: 0,
                        minors: 0
                    },
                    out_excluded: {
                        total: 0,
                        families: 0,
                        women: 0,
                        minors: 0
                    }
                }
            );
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
                const plan = await get(this.$route.params.id);
                if (!plan) {
                    throw {
                        user_message:
                            "Cette action n'existe pas, ou son accès vous est interdit"
                    };
                }
                await this.$store.commit("setDetailedPlan", plan);
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
            this.showCloseModal = true;
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
