<template>
    <PrivateLayout>
        <div
            v-if="loading"
            class="text-center text-primary text-display-lg mt-16"
        >
            <Spinner />
        </div>
        <div v-else>
            <div class="bg-G100 py-8">
                <PrivateContainer class="flex justify-between items-baseline">
                    <div class="text-display-lg">Déclarer un site</div>
                    <div>
                        <Button variant="primaryText">Annuler</Button>
                        <Button class="ml-5">Déclarer le site</Button>
                    </div>
                </PrivateContainer>
            </div>

            <PrivateContainer class="flex pt-10">
                <TownCreateLeftColumn class="leftColumnWidth" />
                <div class="flex-1">
                    <TownCreatePanelInfo></TownCreatePanelInfo>

                    <TownCreatePanelLocation
                        v-model="town.location"
                    ></TownCreatePanelLocation>

                    <TownCreatePanelCharacteristics
                        class="mt-10"
                        id="characteristics"
                        v-model="town.characteristics"
                    ></TownCreatePanelCharacteristics>

                    <TownCreatePanelPeople
                        class="mt-10"
                        id="people"
                        v-model="town.people"
                    ></TownCreatePanelPeople>

                    <TownCreatePanelLivingConditions
                        class="mt-10"
                        id="living_conditions"
                        v-model="town.living_conditions"
                    ></TownCreatePanelLivingConditions>

                    <TownCreatePanelJudicial
                        class="my-10"
                        id="judicial"
                        v-model="town.judicial"
                    ></TownCreatePanelJudicial>
                </div>
            </PrivateContainer>
        </div>
    </PrivateLayout>
</template>

<script>
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import PrivateLayout from "#app/components/PrivateLayout";
import TownCreatePanelInfo from "./TownCreatePanelInfo";
import TownCreatePanelLocation from "./TownCreatePanelLocation";
import TownCreatePanelCharacteristics from "./TownCreatePanelCharacteristics";
import TownCreatePanelPeople from "./TownCreatePanelPeople";
import TownCreatePanelLivingConditions from "./TownCreatePanelLivingConditions";
import TownCreatePanelJudicial from "./TownCreatePanelJudicial";
import TownCreateLeftColumn from "./TownCreateLeftColumn";
import { get as getConfig } from "#helpers/api/config";

export default {
    components: {
        PrivateLayout,
        PrivateContainer,
        TownCreateLeftColumn,
        TownCreatePanelInfo,
        TownCreatePanelLocation,
        TownCreatePanelCharacteristics,
        TownCreatePanelPeople,
        TownCreatePanelLivingConditions,
        TownCreatePanelJudicial
    },

    data() {
        const { field_types: fieldTypes, user } = getConfig();

        return {
            error: null,
            loading: false,
            town: {
                location: {
                    address: {
                        label: undefined,
                        citycode: undefined
                    },
                    name: undefined,
                    coordinates: undefined
                },
                characteristics: {
                    created_at: undefined,
                    declared_at: undefined,
                    field_type: undefined,
                    address_details: undefined,
                    owner_type: undefined,
                    owner: undefined
                },
                people: {
                    population: {
                        populationTotal: undefined,
                        populationFamilies: undefined,
                        populationMinors: undefined
                    },
                    social_origins: [],
                    census_status: undefined,
                    census_conducted_at: undefined,
                    census_conducted_by: undefined
                },
                living_conditions: {
                    access_to_water: undefined,
                    water_comments: undefined,
                    electricity_type: undefined,
                    electricity_comments: undefined,
                    access_to_sanitary: undefined,
                    sanitary_comments: undefined,
                    trash_evacuation: undefined
                },
                judicial: {
                    owner_complaint: undefined,
                    justice_procedure: undefined,
                    justice_rendered: undefined,
                    justice_rendered_at: undefined,
                    justice_rendered_by: undefined,
                    justice_challenged: undefined,
                    police_status: undefined,
                    police_requested_at: undefined,
                    police_granted_at: undefined,
                    bailiff: undefined
                }
            },
            fieldTypes,
            user
        };
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
