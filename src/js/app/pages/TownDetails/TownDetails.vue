<template>
    <PrivateLayout>
        <PrivateContainer v-if="town" class="py-10">
            <TownDetailsHeader :town="town" />
            <div class="flex pt-10 ">
                <TownDetailsLeftColumn :town="town" />
                <div class="flex-1">
                    <TownDetailsPanelCharacteristics
                        :town="town"
                        class="mb-10"
                    />
                    <TownDetailsPanelPeople :town="town" class="mb-10" />
                    <TownDetailsPanelLivingConditions
                        :town="town"
                        class="mb-10"
                    />
                    <TownDetailsPanelJudicial :town="town" class="mb-10" />
                </div>
            </div>
        </PrivateContainer>
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

export default {
    components: {
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
