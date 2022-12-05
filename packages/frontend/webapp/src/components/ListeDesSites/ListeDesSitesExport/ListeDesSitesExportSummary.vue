<template>
    <p>
        Vous allez exporter
        <strong class="text-primary"
            >{{ townsStore.filteredTowns.length }} site<template
                v-if="townsStore.filteredTowns.length > 1"
                >s</template
            ></strong
        >
        {{ territory.prefix }}
        <strong class="text-primary">{{ territory.emphasis }}</strong
        >.
    </p>
</template>

<script setup>
import { computed } from "vue";
import { useTownsStore } from "@/stores/towns.store";
import computeLocationSearchTitle from "@/utils/computeLocationSearchTitle";

const townsStore = useTownsStore();

const territory = computed(() => {
    const emphasis = computeLocationSearchTitle(
        townsStore.filters.search,
        townsStore.filters.location
    );

    if (!townsStore.filters.location && townsStore.filters.search) {
        return {
            prefix: "correspondant à la recherche",
            emphasis,
        };
    }

    return {
        prefix: "sur le territoire",
        emphasis,
    };
});
</script>
