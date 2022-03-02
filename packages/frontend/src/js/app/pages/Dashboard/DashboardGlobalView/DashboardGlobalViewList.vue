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
        <section class="flex justify-between">
            <StatCard
                v-for="stat in stats"
                :key="stat.label"
                :icon="stat.icon"
                :cardStats="stat"
            >
            </StatCard>
        </section>
        <section class="flex">
            <BarCard v-for="stat in stats" :key="stat.label" :cardStats="stat">
            </BarCard>
        </section>
        <router-link
            class="text-primary underline flex justify-center pt-10"
            :to="`statistiques`"
            v-if="hasPermission('stats.read')"
        >
            Voir plus de statistiques
        </router-link>
    </section>
</template>

<script>
import { hasPermission } from "#helpers/api/config";
import { mapGetters } from "vuex";
import StatCard from "./StatCard.vue";
import BarCard from "./BarCard.vue";

export default {
    components: {
        StatCard,
        BarCard
    },
    async created() {
        if (!this.stats.length) {
            await this.$store.dispatch("fetchGlobalStats");
        }
    },
    methods: {
        hasPermission
    },
    computed: {
        ...mapGetters({
            error: "dashboardGlobalStatsError",
            stats: "dashboardGlobalStats",
            statLoading: "dashboardGlobalStatsLoading"
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
