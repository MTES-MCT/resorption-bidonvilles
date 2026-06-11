<template>
    <span class="text-sm font-normal">
        {{ action.location.departement.name }} </span
    ><br />
    <span>{{ formattedActionName }}</span>
</template>

<script setup>
import { toRefs, computed } from "vue";
import formatActionName from "@/utils/formatActionName";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);

const formattedActionName = computed(() => {
    return formatActionName(action.value);
});
</script>
