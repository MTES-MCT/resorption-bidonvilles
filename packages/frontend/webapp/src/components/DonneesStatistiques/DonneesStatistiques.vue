<template>
    <ContentWrapper>
        <FilArianne />
        <Title class="mt-6">Données statistiques et cartographiques</Title>
        <Header
            class="mt-4"
            v-if="['loaded', 'refresh'].includes(metricsStore.nationStatus)"
        />

        <main class="mt-6">
            <template v-if="metricsStore.nationStatus === 'loaded'">
                <Vues />
                <Grille class="mt-6" :metrics="metricsStore.metrics" />
            </template>
            <Loading class="mt-6" v-else />
        </main>
    </ContentWrapper>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useMetricsStore } from "@/stores/metrics.store";

import FilArianne from "./FilArianne.vue";
import Title from "./Title.vue";
import Header from "./Header.vue";
import Vues from "./Vues.vue";
import Grille from "./Grille.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import Loading from "@/components/Loading/Loading.vue";

const metricsStore = useMetricsStore();

onMounted(() => {
    const from = ref(new Date());
    const to = ref(new Date());
    metricsStore.load(from.value, to.value);
});
</script>
