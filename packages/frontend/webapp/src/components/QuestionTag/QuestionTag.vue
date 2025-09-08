<template>
    <DsfrBadge
        noIcon
        :label="tag.label"
        :type="tag.uid === 'other' ? 'new' : 'info'"
        class="text-xs"
    />
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
    tag: Object,
});
const { tag } = toRefs(props);
</script>
