<template>
    <CityRow :data="data" :columns="columns" />
    <TownRow
        v-for="town in data.towns"
        :key="town.id"
        :data="data"
        :columns="columns"
        :town="town"
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
</script>
