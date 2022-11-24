<template>
    <ContentWrapper>
        <ViewHeader icon="chart-simple" :responsive="true">
            <template v-slot:title>Statistiques</template>
            <template v-slot:description
                >Consultez la situation des bidonvilles en France, ainsi que les
                statistiques d'utilisation de la plateforme.</template
            >
        </ViewHeader>

        <ArrangementLeftMenu :tabs="tabs" :activeTab="currentTabId">
            <template v-slot:menuTitle>Territoires</template>

            <header class="flex justify-between">
                <div>
                    <h2>Vous consultez les chiffres pour le territoire</h2>
                    <h1 class="text-4xl font-bold text-primary">
                        {{ currentTab.label }}
                    </h1>
                </div>
                <div>
                    <Button
                        icon="print"
                        iconPosition="left"
                        variant="primaryOutline"
                        class="print:hidden"
                        @click="print"
                        >Imprimer</Button
                    >
                    <Button
                        v-if="userStore.user?.is_superuser"
                        icon="file-excel"
                        iconPosition="left"
                        :loading="exportLoading"
                        variant="primary"
                        class="print:hidden ml-4"
                        @click="exportCSV"
                        >Exporter</Button
                    >
                </div>
            </header>

            <Loading class="py-28" v-if="isLoading !== false" />
            <ViewError v-else-if="error">
                <template v-slot:title
                    >Échec de la collecte des données</template
                >
                <template v-slot:code>{{ error }}</template>
                <template v-slot:content
                    >Une erreur est survenue lors de la collecte des données
                    statistiques pour ce territoire. Vous pouvez réessayer un
                    peu plus tard ou nous contacter.</template
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
            </ViewError>
            <template v-else>
                <StatistiquesMetriquesPrincipales class="mt-4" :stats="stats" />
                <StatistiquesSites class="mt-8" :stats="stats" />
                <StatistiquesHabitants class="mt-8" :stats="stats" />
                <StatistiquesActions class="mt-8" :stats="stats" />
                <StatistiquesUtilisateurs class="mt-8" :stats="stats" />
            </template>
        </ArrangementLeftMenu>
    </ContentWrapper>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { get } from "@/api/stats.api";
import { getExport } from "@/api/statistics.api";
import { useConfigStore } from "@/stores/config.store";
import { useUserStore } from "@/stores/user.store";
import router from "@/helpers/router";
import downloadCsv from "@/utils/downloadCsv";
import formatDate from "@/utils/formatDate";

// components
import { Button } from "@resorptionbidonvilles/ui";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import ViewError from "@/components/ViewError/ViewError.vue";
import ArrangementLeftMenu from "@/components/ArrangementLeftMenu/ArrangementLeftMenu.vue";
import Loading from "@/components/Loading/Loading.vue";
import StatistiquesMetriquesPrincipales from "./StatistiquesMetriquesPrincipales/StatistiquesMetriquesPrincipales.vue";
import StatistiquesSites from "./StatistiquesSites/StatistiquesSites.vue";
import StatistiquesHabitants from "./StatistiquesHabitants/StatistiquesHabitants.vue";
import StatistiquesActions from "./StatistiquesActions/StatistiquesActions.vue";
import StatistiquesUtilisateurs from "./StatistiquesUtilisateurs/StatistiquesUtilisateurs.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";

// data
const configStore = useConfigStore();
const userStore = useUserStore();
const { departements } = configStore.config;
const isLoading = ref(null);
const error = ref(null);
const stats = ref(null);
const exportLoading = ref(null);

// computed
const currentDepartementCode = computed(() => {
    return router.currentRoute.value.params.code || null;
});
const currentTabId = computed(() => {
    return currentDepartementCode.value || "france";
});
const tabs = computed(() => {
    const arr = departements.map(({ code, name }) => ({
        id: code,
        route: `/statistiques/${code}`,
        label: `${code} - ${name}`,
    }));
    arr.unshift({
        id: "france",
        route: "/statistiques",
        label: "France",
    });
    return arr;
});

const currentTab = computed(() => {
    return tabs.value.find(({ id }) => currentTabId.value === id);
});

onMounted(load);

async function load(force = false) {
    if (isLoading.value === true && !force) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    const originalCode = currentDepartementCode.value;
    try {
        const { statistics } = await get(currentDepartementCode.value);
        if (currentDepartementCode.value !== originalCode) {
            return;
        }
        stats.value = statistics;
    } catch (e) {
        if (currentDepartementCode.value !== originalCode) {
            return;
        }
        error.value = e?.user_message || "Une erreur inconnue est survenue";
    }

    isLoading.value = false;
}

async function exportCSV() {
    if (exportLoading.value === true) {
        return;
    }

    exportLoading.value = true;
    try {
        const { csv } = await getExport();
        downloadCsv(csv, `${formatDate(Date.now() / 1000, "y_m_d")}_stats.csv`);
    } catch (err) {
        alert("Une erreur est survenue durant l'export");
    }

    exportLoading.value = false;
}

function print() {
    window.print();
}

watch(currentDepartementCode, () => {
    const FORCE = true;
    load(FORCE);
});
</script>
