<template>
    <section>
        <p v-if="isLoading"><Spinner /></p>

        <p v-else-if="error" class="text-red">
            <Icon icon="times-circle" />
            <span class="ml-2 font-bold"
                >Erreur lors de la collecte des données :</span
            >
            {{ error }}
        </p>

        <p
            v-else-if="
                rawShantytowns.length === 0 &&
                    currentFilter === 'my_shantytowns'
            "
            class="text-primary p-4 bg-blue200"
        >
            Vous n'intervenez sur aucun site. Rendez-vous sur la fiche d'un site
            pour vous déclarer intervenant(e).
        </p>

        <p v-else-if="rawShantytowns.length === 0" class="text-G600 italic">
            Aucune donnée à afficher
        </p>

        <section
            class="-ml-16 -mr-16 flex justify-between"
            v-else-if="display === 'thumbnail'"
        >
            <div class="w-12 mr-4">
                <PaginationButton
                    icon="arrow-left"
                    :disabled="currentPage === 1"
                    @click.native="onChangePage(currentPage - 1)"
                />
            </div>
            <div class="grid grid-cols-3 gap-x-8 gap-y-6 flex-1">
                <ShantytownThumbnail
                    v-for="shantytown in pageContent"
                    :key="shantytown.id"
                    :shantytown="shantytown"
                />
            </div>
            <div class="w-12 ml-4">
                <PaginationButton
                    icon="arrow-right"
                    :disabled="currentPage === nbPages"
                    @click.native="onChangePage(currentPage + 1)"
                />
            </div>
        </section>

        <section v-else-if="display === 'map'">
            <Map
                :display-searchbar="false"
                :towns="rawShantytowns"
                :default-view="mapSetup"
                :displayPopupOnTownClick="true"
                :displayAddressToggler="false"
                :displayPrinter="false"
                @leaveMap="leaveMap"
            >
            </Map>
        </section>

        <footer
            class="mt-10 text-center"
            v-if="currentFilter !== 'my_shantytowns'"
        >
            <router-link to="/liste-des-sites" class="link"
                >Voir tous les sites</router-link
            >
        </footer>
    </section>
</template>

<script>
import { mapGetters } from "vuex";
import ShantytownThumbnail from "../ShantytownThumbnail/ShantytownThumbnail";
import PaginationButton from "./ui/PaginationButton";
import Map from "#app/components/map/map.vue";

const ITEMS_PER_PAGE = 6;

export default {
    components: {
        ShantytownThumbnail,
        PaginationButton,
        Map
    },
    async created() {
        if (this.$store.state.towns.data.length) {
            return;
        }

        await this.$store.dispatch("fetchTowns");
        if (this.rawShantytowns.length === 0) {
            this.$store.commit(
                "dashboard/setDashboardShantytownsFilter",
                "my_territory"
            );
        }
    },
    computed: {
        ...mapGetters({
            isLoading: "townsLoading",
            error: "townsError",
            currentFilter: "dashboard/dashboardShantytownsFilter",
            myShantytowns: "dashboard/dashboardMyShantytowns",
            rawShantytowns: "dashboard/dashboardContent",
            pageContent: "dashboard/dashboardPageContent",
            display: "dashboard/dashboardShantytownsDisplay",
            currentPage: "dashboard/dashboardShantytownsCurrentPage",
            mapSetup: "dashboard/dashboardShantytownsMapSetup"
        }),
        nbPages() {
            return Math.ceil(this.rawShantytowns.length / ITEMS_PER_PAGE);
        },
        pageContent() {
            return this.rawShantytowns.slice(
                (this.currentPage - 1) * ITEMS_PER_PAGE,
                this.currentPage * ITEMS_PER_PAGE
            );
        }
    },
    methods: {
        leaveMap(center, zoom) {
            this.$store.commit("dashboard/setDashboardShantytownsMapSetup", {
                center,
                zoom
            });
        },
        onChangePage(page) {
            this.$trackMatomoEvent("TB", "Pagination sites");
            this.$store.commit(
                "dashboard/setDashboardShantytownsPage",
                Math.min(Math.max(1, page), this.nbPages)
            );
        }
    }
};
</script>
