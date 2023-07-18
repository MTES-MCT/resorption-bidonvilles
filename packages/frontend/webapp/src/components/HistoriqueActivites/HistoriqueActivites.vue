<template>
    <ContentWrapper>
        <HistoriqueActivitesHeader />

        <Loading
            v-if="
                activitiesStore.isLoading !== false &&
                activitiesStore.activities.length === 0
            "
        />
        <HistoriqueActivitesErreur v-else-if="activitiesStore.error" />
        <template v-else>
            <HistoriqueActivitesStatistiques />
            <HistoriqueActivitesFiltres class="mt-4" />
            <HistoriqueActivitesListe
                class="mt-4"
                v-if="activitiesStore.activities.length > 0"
            />
            <HistoriqueActivitesVide class="mt-10" v-else />
        </template>
    </ContentWrapper>
</template>

<script setup>
import { ContentWrapper } from "@resorptionbidonvilles/ui";
import Loading from "@/components/Loading/Loading.vue";
import HistoriqueActivitesStatistiques from "./HistoriqueActivitesStatistiques.vue";
import HistoriqueActivitesErreur from "./HistoriqueActivitesErreur.vue";
import HistoriqueActivitesHeader from "./HistoriqueActivitesHeader.vue";
import HistoriqueActivitesFiltres from "./HistoriqueActivitesFiltres.vue";
import HistoriqueActivitesListe from "./HistoriqueActivitesListe.vue";
import HistoriqueActivitesVide from "./HistoriqueActivitesVide.vue";
import { useActivitiesStore } from "@/stores/activities.store";

const activitiesStore = useActivitiesStore();
</script>
