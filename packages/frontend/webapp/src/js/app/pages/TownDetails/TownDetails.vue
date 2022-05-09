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
        <PrivateContainer v-if="town" class="py-10">
            <TownDetailsHeader
                :town="town"
                v-on:openCancel="openCancel"
                v-on:openCovid="openCovid"
                v-on:deleteTown="deleteTown"
            />
            <div class="flex pt-10 ">
                <TownDetailsLeftColumn
                    :hasJusticePermission="hasJusticePermission"
                    :town="town"
                    :nbComments="comments.length"
                    class="leftColumnWidth"
                    v-on:openHistory="openHistory"
                />
                <div class="flex-1">
                    <TownDetailsActorAlert
                        v-if="
                            isNotAnActor && actorAlertVisible && !town.closedAt
                        "
                        @click="openActorThemes"
                        @close="actorAlertVisible = false"
                    ></TownDetailsActorAlert>
                    <TownDetailsPanelCharacteristics
                        :town="town"
                        class="mb-10"
                        id="characteristics"
                    />
                    <TownDetailsPanelPlans
                        v-if="town.plans.length"
                        :town="town"
                        class="mb-10"
                        id="plans"
                    />
                    <TownDetailsPanelPeople
                        :town="town"
                        class="mb-10"
                        id="people"
                    />
                    <TownDetailsPanelLivingConditions
                        :town="town"
                        class="mb-10"
                        id="living_conditions"
                    />
                    <TownDetailsPanelJudicial
                        v-if="hasJusticePermission"
                        :town="town"
                        class="mb-10"
                        id="judicial"
                    />
                    <TownDetailsPanelActors
                        class="mb-10"
                        id="intervenants"
                        @click="openActorThemes"
                        @showThemesModal="openActorThemes"
                        @showInviteActorModal="openInviteActorModal"
                    />
                </div>
            </div>
        </PrivateContainer>
        <div class="bg-orange200 py-10">
            <PrivateContainer class="flex items-center">
                <div class="leftColumnWidth text-sm">
                    <TownDetailsNewCommentLeftColumn
                        class="mb-4"
                        icon="info-circle"
                        title="À qui sont destinés les messages ?"
                        description="À tous les acteurs du site. Un mail est automatiquement envoyé aux personnes signalées « intervenant sur ce site», aux acteurs en DDETS, Préfecture et la Dihal."
                    ></TownDetailsNewCommentLeftColumn>
                    <TownDetailsNewCommentLeftColumn
                        icon="exclamation-triangle"
                        title="Quelles sont les règles de confidentialités ?"
                        description="Ne pas citer l’identité des individus (Nom, âge, sexe, origine…)"
                    ></TownDetailsNewCommentLeftColumn>
                </div>
                <TownDetailsNewComment
                    :class="['flex-1', comments.length === 0 && 'pb-32']"
                    id="newComment"
                    :user="user"
                    :nbComments="comments.length"
                />
            </PrivateContainer>
        </div>
        <div
            :class="['bg-orange200', 'pt-10', comments.length > 0 && 'pb-32']"
            v-if="comments.length"
        >
            <PrivateContainer class="flex" id="comments">
                <div class="leftColumnWidth" />
                <TownDetailsComments class="flex-1" :comments="comments" />
            </PrivateContainer>
        </div>

        <!--  History sidepanel -->
        <TownDetailsHistorySidePanel
            :town="town"
            :isOpen="historyOpen"
            :closePanel="() => (historyOpen = false)"
        />
        <!--  CovidComments sidepanel -->
        <TownDetailsCovidCommentsSidePanel
            :town="town"
            :isOpen="covidOpen"
            :closePanel="() => (covidOpen = false)"
        />
        <!--  Close Shantytown Modal -->
        <TownDetailsCloseModal
            :town="town"
            :isOpen="closeOpen"
            v-on:closeModal="closeOpen = false"
        />
        <!--  Self themes modal -->
        <TownDetailsActorThemesModal
            v-if="actorThemesOpen"
            :town="town"
            :variant="actorThemesVariant"
            @closeModal="actorThemesOpen = false"
        />
        <!--  Invite actor modal -->
        <TownDetailsInviteActorModal
            :townId="town.id"
            :isOpen="inviteActorOpen"
            @closeModal="inviteActorOpen = false"
        />
    </PrivateLayout>
</template>

