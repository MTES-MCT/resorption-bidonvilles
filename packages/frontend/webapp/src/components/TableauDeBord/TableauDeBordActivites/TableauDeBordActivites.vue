<template>
    <TableauDeBordSection title="Activité" id="activites">
        <Spinner v-if="activitiesStore.isLoading" />

        <ViewErrorInline v-else-if="activitiesStore.error">
            <template v-slot:title>Activités indisponibles</template>
            <template v-slot:code>{{ activitiesStore.error }}</template>
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

        <section v-else class="flex">
            <TableauDeBordFiltres
                class="w-48 pt-8 -mt-8 sticky top-0 self-start"
            />
            <TableauDeBordActivitesListe class="ml-24 -mt-1 flex-1" />
        </section>
    </TableauDeBordSection>
</template>

<script setup>
import { onMounted } from "vue";
import { useActivitiesStore } from "@/stores/activities.store";
import { useDashboardStore } from "@/stores/dashboard.store";
import compareLocations from "@/utils/compareLocations";

import { Button, Spinner } from "@resorptionbidonvilles/ui";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import ViewErrorInline from "@/components/ViewErrorInline/ViewErrorInline.vue";
import TableauDeBordSection from "../TableauDeBordSection.vue";
import TableauDeBordFiltres from "./TableauDeBordFiltres.vue";
import TableauDeBordActivitesListe from "./TableauDeBordActivitesListe.vue";

const activitiesStore = useActivitiesStore();
const dashboardStore = useDashboardStore();
const aMonthAgo = new Date();
aMonthAgo.setDate(aMonthAgo.getDate() - 30);
aMonthAgo.setHours(0);
aMonthAgo.setMinutes(0);
aMonthAgo.setSeconds(0);
aMonthAgo.setMilliseconds(0);

function load() {
    const loaded = activitiesStore.loaded;
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
            data: dashboardStore.filters.location,
        }) ||
        activitiesStore.endOfActivities !== true
    ) {
        activitiesStore.fetch({
            location: {
                locationType:
                    dashboardStore.filters.location?.typeUid || "nation",
                locationCode: dashboardStore.filters.location?.code,
            },
            maxDate: aMonthAgo.getTime(),
            numberOfActivities: -1,
        });
    }
}

onMounted(load);
</script>
