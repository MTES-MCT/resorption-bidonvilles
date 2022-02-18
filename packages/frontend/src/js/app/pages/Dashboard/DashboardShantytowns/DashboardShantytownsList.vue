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

        <section class="-ml-16 -mr-16 flex justify-between" v-else>
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

const ITEMS_PER_PAGE = 6;

export default {
    components: {
        ShantytownThumbnail,
        PaginationButton
    },
    async created() {
        if (!this.$store.state.towns.data.length) {
            await this.$store.dispatch("fetchTowns");
        }
    },
    computed: {
        ...mapGetters({
            isLoading: "townsLoading",
            error: "townsError",
            currentFilter: "dashboardShantytownsFilter",
            myShantytowns: "dashboardMyShantytowns",
            rawShantytowns: "dashboardContent",
            pageContent: "dashboardPageContent",
            sort: "dashboardShantytownsSort",
            currentPage: "dashboardShantytownsCurrentPage"
        }),
        nbPages() {
            return Math.ceil(this.rawShantytowns.length / ITEMS_PER_PAGE);
        },
        sortFn() {
            if (this.sort === "cityName") {
                return (a, b) => {
                    if (a.city.name < b.city.name) {
                        return -1;
                    }
                    if (a.city.name > b.city.name) {
                        return 1;
                    }
                    return 0;
                };
            }
            return (a, b) => {
                return b[this.sort] - a[this.sort];
            };
        },
        orderedShantytowns() {
            return [...this.rawShantytowns].sort(this.sortFn);
        },
        pageContent() {
            return this.orderedShantytowns.slice(
                (this.currentPage - 1) * ITEMS_PER_PAGE,
                this.currentPage * ITEMS_PER_PAGE
            );
        }
    },
    methods: {
        onChangePage(page) {
            this.$store.commit(
                "setDashboardShantytownsPage",
                Math.min(Math.max(1, page), this.nbPages)
            );
        }
    }
};
</script>
