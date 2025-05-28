<template>
    {{ formatStat(data.summary.number_of_inhabitants_with_trash_evacuation)
    }}<br />
    <span class="text-sm"
        >({{
            data.summary.percentage_of_inhabitants_with_trash_evacuation
        }}
        %)</span
    >
</template>

<script setup>
import formatStat from "@common/utils/formatStat";
import { toRefs } from "vue";

const props = defineProps({ data: Object });
const { data } = toRefs(props);
</script>
