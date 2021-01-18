<template>
    <PrivateLayout v-if="loading">
        <div class="text-center text-primary text-display-lg mt-16">
            <Spinner />
        </div>
    </PrivateLayout>
    <PrivateLayout v-else>
        <PrivateContainer v-if="town" class="py-10">
            <TownDetailsHeader
                :town="town"
                v-on:openCancel="openCancel"
                v-on:openCovid="openCovid"
            />
            <div class="flex pt-10 ">
                <TownDetailsLeftColumn
                    :town="town"
                    class="leftColumnWidth"
                    v-on:openHistory="openHistory"
                />
                <div class="flex-1">
                    <TownDetailsPanelCharacteristics
                        :town="town"
                        class="mb-10"
                        id="characteristics"
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
                        :town="town"
                        class="mb-10"
                        id="judicial"
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
                'bg-orange100',
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
    </PrivateLayout>
</template>

<script>
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import PrivateLayout from "#app/components/PrivateLayout";
import { get } from "#helpers/api/town";
import TownDetailsHeader from "./TownDetailsHeader";
import TownDetailsLeftColumn from "./TownDetailsLeftColumn";
import TownDetailsPanelCharacteristics from "./TownDetailsPanelCharacteristics";
import TownDetailsPanelPeople from "./TownDetailsPanelPeople";
import TownDetailsPanelLivingConditions from "./TownDetailsPanelLivingConditions";
import TownDetailsPanelJudicial from "./TownDetailsPanelJudicial";
import enrichShantytown from "#app/pages/TownsList/enrichShantytown";
import { get as getConfig } from "#helpers/api/config";
import TownDetailsNewComment from "./TownDetailsNewComment";
import TownDetailsComments from "./TownDetailsComments";
import TownDetailsHistorySidePanel from "./TownDetailsHistorySidePanel";
import TownDetailsCovidCommentsSidePanel from "./TownDetailsCovidCommentsSidePanel";
import TownDetailsCloseModal from "./TownDetailsCloseModal";

export default {
    components: {
        TownDetailsCloseModal,
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
        TownDetailsCovidCommentsSidePanel
    },
    data() {
        const { field_types: fieldTypes, user } = getConfig();

        return {
            historyOpen: false,
            closeOpen: false,
            covidOpen: false,
            error: null,
            loading: false,
            town: null,
            fieldTypes,
            user
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        openHistory() {
            this.historyOpen = true;
        },
        openCancel() {
            this.closeOpen = true;
        },
        openCovid() {
            this.covidOpen = true;
        },
        fetchData() {
            if (this.loading === true) {
                return;
            }

            this.loading = true;
            this.error = null;

            get(this.$route.params.id)
                .then(town => {
                    this.loading = false;
                    this.town = enrichShantytown(town, this.fieldTypes);
                    this.resetEdit();
                })
                .catch(errors => {
                    this.error = errors.user_message;
                    this.loading = false;
                });
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
