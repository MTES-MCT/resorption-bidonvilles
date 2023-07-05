<template>
    <template v-if="Number.isFinite(value)">{{ value }}</template>
    <span v-else class="text-G500">?</span>
</template>

<script setup>
import { toRefs } from "vue";
const props = defineProps({ value: Number });
const { value } = toRefs(props);
</script>
