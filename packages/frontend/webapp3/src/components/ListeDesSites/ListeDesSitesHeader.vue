<template>
    <div class="flex justify-between space-x-6 print:hidden">
        <section class="flex space-x-6 flex-1">
            <p>
                <MiniCarte :location="mapLocation" />
            </p>
            <div>
                <h1 class="text-3xl text-info font-bold">{{ title }}</h1>
                <p>{{ populationTotal }} personnes</p>
                <p>
                    {{ townsStore.filteredTowns.length }}
                    sites
                </p>
                <p v-if="userStore.hasJusticePermission && justiceTotal">
                    {{ justiceTotal }} site(s) avec une procédure judiciaire
                </p>
            </div>
        </section>
    </div>
</template>

<script setup>
import { toRefs, computed } from "vue";
import { useTownsStore } from "@/stores/towns.store";
import { useUserStore } from "@/stores/user.store";
import computeLocationSearchTitle from "@/utils/computeLocationSearchTitle";
import MiniCarte from "@/components/MiniCarte/MiniCarte.vue";

const townsStore = useTownsStore();
const userStore = useUserStore();
const { location, search } = toRefs(townsStore.filters);

const mapLocation = computed(() => {
    return location.value || { typeUid: "nation" };
});
const title = computed(() => {
    return computeLocationSearchTitle(search.value, location.value);
});
const populationTotal = computed(() => {
    return townsStore.filteredTowns.reduce(
        (total, { populationTotal }) => total + (populationTotal || 0),
        0
    );
});
const justiceTotal = computed(() => {
    return townsStore.filteredTowns.filter(
        ({ justiceProcedure }) => justiceProcedure === true
    ).length;
});
</script>
