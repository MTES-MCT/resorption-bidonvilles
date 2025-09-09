<template>
    <DsfrBadge noIcon :label="tag.name" class="text-xs" />
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
    tag: Object,
});
const { tag } = toRefs(props);
</script>
