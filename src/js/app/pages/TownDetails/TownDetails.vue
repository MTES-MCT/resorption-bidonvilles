<template>
    <PrivateLayout v-if="loading">
        <div class="text-center text-primary text-display-lg mt-16">
            <Spinner />
        </div>
    </PrivateLayout>

    <PrivateLayout v-else-if="error !== null">
        <div class="text-center text-error text-primary text-display-lg mt-16">
            {{ error }}
        </div>
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
                    <div>
                        <Icon icon="exclamation-triangle" />
                    </div>
                    <div class="font-bold">
                        Quelles sont les règles de confidentialités ?
                    </div>
                    <div>
                        Ne pas citer l’identité des individus (Nom, âge, sexe,
                        origine…)
                    </div>
                </div>
                <TownDetailsNewComment
                    :class="[
                        'flex-1',
                        town.comments.regular.length === 0 && 'pb-32'
                    ]"
                    v-on:submit="town.comments.regular = $event"
                    id="newComment"
                    :user="user"
                    :nbComments="town.comments.regular.length"
                />
            </PrivateContainer>
        </div>
        <div
            :class="[
                'bg-orange200',
                'pt-10',
                town.comments.regular.length > 0 && 'pb-32'
            ]"
            v-if="town.comments.regular.length"
        >
            <PrivateContainer class="flex" id="comments">
                <div class="leftColumnWidth" />
                <TownDetailsComments
                    class="flex-1"
                    :comments="town.comments.regular"
                />
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
            v-on:updateTown="town = $event"
        />
        <!--  Close Shantytown Modal -->
        <TownDetailsCloseModal
            :town="town"
            :isOpen="closeOpen"
            v-on:closeModal="closeOpen = false"
            v-on:updateTown="town = $event"
        />
        <!--  Self themes modal -->
        <TownDetailsActorThemesModal
            v-if="actorThemesOpen"
            :town="town"
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
import { get as getConfig, getPermission } from "#helpers/api/config";
import TownDetailsNewComment from "./TownDetailsNewComment";
import TownDetailsComments from "./TownDetailsComments";
import TownDetailsHistorySidePanel from "./TownDetailsHistorySidePanel";
import TownDetailsCovidCommentsSidePanel from "./TownDetailsCovidCommentsSidePanel";
import TownDetailsActorAlert from "./TownDetailsActorAlert";
import TownDetailsCloseModal from "./TownDetailsCloseModal";
import TownDetailsActorThemesModal from "./TownDetailsActorThemesModal";
import TownDetailsInviteActorModal from "./TownDetailsInviteActorModal";
import { notify } from "#helpers/notificationHelper";
import { hasPermission } from "#helpers/api/config";

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
        TownDetailsInviteActorModal
    },
    data() {
        const permission = getPermission("shantytown.list");
        const { field_types: fieldTypes, user } = getConfig();

        return {
            historyOpen: false,
            closeOpen: false,
            covidOpen: false,
            actorThemesOpen: false,
            actorAlertVisible: true,
            inviteActorOpen: false,
            error: null,
            loading: false,
            fieldTypes,
            user,
            hasJusticePermission: permission.data_justice === true
        };
    },
    computed: {
        town() {
            return this.$store.state.detailedTown;
        },
        isNotAnActor() {
            return !this.town.actors.some(({ id }) => id === this.user.id);
        }
    },
    mounted() {
        this.$piwik?.trackEvent("Site", "Visite page site", this.$route.params.id);
    },
    created() {
        this.fetchData();
    },
    methods: {
        hasPermission,
        openActorThemes() {
            this.actorThemesOpen = true;
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
            } catch (error) {
                this.error =
                    (error && error.user_message) ||
                    "Une erreur inconnue est survenue";
            }

            this.loading = false;
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
