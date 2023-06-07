<template>
    <Layout>{{ JSON.stringify(metrics) }}</Layout>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useMetricsStore } from "@/stores/metrics.store.js";
import router from "@/helpers/router";

import Layout from "@/components/Layout/Layout.vue";

const metricsStore = useMetricsStore();
const isLoading = ref(null);
const error = ref(null);

const departementCode = computed(() => {
    return router.currentRoute.value.params.code;
});
const metrics = computed(() => {
    return metricsStore.departementMetrics[departementCode.value] || null;
});

onMounted(load);
watch(departementCode, load);

async function load() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        await metricsStore.fetchDepartement(departementCode.value);
    } catch (e) {
        error.value = e?.code || "Erreur inconnue";
    }

    isLoading.value = false;
}
</script>
