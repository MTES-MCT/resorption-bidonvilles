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

        <Layout v-else-if="loadingError !== null">
            <template v-slot:header>
                <header>
                    <p class="text-center text-red text-display-lg mb-4">
                        {{ loadingError }}
                    </p>
                </header>
            </template>
        </Layout>

        <LayoutForm v-else-if="town !== null" :backUrl="`/site/${town.id}`">
            <template v-slot:title
                >{{ town.addressSimple }} <br />
                <span v-if="town.name" class="text-sm font-normal">
                    « {{ town.name }} »</span
                ></template
            >
            <template v-slot:back> Revenir au site </template>
            <template v-slot:validate> Mettre à jour le site </template>

            <template v-slot:scroll>
                <FormMiseAJourDeSite :section="section" :town="town" />
            </template>
        </LayoutForm>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import store from "#src/store/index.js";
import router from "../../router";

import { Spinner } from "@resorptionbidonvilles/ui";
import Layout from "#src/js/components/Layout.vue";
import LayoutForm from "#src/js/components/LayoutForm.vue";
import FormMiseAJourDeSite from "../../components/FormMiseAJourSectionDeSite/FormMiseAJourDeSite.vue";

const town = ref(null);
const loadingError = ref(null);
const isLoading = ref(null);

onMounted(async () => {
    await load();
});

const section = computed(() => {
    return router.currentRoute.value.params.section_id;
});

async function load() {
    if (isLoading.value === true) {
        return;
    }
    isLoading.value = true;
    loadingError.value = null;
    const townId = parseInt(router.currentRoute.value.params.id, 10);
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
        loadingError.value = "Erreur: " + err.message;
    }
    isLoading.value = false;
}
</script>
