<template>
    {{ data.summary.number_of_towns_with_water }}<br />
    <span class="text-sm">({{ percentage }} %)</span>
</template>

<script setup>
import { computed, toRefs } from "vue";

const props = defineProps({ data: Object });
const { data } = toRefs(props);

const percentage = computed(() => {
    return (
        Math.round(
            (data.value.summary.number_of_towns_with_water /
                data.value.summary.number_of_towns) *
                1000
        ) / 10
    );
});
</script>
