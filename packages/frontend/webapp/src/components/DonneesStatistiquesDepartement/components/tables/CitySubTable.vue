<template>
    <CityRow :data="data" :columns="columns" />
    <template v-if="showTowns">
        <TownRow
            v-for="(town, index) in data.towns"
            :even="index % 2 === 0"
            :key="town.id"
            :data="data"
            :columns="columns"
            :town="town"
            @highlightTown="onHighlight"
            @click="$emit('townClick', town, data.city)"
            @townZoom="$emit('townZoom', town, data.city)"
            @unhighlightTown="onUnhighlight"
            :class="{
                'bg-blue200': highlightedTown === town.id,
            }"
        />
    </template>
</template>

<script setup>
import { toRefs } from "vue";
import CityRow from "../rows/CityRow.vue";
import TownRow from "../rows/TownRow.vue";

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
    columns: {
        type: Array,
        required: true,
    },
    showTowns: {
        type: Boolean,
        required: true,
    },
    highlightedTown: {
        type: Number,
        required: false,
    },
});
const { data, columns, showTowns, highlightedTown } = toRefs(props);

const emit = defineEmits([
    "highlightTown",
    "townZoom",
    "townClick",
    "unhighlightTown",
]);

function onHighlight(...args) {
    emit("highlightTown", ...args);
}

function onUnhighlight(...args) {
    emit("unhighlightTown", ...args);
}
</script>
