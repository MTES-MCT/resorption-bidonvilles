<template>
    <div class="flex items-center uppercase text-sm">
        <div
            class="rounded-full h-3 w-3 mr-2"
            :class="isClosed || isSolved ? 'bg-red' : 'bg-corail'"
        />

        <p v-if="isClosed || isSolved" class="mr-4">
            <template v-if="isClosed">
                Fermé le
                {{ formatDate(town.closedAt, "d/m/y") }}
            </template>
            <template v-else-if="isSolved">
                Résorbé le
                {{ formatDate(town.closedAt, "d/m/y") }}
            </template>
        </p>
        <p class="mr-4" v-else>
            {{ formatLastUpdatedAt(town) }}
        </p>
        <TagObjectifResorption
            v-if="town.resorptionTarget"
            :target="town.resorptionTarget"
        />
    </div>
</template>

<script setup>
import { toRefs, computed } from "vue";
import formatDate from "@/utils/formatDate";
import formatLastUpdatedAt from "@/utils/formatLastUpdatedAt";

import TagObjectifResorption from "@/components/TagObjectifResorption/TagObjectifResorption.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);

const isClosed = computed(() => {
    return town.value.closedAt && town.value.closedWithSolutions !== "yes";
});
const isSolved = computed(() => {
    return town.value.closedAt && town.value.closedWithSolutions === "yes";
});
</script>
