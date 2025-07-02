<template>
    <ContentWrapper id="printable-content">
        <Title class="mt-6">Visualisation des données</Title>
        <Header
            class="mt-4"
            v-if="['loaded', 'refresh'].includes(metricsStore.nationStatus)"
        />

        <main class="mt-6">
            <FiltrageTemporel class="mt-5" v-model="dateRange" />
            <!-- <ViewError v-if="metricsStore.error">
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
            </ViewError> -->
            <Loading
                class="mt-6"
                v-if="metricsStore.nationStatus !== 'loaded'"
            />
            <template v-else>
                <Onglets
                    :tabs="tabs"
                    :activeTab="activeTab"
                    @click="changeActiveTab"
                />
                <Grille
                    v-if="activeTab === 'tableau'"
                    class="mt-6"
                    :metrics="metricsStore.filteredMetrics"
                    :collapseByDefault="metricsStore.metrics.length > 1"
                />
                <EvolutionNationale
                    v-if="activeTab === 'evolution'"
                    class="pt-6"
                />
            </template>
        </main>
    </ContentWrapper>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useMetricsStore } from "@/stores/metrics.store";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";

import FiltrageTemporel from "../DonneesStatistiquesDepartement/components/header/FiltrageTemporel.vue";
import { Button, ContentWrapper } from "@resorptionbidonvilles/ui";
import Title from "./Title.vue";
import Header from "./Header.vue";
import Onglets from "./DonneesStatistiquesDepartementOnglets.vue";
import Grille from "./Grille.vue";
import EvolutionNationale from "./EvolutionNationale.vue";
import Loading from "@/components/Loading/Loading.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import ViewError from "@/components/ViewError/ViewError.vue";

const activeTab = ref("tableau");
const departementMetricsStore = useDepartementMetricsStore();
departementMetricsStore.activeTab = activeTab;
const metricsStore = useMetricsStore();
const userStore = useUserStore();

const tabs = [
    {
        id: "tableau",
        label: "Tableau",
    },
];

if (userStore.user.intervention_areas.is_national) {
    tabs.push({
        id: "evolution",
        label: "Évolution",
    });
}

onMounted(() => {
    metricsStore.load();
});

const changeActiveTab = (tab) => {
    if (tab.target.id === "evolution") {
        departementMetricsStore.activeTab = tab.target.id;
    }
};
</script>
