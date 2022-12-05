<template>
    <section class="flex flex-col space-y-4">
        <CarteGroupeHistorique
            v-for="group in parsedActivities"
            :key="group.id"
            :group="group"
        />
        <div
            class="text-center text-primary text-display-md font-bold"
            v-if="activitiesStore.isLoading"
        >
            <Spinner />
        </div>
    </section>
</template>

<script setup>
import { computed } from "vue";
import { useActivitiesStore } from "@/stores/activities.store";

import { Spinner } from "@resorptionbidonvilles/ui";
import CarteGroupeHistorique from "@/components/CarteHistoriqueDetaillee/CarteGroupeHistorique.vue";

const activitiesStore = useActivitiesStore();
const parsedActivities = computed(() => {
    const groups = [];
    for (let i = 0, lastDate; i < activitiesStore.activities.length; i += 1) {
        const item = activitiesStore.activities[i];
        const date = new Date(item.date * 1000);
        const dateStr = `${date.getDate().toString().padStart(2, "0")}${date
            .getMonth()
            .toString()
            .padStart(2, "0")}${date.getFullYear()}`;

        // si cet item n'est pas à la même date que le précédent on crée un nouveau groupe
        if (!lastDate || dateStr !== lastDate) {
            groups.push({
                id: [
                    activitiesStore.loaded.locationType,
                    activitiesStore.loaded.locationCode,
                    dateStr,
                ].join("-"),
                date,
                items: [item],
            });
        }
        // sinon on ajoute l'item au dernier groupe en date
        else {
            groups[groups.length - 1].items.push(item);
        }

        lastDate = dateStr;
    }
    return groups;
});
</script>
