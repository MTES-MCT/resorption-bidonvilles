<template>
    <div class="h-full">
        <Layout v-if="isLoading !== false">
            <template v-slot:header>
                <header>
                    <div
                        class="text-center text-primary text-display-md font-bold mt-16"
                    >
                        <Spinner />
                    </div>
                </header>
            </template>
        </Layout>

        <Layout v-else-if="error !== null">
            <template v-slot:header>
                <header>
                    <p class="text-center text-red text-display-lg mb-4">
                        {{ error }}
                    </p>
                </header>
            </template>
        </Layout>

        <LayoutForm v-else-if="town !== null" :town="town">
            <template v-slot:scroll>
                <FormMiseAJourDeSiteSectionHabitants
                    :town="town"
                    v-if="section === 'people'"
                />
                <FormMiseAJourDeSiteSectionConditionsDeVie
                    :town="town"
                    v-else-if="section === 'living_conditions'"
                />
            </template>
        </LayoutForm>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import store from "#src/store/index.js";
import router from "../../router";

import { Spinner } from "@resorptionbidonvilles/ui";
import Layout from "#src/js/components/Layout.vue";
import LayoutForm from "#src/js/components/LayoutForm.vue";
import FormMiseAJourDeSiteSectionHabitants from "#src/js/components/FormMiseAJourDeSiteSectionHabitants/FormMiseAJourDeSiteSectionHabitants.vue";
import FormMiseAJourDeSiteSectionConditionsDeVie from "#src/js/components/FormMiseAJourDeSiteSectionConditionsDeVie/FormMiseAJourDeSiteSectionConditionsDeVie.vue";

const town = ref(null);
const section = ref(null);
const error = ref(null);
const isLoading = ref(null);

onMounted(load);

async function load() {
    if (isLoading.value === true) {
        return;
    }
    isLoading.value = true;
    error.value = null;
    const townId = parseInt(router.currentRoute.value.params.id, 10);
    section.value = router.currentRoute.value.params.section_id;
    if (store.state.towns.state !== "loaded") {
        await store.dispatch("fetchTowns");
    }
    if (store.state.towns.hash[townId]) {
        town.value = store.state.towns.hash[townId];
        isLoading.value = false;
        return;
    }
    try {
        town.value = await store.dispatch("fetchShantytown", townId);
    } catch (err) {
        error.value = "Erreur: " + err.message;
    }
    isLoading.value = false;
}
</script>
