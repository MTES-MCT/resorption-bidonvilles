<template>
    <p v-if="statLoading"><Spinner /></p>

    <p v-else-if="error" class="text-red">
        <Icon icon="times-circle" />
        <span class="ml-2 font-bold"
            >Erreur lors de la collecte des données :</span
        >
        {{ error }}
    </p>

    <section v-else>
        <section class="flex">
            <StatCard
                v-for="stat in stats"
                :key="stat.label"
                :icon="stat.icon"
                :cardStats="stat"
            >
            </StatCard>
        </section>
        <router-link
            class="text-primary underline flex justify-center pt-10"
            to="/statistiques"
            v-if="$store.getters['config/hasPermission']('stats.read')"
        >
            Voir plus de statistiques
        </router-link>
    </section>
</template>

<script>
import { mapGetters } from "vuex";
import StatCard from "./StatCard.vue";

export default {
    components: {
        StatCard
    },
    mounted() {
        this.$store.dispatch("dashboard/fetchGlobalStats");
    },
    computed: {
        ...mapGetters({
            error: "dashboard/dashboardGlobalStatsError",
            stats: "dashboard/dashboardGlobalStats",
            statLoading: "dashboard/dashboardGlobalStatsLoading"
        }),
        currentDate() {
            const date = new Date();
            return new Intl.DateTimeFormat("fr-FR", {
                month: "long",
                day: "2-digit"
            }).format(date);
        }
    }
};
</script>
