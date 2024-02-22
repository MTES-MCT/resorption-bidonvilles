<template>
    <span v-if="typeof value === 'string' && value.length > 0">{{
        value
    }}</span>
    <span v-else class="text-G700">?</span>
</template>

<script setup>
import { toRefs } from "vue";
const props = defineProps({ value: String });
const { value } = toRefs(props);
</script>
