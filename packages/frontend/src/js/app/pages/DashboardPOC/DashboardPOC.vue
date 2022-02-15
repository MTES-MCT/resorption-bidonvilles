<template>
    <PrivateLayout>
        <PrivateContainer>
            <div class="pt-10">
                <span class="font-bold">
                    Bienvenue {{ user.first_name }} {{ user.last_name }}
                    <br /><br
                /></span>

                <Icon icon="map-marker-alt" :style="'color: #000091'" />
                <span> Localisation : {{ locationName }} </span>
            </div>
            <div class="flex pt-20">
                <span class="font-bold mr-8"> Vue d'ensemble </span>
                <HeaderTab
                    :active="temporality === 'month'"
                    @click="onClickChangeTemporality('month')"
                    class="mr-8"
                >
                    Les 4 dernières semaines
                </HeaderTab>
                <HeaderTab
                    :active="temporality === 'trimestre'"
                    @click="onClickChangeTemporality('trimestre')"
                    class="mr-8"
                >
                    Les 3 derniers mois
                </HeaderTab>
            </div>
            <div
                class="flex pt-10 justify-between"
                v-for="stat in stats"
                :key="stat.label"
            >
                <StatCard :cardStats="stat" :period="temporality"> </StatCard>
            </div>
            <router-link
                class="text-primary underline flex justify-center pt-10"
                :to="`statistiques`"
            >
                Voir plus de statistiques
            </router-link>
        </PrivateContainer>
    </PrivateLayout>
</template>

<script>
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer.vue";
import PrivateLayout from "#app/components/PrivateLayout";
import { getDashboardStats } from "#helpers/api/dashboard";
import { get as getConfig } from "#helpers/api/config";
import StatCard from "./StatCard.vue";

export default {
    components: {
        PrivateContainer,
        PrivateLayout,
        StatCard
    },
    data() {
        const { user } = getConfig();
        return {
            /**
             * Current user
             *
             * @type {User}
             */
            user,
            stats: [],
            temporality: "month",
            locationType: null,
            locationCode: null,
            locationName: null
        };
    },
    created() {
        this.load();
    },
    methods: {
        async load() {
            if (this.user.organization.location.type === "nation") {
                this.locationName = "France métropolitaine";
            } else {
                this.locationName = this.user.organization.location[
                    this.user.organization.location.type
                ].name;
            }
            const res = await getDashboardStats();
            this.stats = res;
        },
        onClickChangeTemporality(value) {
            this.temporality = value;
        }
    }
};
</script>
