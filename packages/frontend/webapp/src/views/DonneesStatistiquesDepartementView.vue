<template>
    <LayoutLoading v-if="isLoading !== false" />

    <LayoutError v-else-if="error !== null">
        <template v-slot:title>
            <span v-if="error === 'ACCES_INTERDIT'">Accès non autorisé</span>
            <span v-else>Statistiques inaccessibles</span>
        </template>
        <template v-slot:code>{{ error }}</template>
        <template v-slot:content>
            <span v-if="error === 'ACCES_INTERDIT'">
                Vous ne disposez pas des droits nécessaires pour accéder aux
                données statistiques de ce département. Vous pouvez uniquement
                consulter les départements pour lesquels vous avez une
                autorisation.
            </span>
            <span v-else>
                Vous souhaitiez consulter les données statistiques d'un
                département, mais nous ne parvenons pas à collecter les
                informations nécessaires. Vous pouvez réessayer un peu plus tard
                ou nous contacter en cas d'urgence.
            </span>
        </template>
        <template v-slot:actions>
            <Button
                icon="rotate-right"
                iconPosition="left"
                type="button"
                @click="load"
                v-if="error !== 'ACCES_INTERDIT'"
                >Réessayer</Button
            >
            <Button
                icon="arrow-left"
                iconPosition="left"
                type="button"
                @click="$router.push('/visualisation-donnees')"
                v-if="error === 'ACCES_INTERDIT'"
                >Retour à la liste des départements</Button
            >
            <ButtonContact />
        </template>
    </LayoutError>

    <Layout v-else>
        <ContentWrapper>
            <FilArianne :items="ariane" />
        </ContentWrapper>
        <ContentWrapper>
            <DonneesStatistiquesDepartement
                v-if="
                    departement &&
                    departementMetricsStore.filteredMetrics !== null
                "
                :departement="departement"
                :metrics="departementMetricsStore.filteredMetrics"
            />
        </ContentWrapper>
    </Layout>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store.js";
import router, { isCurrentRouteBack, setDocumentTitle } from "@/helpers/router";

import { Button, ContentWrapper, FilArianne } from "@resorptionbidonvilles/ui";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import Layout from "@/components/Layout/Layout.vue";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import DonneesStatistiquesDepartement from "@/components/DonneesStatistiquesDepartement/DonneesStatistiquesDepartement.vue";
import { useConfigStore } from "@/stores/config.store";
import { useUserStore } from "@/stores/user.store";

const departementMetricsStore = useDepartementMetricsStore();
const userStore = useUserStore();
const isLoading = ref(null);
const error = ref(null);
const ariane = computed(() => {
    const arr = [
        { label: "Visualisation des données" },
        { label: `${departement.value.name} (${departement.value.code})` },
    ];

    if (userStore.hasMoreThanOneDepartementForMetrics) {
        arr.splice(1, 0, {
            label: "Départements",
            to: "/visualisation-donnees",
        });
    }

    return arr;
});

const departementCode = computed(() => {
    return router.currentRoute.value.params.code;
});
const departement = computed(() => {
    const configStore = useConfigStore();
    if (!configStore.config) {
        return null;
    }

    return (
        configStore.config.departements.find(
            (d) => d.code === departementCode.value
        ) || null
    );
});

onMounted(load);
watch(departementCode, load);

async function load() {
    // Vérifier si l'utilisateur a accès à ce département
    const userStore = useUserStore();
    if (!userStore.user.intervention_areas.is_national) {
        const allowedDepartements = userStore.departementsForMetrics;
        const isAllowed = allowedDepartements.some(
            (d) => d.code === departementCode.value
        );

        if (!isAllowed) {
            error.value = "ACCES_INTERDIT";
            isLoading.value = false;
            return;
        }
    }

    if (
        isCurrentRouteBack() &&
        departementMetricsStore.filteredMetrics !== null
    ) {
        isLoading.value = false;
        return;
    }

    // reset state
    departementMetricsStore.reset();

    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        await departementMetricsStore.fetchDepartement(departementCode.value);
        setDocumentTitle(
            `${router.currentRoute.value.meta.title} — ${departement.value.name}`
        );
        await departementMetricsStore.fetchEvolution(departementCode.value);
    } catch (e) {
        error.value = e?.code || "Erreur inconnue";
    }

    departementMetricsStore.activeTab = "summary";
    isLoading.value = false;
}
</script>
