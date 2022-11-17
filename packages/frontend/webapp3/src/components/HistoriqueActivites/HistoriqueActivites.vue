<template>
    <ContentWrapper>
        <Loading
            v-if="
                activitiesStore.isLoading !== false &&
                activitiesStore.activities.length === 0
            "
        />
        <HistoriqueActivitesErreur v-else-if="activitiesStore.error" />
        <template v-else>
            <HistoriqueActivitesHeader />
            <HistoriqueActivitesStatistiques />
            <HistoriqueActivitesFiltres class="mt-4" />
            <HistoriqueActivitesListe class="mt-4" />
        </template>
    </ContentWrapper>
</template>

<script setup>
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import Loading from "@/components/Loading/Loading.vue";
import HistoriqueActivitesStatistiques from "./HistoriqueActivitesStatistiques.vue";
import HistoriqueActivitesErreur from "./HistoriqueActivitesErreur.vue";
import HistoriqueActivitesHeader from "./HistoriqueActivitesHeader.vue";
import HistoriqueActivitesFiltres from "./HistoriqueActivitesFiltres.vue";
import HistoriqueActivitesListe from "./HistoriqueActivitesListe.vue";
import { useActivitiesStore } from "@/stores/activities.store";

const activitiesStore = useActivitiesStore();
</script>
