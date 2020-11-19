<template>
    <PrivateLayout v-if="loading">
        <div class="text-center text-primary text-display-lg mt-16">
            <Spinner />
        </div>
    </PrivateLayout>
    <PrivateLayout v-else>
        <PrivateContainer v-if="town" class="py-10">
            <TownDetailsHeader :town="town" />
            <div class="flex pt-10 ">
                <TownDetailsLeftColumn :town="town" class="leftColumnWidth" />
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
        <div class="bg-orange300">
            <PrivateContainer class="flex">
                <div class="leftColumnWidth" />
                <TownDetailsNewComment class="flex-1" />
            </PrivateContainer>
        </div>
        <div class="bg-orange100">
            <PrivateContainer class="flex">
                <div class="leftColumnWidth" />
                <TownDetailsComments class="flex-1" />
            </PrivateContainer>
        </div>
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

export default {
    components: {
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
        const { field_types: fieldTypes } = getConfig();

        return {
            error: null,
            loading: false,
            town: null,
            fieldTypes
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
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
}
</style>
