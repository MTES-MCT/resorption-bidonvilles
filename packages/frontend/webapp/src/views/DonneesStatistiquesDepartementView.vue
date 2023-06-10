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
            <DonneesStatistiquesDepartement
                v-if="departement"
                :departement="departement"
                :metrics="metrics"
            />
        </ContentWrapper>
    </Layout>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store.js";
import router from "@/helpers/router";

import { Button } from "@resorptionbidonvilles/ui";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import Layout from "@/components/Layout/Layout.vue";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import DonneesStatistiquesDepartement from "@/components/DonneesStatistiquesDepartement/DonneesStatistiquesDepartement.vue";
import { useConfigStore } from "@/stores/config.store";

const departementMetricsStore = useDepartementMetricsStore();
const isLoading = ref(null);
const error = ref(null);

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
const metrics = computed(() => {
    return departementMetricsStore.metrics[departementCode.value] || null;
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
        await departementMetricsStore.fetchDepartement(departementCode.value);
    } catch (e) {
        error.value = e?.code || "Erreur inconnue";
    }

    isLoading.value = false;
}
</script>
