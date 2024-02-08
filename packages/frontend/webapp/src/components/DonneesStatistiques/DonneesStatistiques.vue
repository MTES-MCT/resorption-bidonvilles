<template>
    <ContentWrapper id="printable-content">
        <Title class="mt-6">Visualisation des données</Title>
        <Header
            class="mt-4"
            v-if="['loaded', 'refresh'].includes(metricsStore.nationStatus)"
        />

        <main class="mt-6">
            <ViewError v-if="metricsStore.error">
                <template v-slot:title>Collecte des données échouée</template>
                <template v-slot:content>{{ metricsStore.error }}</template>
                <template v-slot:actions
                    ><Button
                        type="button"
                        icon="rotate-right"
                        iconPosition="left"
                        @click="metricsStore.load"
                        >Réessayer</Button
                    >
                    <ButtonContact
                /></template>
            </ViewError>
            <Loading
                class="mt-6"
                v-else-if="metricsStore.nationStatus !== 'loaded'"
            />
            <template v-else>
                <Onglets :tabs="tabs" :activeTab="activeTab" />
                <Grille
                    class="mt-6"
                    :metrics="metricsStore.filteredMetrics"
                    :collapseByDefault="metricsStore.metrics.length > 1"
                />
            </template>
        </main>
    </ContentWrapper>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useMetricsStore } from "@/stores/metrics.store";

import { Button, ContentWrapper } from "@resorptionbidonvilles/ui";
import Title from "./Title.vue";
import Header from "./Header.vue";
import Onglets from "./DonneesStatistiquesDepartementOnglets.vue";
import Grille from "./Grille.vue";
import Loading from "@/components/Loading/Loading.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import ViewError from "@/components/ViewError/ViewError.vue";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";

const tabs = [
    {
        id: "tableau",
        label: "Tableau",
    },
];

const activeTab = ref("tableau");
const departementMetricsStore = useDepartementMetricsStore();
departementMetricsStore.activeTab = activeTab;
const metricsStore = useMetricsStore();
onMounted(metricsStore.load);
</script>
