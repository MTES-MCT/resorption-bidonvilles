<template>
    <div class="flex justify-between space-x-6 print:hidden">
        <section class="flex space-x-6 flex-1">
            <p>
                <MiniCarte :location="mapLocation" />
            </p>
            <div>
                <p class="text-3xl text-info font-bold">{{ title }}</p>
                <p>
                    {{ populationTotal }} personne<template
                        v-if="populationTotal > 1"
                        >s</template
                    >
                </p>
                <p>
                    {{ townsStore.filteredTowns.length }}
                    site<template v-if="townsStore.filteredTowns.length > 1"
                        >s</template
                    >
                </p>
                <p v-if="userStore.hasJusticePermission">
                    {{ justiceTotal }} site<template v-if="justiceTotal > 1"
                        >s</template
                    >
                    avec une procédure judiciaire ou administrative
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
