<template>
    <div class="flex items-center">
        <div
            v-if="isClosed || isSolved"
            class="flex items-center uppercase text-sm mr-4"
        >
            <div v-if="isClosed">
                Fermé le
                {{ formatDate(town.closedAt, "d/m/y") }}
            </div>
            <div v-else-if="isSolved">
                Résorbé le
                {{ formatDate(town.closedAt, "d/m/y") }}
            </div>
        </div>
        <div class="flex items-center uppercase text-sm mr-4">
            <div class="rounded-full bg-corail h-3 w-3 mr-2" />
            Mis à jour le
            {{ formatDate(town.updatedAt, "d/m/y") }}
        </div>
        <div class="flex items-center uppercase text-sm mr-4">
            <TagObjectifResorption
                v-if="town.resorptionTarget"
                :target="town.resorptionTarget"
            />
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import formatDate from "@/utils/formatDate";

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
