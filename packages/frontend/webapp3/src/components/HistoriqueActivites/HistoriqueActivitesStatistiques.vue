<template>
    <div class="flex justify-between space-x-6">
        <section class="flex space-x-6 flex-1">
            <p>
                <MiniCarte :location="mapLocation" />
            </p>
            <div>
                <h1 class="text-3xl text-info font-bold">{{ title }}</h1>
            </div>
        </section>
    </div>
</template>

<script setup>
import { toRefs, computed } from "vue";
import { useActivitiesStore } from "@/stores/activities.store";
import computeLocationSearchTitle from "@/utils/computeLocationSearchTitle";

import MiniCarte from "@/components/MiniCarte/MiniCarte.vue";

const activitiesStore = useActivitiesStore();
const { location, search } = toRefs(activitiesStore.filters);

const mapLocation = computed(() => {
    return location.value || { typeUid: "nation" };
});
const title = computed(() => {
    return computeLocationSearchTitle(search.value, location.value);
});
</script>
