<template>
    <LayoutLoading v-if="isLoading !== false" />

    <LayoutError v-else-if="error !== null">
        <template v-slot:title>Statistiques inaccessibles</template>
        <template v-slot:code>{{ error }}</template>
        <template v-slot:content
            >Vous souhaitiez consulter les données statistiques d'une commune,
            mais nous ne parvenons pas à collecter les informations nécessaires.
            Vous pouvez réessayer un peu plus tard ou nous contacter en cas
            d'urgence.</template
        >
        <template v-slot:actions>
            <Button
                icon="rotate-right"
                iconPosition="left"
                type="button"
                @click="load"
                >Réessayer</Button
            >
            <ButtonContact />
        </template>
    </LayoutError>

    <Layout v-else>
        <ContentWrapper>
            <DonneesStatistiquesCommune :city="city" :metrics="metrics" />
        </ContentWrapper>
    </Layout>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useMetricsStore } from "@/stores/metrics.store.js";
import router from "@/helpers/router";

import { Button } from "@resorptionbidonvilles/ui";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import Layout from "@/components/Layout/Layout.vue";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import DonneesStatistiquesCommune from "@/components/DonneesStatistiquesCommune/DonneesStatistiquesCommune.vue";

const metricsStore = useMetricsStore();
const isLoading = ref(null);
const error = ref(null);

const cityCode = computed(() => {
    return router.currentRoute.value.params.code;
});
const city = computed(() => {
    return metricsStore.metricsByCity[cityCode.value]?.city || null;
});
const metrics = computed(() => {
    return metricsStore.metricsByCity[cityCode.value]?.metrics || null;
});

onMounted(load);
watch(cityCode, load);

async function load() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        await metricsStore.fetchCity(cityCode.value);
    } catch (e) {
        error.value = e?.code || "Erreur inconnue";
    }

    isLoading.value = false;
}
</script>
