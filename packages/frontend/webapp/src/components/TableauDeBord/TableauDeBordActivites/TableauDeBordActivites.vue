<template>
    <div class="mt-0">
        <Spinner v-if="dashboardActivitiesStore.isLoading" />

        <ViewErrorInline v-else-if="dashboardActivitiesStore.error">
            <template v-slot:title>Activités indisponibles</template>
            <template v-slot:code>{{
                dashboardActivitiesStore.error
            }}</template>
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

        <section v-else class="flex flex-col md:flex-row">
            <div class="sticky top-[120px] w-full md:w-auto self-start top-64">
                <TableauDeBordFiltres class="w-full md:w-48 pt-0 -mt-0" />
            </div>
            <TableauDeBordActivitesListe
                class="overflow-auto ml-24 -mt-1 flex-1"
            />
        </section>
    </div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useDashboardActivitiesStore } from "@/stores/dashboard.activities.store";
import { useActivitiesStore } from "@/stores/activities.store";
import compareLocations from "@/utils/compareLocations";

import { Button, Spinner } from "@resorptionbidonvilles/ui";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import ViewErrorInline from "@/components/ViewErrorInline/ViewErrorInline.vue";
import TableauDeBordFiltres from "./TableauDeBordFiltres.vue";
import TableauDeBordActivitesListe from "./TableauDeBordActivitesListe.vue";

const dashboardActivitiesStore = useDashboardActivitiesStore();
const activitiesStore = useActivitiesStore();
const aMonthAgo = new Date();
aMonthAgo.setDate(aMonthAgo.getDate() - 30);
aMonthAgo.setHours(0);
aMonthAgo.setMinutes(0);
aMonthAgo.setSeconds(0);
aMonthAgo.setMilliseconds(0);

function load() {
    const loaded = dashboardActivitiesStore.loaded;
    const loadedLocation = {
        search: "",
        data: {
            typeUid: loaded.locationType,
            code: loaded.locationCode,
        },
    };

    if (
        !compareLocations(loadedLocation, {
            search: "",
            data: activitiesStore.filters.location,
        }) ||
        dashboardActivitiesStore.endOfActivities !== true
    ) {
        dashboardActivitiesStore.fetch({
            location: {
                locationType:
                    activitiesStore.filters.location?.typeUid || "nation",
                locationCode: activitiesStore.filters.location?.code,
            },
            maxDate: aMonthAgo.getTime(),
            numberOfActivities: -1,
        });
    }
}

watch(
    () => activitiesStore.filters.location,
    () => {
        load();
    }
);
onMounted(load);
</script>
