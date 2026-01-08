<template>
    <Layout>
        <ContentWrapper>
            <FilArianne :items="ariane" />
        </ContentWrapper>
        <ContentWrapper>
            <template v-if="userStore.user.intervention_areas.is_national">
                <DonneesStatistiques />
            </template>
            <template v-else>
                <div class="fr-container">
                    <LayoutLoading v-if="isSummaryLoading !== false" />
                    <LayoutError v-else-if="summaryError !== null">
                        <template v-slot:title>
                            Statistiques inaccessibles
                        </template>
                        <template v-slot:code>{{ summaryError }}</template>
                    </LayoutError>
                    <DonneesStatistiquesDepartementBigFigures
                        v-else-if="summaryMetrics !== null"
                        :metrics="summaryMetrics"
                    />

                    <h1 class="fr-h3 mt-6">Choisissez un département</h1>
                    <p class="fr-text--sm">
                        Vous avez accès aux données statistiques des
                        départements suivants :
                    </p>

                    <DsfrTiles :tiles="tiles" :horizontal="horizontal" />
                    <div
                        v-if="userStore.departementsForMetrics.length === 0"
                        class="fr-alert fr-alert--warning"
                    >
                        <p class="fr-alert__title">
                            Aucun département accessible
                        </p>
                        <p>
                            Vous n'avez actuellement accès à aucune donnée
                            statistique. Contactez votre administrateur si vous
                            pensez qu'il s'agit d'une erreur.
                        </p>
                    </div>
                </div>
            </template>
        </ContentWrapper>
    </Layout>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { ContentWrapper, FilArianne } from "@resorptionbidonvilles/ui";
import Layout from "@/components/Layout/Layout.vue";
import DonneesStatistiques from "@/components/DonneesStatistiques/DonneesStatistiques.vue";
import DonneesStatistiquesDepartementBigFigures from "@/components/DonneesStatistiquesDepartement/components/header/DonneesStatistiquesDepartementBigFigures.vue";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import { useUserStore } from "@/stores/user.store";
import departementSvg from "@/assets/img/departements/export.js";
import { getDepartementsSummaryMetrics } from "@/api/metrics.api";

const userStore = useUserStore();

const isSummaryLoading = ref(null);
const summaryError = ref(null);
const summaryMetrics = ref(null);

// On prend en compte la responsivness pour passer le bloc DsfrTiles en horizontal en dessous du breakpoint "SM" de tailwind
const horizontal = ref(false);
const breakpoint = 640; // sm

const updateLayout = () => {
    horizontal.value = window.innerWidth < breakpoint;
};

onMounted(() => {
    updateLayout();
    window.addEventListener("resize", updateLayout, { passive: true });

    if (!userStore.user.intervention_areas.is_national) {
        fetchSummary();
    }
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", updateLayout);
});

async function fetchSummary() {
    if (isSummaryLoading.value === true) {
        return;
    }

    if (userStore.departementsForMetrics.length === 0) {
        isSummaryLoading.value = false;
        summaryMetrics.value = null;
        return;
    }

    isSummaryLoading.value = true;
    summaryError.value = null;
    summaryMetrics.value = null;

    try {
        const codes = userStore.departementsForMetrics.map((d) => d.code);
        summaryMetrics.value = await getDepartementsSummaryMetrics(codes);
    } catch (e) {
        summaryError.value = e?.code || "Erreur inconnue";
    }

    isSummaryLoading.value = false;
}

const ariane = computed(() => {
    const items = [{ label: "Visualisation des données" }];

    if (userStore.user.intervention_areas.is_national) {
        items.push({ label: "Hexagone" });
    } else {
        items.push({ label: "Départements" });
    }

    return items;
});

const tiles = computed(() => {
    return userStore.departementsForMetrics.map((departement) => {
        return {
            title: departement.name,
            description: `Code : ${departement.code}`,
            to: `/visualisation-donnees/departement/${departement.code}`,
            imgSrc: departementSvg[departement.code],
        };
    });
});
</script>
