<template>
    <ContentWrapper>
        <FilArianne />
        <Title class="mt-6">Données statistiques et cartographiques</Title>
        <Header class="mt-4" />

        <main class="mt-6">
            <Vues />
            <Grille
                class="mt-6"
                v-if="metricsStore.isLoading === false"
                :metrics="metricsStore.metrics"
            />
            <Loading class="mt-6" v-else />
        </main>
    </ContentWrapper>
</template>

<script setup>
import { onMounted } from "vue";
import { useMetricsStore } from "@/stores/metrics.store";

import FilArianne from "./FilArianne.vue";
import Title from "./Title.vue";
import Header from "./Header.vue";
import Vues from "./Vues.vue";
import Grille from "./Grille.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import Loading from "@/components/Loading/Loading.vue";

const metricsStore = useMetricsStore();
onMounted(metricsStore.load);
</script>
