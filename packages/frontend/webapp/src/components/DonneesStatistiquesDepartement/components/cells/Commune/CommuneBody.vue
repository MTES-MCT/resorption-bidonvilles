<template>
    {{ town.usename }}<br /><span class="text-sm text-G700">{{
        town.field_type
    }}</span>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({ town: Object });
const { town } = toRefs(props);
</script>