<script>
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import PrivateLayout from "#app/components/PrivateLayout";
import { destroy as deleteTown } from "#helpers/api/town";
import TownDetailsHeader from "./TownDetailsHeader";
import TownDetailsLeftColumn from "./TownDetailsLeftColumn";
import TownDetailsPanelCharacteristics from "./TownDetailsPanelCharacteristics";
import TownDetailsPanelPeople from "./TownDetailsPanelPeople";
import TownDetailsPanelLivingConditions from "./TownDetailsPanelLivingConditions";
import TownDetailsPanelJudicial from "./TownDetailsPanelJudicial";
import TownDetailsPanelPlans from "./TownDetailsPanelPlans";
import TownDetailsPanelActors from "./TownDetailsPanelActors";
import TownDetailsNewComment from "./TownDetailsNewComment";
import TownDetailsComments from "./TownDetailsComments";
import TownDetailsNewCommentLeftColumn from "./TownDetailsNewCommentLeftColumn";
import TownDetailsHistorySidePanel from "./TownDetailsHistorySidePanel";
import TownDetailsCovidCommentsSidePanel from "./TownDetailsCovidCommentsSidePanel";
import TownDetailsActorAlert from "./TownDetailsActorAlert";
import TownDetailsCloseModal from "./TownDetailsCloseModal";
import TownDetailsActorThemesModal from "./TownDetailsActorThemesModal";
import TownDetailsInviteActorModal from "./TownDetailsInviteActorModal";
import LoadingError from "#app/components/PrivateLayout/LoadingError";
import { notify } from "#helpers/notificationHelper";

export default {
    components: {
        TownDetailsActorAlert,
        TownDetailsPanelActors,
        TownDetailsCloseModal,
        TownDetailsActorThemesModal,
        TownDetailsHistorySidePanel,
        TownDetailsNewComment,
        TownDetailsComments,
        PrivateLayout,
        PrivateContainer,
        TownDetailsHeader,
        TownDetailsLeftColumn,
        TownDetailsPanelCharacteristics,
        TownDetailsPanelPeople,
        TownDetailsPanelLivingConditions,
        TownDetailsPanelJudicial,
        TownDetailsPanelPlans,
        TownDetailsCovidCommentsSidePanel,
        TownDetailsInviteActorModal,
        TownDetailsNewCommentLeftColumn,
        LoadingError
    },
    data() {
        return {
            historyOpen: false,
            closeOpen: false,
            covidOpen: false,
            actorThemesOpen: false,
            actorThemesVariant: "default",
            actorAlertVisible: true,
            inviteActorOpen: false,
            error: null,
            loading: false
        };
    },
    computed: {
        user() {
            return this.$store.state.config.configuration.user;
        },
        fieldTypes() {
            return this.$store.state.config.configuration.field_types;
        },
        hasJusticePermission() {
            return (
                this.$store.getters["config/getPermission"](
                    "shantytown_justice.access"
                ) !== null
            );
        },
        comments() {
            if (!this.town) {
                return [];
            }

            return [
                ...this.town.comments.regular,
                ...this.town.comments.covid
            ].sort((a, b) => b.createdAt - a.createdAt);
        },
        town() {
            return this.$store.state.detailedTown;
        },
        isNotAnActor() {
            return !this.town.actors.some(({ id }) => id === this.user.id);
        }
    },
    mounted() {
        this.$trackMatomoEvent(
            "Site",
            "Visite page site",
            `S${this.$route.params.id}`
        );

        if (this.$route.query.action === "new_actor") {
            this.openActorThemes("detailed");
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        openActorThemes(variant = "default") {
            this.actorThemesOpen = true;
            this.actorThemesVariant = variant;
        },
        openInviteActorModal() {
            this.inviteActorOpen = true;
        },
        openHistory() {
            this.historyOpen = true;
        },
        openCancel() {
            this.closeOpen = true;
        },
        openCovid() {
            this.covidOpen = true;
        },
        deleteTown() {
            if (
                !confirm(
                    "Êtes-vous sûr(e) de vouloir supprimer définitivement ce site ? Cette suppression est irréversible."
                )
            ) {
                return;
            }

            deleteTown(this.$route.params.id)
                .then(() => {
                    notify({
                        group: "notifications",
                        type: "success",
                        title: "Succès",
                        text: "Le site a été supprimé définitivement de la base"
                    });
                    this.$router.replace("/liste-des-sites");
                })
                .catch(error => {
                    alert(error.user_message);
                });
        },
        async fetchData() {
            if (this.loading === true) {
                return;
            }

            this.loading = true;
            this.error = null;

            try {
                await this.$store.dispatch(
                    "fetchTownDetails",
                    this.$route.params.id
                );
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
        }
    },
    watch: {
        "$route.params.id": function() {
            this.fetchData();
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
