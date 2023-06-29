<template>
    <LayoutLoading v-if="isLoading !== false" />

    <LayoutError v-else-if="error !== null">
        <template v-slot:title>Statistiques inaccessibles</template>
        <template v-slot:code>{{ error }}</template>
        <template v-slot:content
            >Vous souhaitiez consulter les données statistiques d'un
            département, mais nous ne parvenons pas à collecter les informations
            nécessaires. Vous pouvez réessayer un peu plus tard ou nous
            contacter en cas d'urgence.</template
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
import router, { isCurrentRouteBack } from "@/helpers/router";

import { Button, FilArianne } from "@resorptionbidonvilles/ui";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import Layout from "@/components/Layout/Layout.vue";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
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
        await departementMetricsStore.fetchEvolution(departementCode.value);
    } catch (e) {
        error.value = e?.code || "Erreur inconnue";
    }

    isLoading.value = false;
}
</script>
