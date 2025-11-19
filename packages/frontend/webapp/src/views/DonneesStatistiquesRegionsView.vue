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
import { useUserStore } from "@/stores/user.store";

const userStore = useUserStore();

// On prend en compte la responsivness pour passer le bloc DsfrTiles en horizontal en dessous du breakpoint "SM" de tailwind
const horizontal = ref(false);
const breakpoint = 640; // sm

const updateLayout = () => {
    horizontal.value = window.innerWidth < breakpoint;
};

onMounted(() => {
    updateLayout();
    window.addEventListener("resize", updateLayout, { passive: true });
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", updateLayout);
});

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
        };
    });
});
</script>
