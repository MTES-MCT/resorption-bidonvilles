<template>
    <PrivateLayout v-if="loading">
        <div class="text-center text-primary text-display-lg mt-16">
            <Spinner />
        </div>
    </PrivateLayout>
    <PrivateLayout v-else>
        <PrivateContainer v-if="town" class="py-10">
            <TownDetailsHeader :town="town" v-on:openCancel="openCancel" />
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
        <div class="bg-orange300 py-10">
            <PrivateContainer class="flex items-center">
                <div class="leftColumnWidth text-sm">
                    <div>
                        <Icon icon="exclamation-triangle" />
                    </div>
                    <div class="font-bold">
                        Quelles sont les règles de confidentialités ?
                    </div>
                    <div>
                        Merci de respecter les règles de confidentialité. Ne pas
                        citer l’identité des individus (Nom, âge, sexe,
                        origine…)
                    </div>
                </div>
                <TownDetailsNewComment
                    class="flex-1"
                    v-on:submit="town.comments.regular = $event"
                    id="newComment"
                    :user="user"
                />
            </PrivateContainer>
        </div>
        <div class="bg-orange100" v-if="town.comments.regular.length">
            <PrivateContainer class="flex" id="comments">
                <div class="leftColumnWidth" />
                <TownDetailsComments
                    class="flex-1"
                    :comments="town.comments.regular"
                />
            </PrivateContainer>
        </div>

        <!--  History sidebar -->
        <TownDetailsHistorySidebar
            :town="town"
            v-if="historyOpen"
            v-on:hideHistory="historyOpen = false"
        />
        <!--  Close Shantytown Modal -->
        <TownDetailsCloseModal
            :town="town"
            v-if="closeOpen"
            v-on:cancelCloseTown="closeOpen = false"
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
import TownDetailsHistorySidebar from "#app/pages/TownDetails/TownDetailsHistorySidebar";
import TownDetailsCloseModal from "#app/pages/TownDetails/TownDetailsCloseModal";

export default {
    components: {
        TownDetailsCloseModal,
        TownDetailsHistorySidebar,
        TownDetailsNewComment,
        TownDetailsComments,
        PrivateLayout,
        PrivateContainer,
        TownDetailsHeader,
        TownDetailsLeftColumn,
        TownDetailsPanelCharacteristics,
        TownDetailsPanelPeople,
        TownDetailsPanelLivingConditions,
        TownDetailsPanelJudicial
    },
    data() {
        const { field_types: fieldTypes, user } = getConfig();

        return {
            historyOpen: false,
            closeOpen: false,
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
            console.log("open history");
            this.historyOpen = true;
        },
        openCancel() {
            console.log("open cancel");
            this.closeOpen = true;
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
                    console.log(this.town);
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
