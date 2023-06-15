<template>
    <CityRow :data="data" :columns="columns" />
    <TownRow
        v-for="(town, index) in data.towns"
        :even="index % 2 === 0"
        :key="town.id"
        :data="data"
        :columns="columns"
        :town="town"
        @highlightTown="onHighlight"
        @unhighlightTown="onUnhighlight"
    />
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
});
const { data, columns } = toRefs(props);
const emit = defineEmits(["highlightTown", "unhighlightTown"]);

function onHighlight(...args) {
    emit("highlightTown", ...args);
}

function onUnhighlight(...args) {
    emit("unhighlightTown", ...args);
}
</script>
