<template>
    <section>
        <Spinner v-if="townsStore.isLoading !== false" />

        <ViewErrorInline v-else-if="townsStore.error">
            <template v-slot:title>Liste des sites indisponible</template>
            <template v-slot:code>{{ townsStore.error }}</template>
            <template v-slot:content
                >Une erreur est survenue lors de la collecte des données. Vous
                pouvez essayer de rafraîchir la page ou réessayer un peu plus
                tard.</template
            >
            <template v-slot:actions>
                <Button
                    type="button"
                    icon="rotate-right"
                    iconPosition="left"
                    @click="load"
                    >Réessayer</Button
                >
                <ButtonContact />
            </template>
        </ViewErrorInline>

        <section v-else>
            <p
                v-if="
                    currentTabContent.length === 0 &&
                    dashboardStore.towns.filter === 'my_shantytowns'
                "
                class="text-primary p-4 bg-blue200 text-center font-bold"
            >
                Vous n'intervenez sur aucun site. Rendez-vous sur la fiche d'un
                site pour vous déclarer intervenant(e).
            </p>

            <p
                v-else-if="currentTabContent.length === 0"
                class="mt-6 text-G700 italic"
            >
                Aucune donnée à afficher
            </p>

            <section class="grid grid-cols-3 gap-x-8 gap-y-6" v-else>
                <CarteSite
                    v-for="shantytown in pageContent"
                    :key="shantytown.id"
                    :shantytown="shantytown"
                />
            </section>

            <footer class="mt-10 text-center">
                <template v-if="numberOfPages > 1">
                    <div class="flex justify-center gap-4 mb-4">
                        <TableauDeBordSitesPaginationButton
                            icon="arrow-left"
                            :disabled="currentPage === 1"
                            title="Page précédente"
                            @click="onChangePage(currentPage - 1)"
                        />
                        <TableauDeBordSitesPaginationButton
                            icon="arrow-right"
                            :disabled="currentPage === numberOfPages"
                            title="Page suivante"
                            @click="onChangePage(currentPage + 1)"
                        />
                    </div>
                </template>
                <Link to="/liste-des-sites">Voir tous les sites</Link>
            </footer>
        </section>
    </section>
</template>

<script setup>
import { onMounted, computed, watch } from "vue";
import { Button, Link, Spinner } from "@resorptionbidonvilles/ui";
import { useTownsStore } from "@/stores/towns.store";
import { useDashboardStore } from "@/stores/dashboard.store";
import { trackEvent } from "@/helpers/matomo";

import ViewErrorInline from "@/components/ViewErrorInline/ViewErrorInline.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import CarteSite from "@/components/CarteSite/CarteSite.vue";
import TableauDeBordSitesPaginationButton from "./TableauDeBordSitesPaginationButton.vue";

const ITEMS_PER_PAGE = 6;
const townsStore = useTownsStore();
const dashboardStore = useDashboardStore();
const currentTabContent = computed(() => dashboardStore.towns.data.currentTab);

const currentPage = computed(() => {
    return dashboardStore.towns.page;
});
const numberOfPages = computed(() => {
    return Math.ceil(currentTabContent.value.length / ITEMS_PER_PAGE);
});
const pageContent = computed(() => {
    return currentTabContent.value.slice(
        (dashboardStore.towns.page - 1) * ITEMS_PER_PAGE,
        dashboardStore.towns.page * ITEMS_PER_PAGE
    );
});
watch(currentTabContent, () => {
    dashboardStore.towns.page = 1;
});

async function load() {
    await townsStore.fetchTowns();

    if (dashboardStore.towns.data.my_shantytowns.length === 0) {
        dashboardStore.setTownFilter("my_territory");
    }
}

function onChangePage(page) {
    trackEvent("TB", "Pagination sites");
    dashboardStore.towns.page = Math.min(
        Math.max(1, page),
        numberOfPages.value
    );
}

onMounted(() => {
    if (townsStore.towns.length === 0) {
        load();
    }
});
</script>
