<template>
    <div class="flex justify-between space-x-6">
        <section class="flex space-x-6 flex-1">
            <p>
                <MiniCarte :location="mapLocation" />
            </p>
            <div>
                <h1 class="text-3xl text-info font-bold">{{ title }}</h1>
                <p>
                    {{ plansStore.filteredPlans.length }}
                    action<template v-if="plansStore.filteredPlans.length > 1"
                        >s</template
                    >
                </p>
            </div>
        </section>
    </div>
</template>

<script setup>
import { toRefs, computed } from "vue";
import { usePlansStore } from "@/stores/plans.store";
import computeLocationSearchTitle from "@/utils/computeLocationSearchTitle";
import MiniCarte from "@/components/MiniCarte/MiniCarte.vue";

const plansStore = usePlansStore();
const { location, search } = toRefs(plansStore.filters);

const mapLocation = computed(() => {
    return location.value || { typeUid: "nation" };
});
const title = computed(() => {
    return computeLocationSearchTitle(search.value, location.value);
});
</script>
