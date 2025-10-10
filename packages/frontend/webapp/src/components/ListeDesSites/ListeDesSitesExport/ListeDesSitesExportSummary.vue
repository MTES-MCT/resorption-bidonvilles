<template>
    <p>
        Vous allez exporter
        <template v-if="isExportToday">
            <strong class="text-primary"
                >{{ townsStore.filteredTowns.length }} site<template
                    v-if="townsStore.filteredTowns.length > 1"
                    >s</template
                ></strong
            >
            {{ territory.prefix }}
            <strong class="text-primary">{{ territory.emphasis }}</strong
            >.
        </template>
        <template v-else>
            les sites {{ territory.prefix }}
            <strong class="text-primary">{{ territory.emphasis }}</strong>
            <strong> à une date passée</strong>. A ce stade, nous ne sommes pas
            en mesure de vous indiquer le nombre exact de sites qui seront
            exportés.
        </template>
    </p>
    <p class="mt-2">Les filtres sélectionnés sont appliqués.</p>
</template>

<script setup>
import { computed, toRefs } from "vue";
import { useTownsStore } from "@/stores/towns.store";
import computeLocationSearchTitle from "@/utils/computeLocationSearchTitle";

const props = defineProps({
    isExportToday: {
        type: Boolean,
        required: true,
    },
});
const { isExportToday } = toRefs(props);
console.log("Valeur de isExportToday:", isExportToday.value);
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
