<template>
    <Tag
        tabindex="0"
        :aria-label="`Etiquette ${tag.name}`"
        :variant="tag.uid === 'other' ? 'outline' : 'primary'"
        >{{ tag.name }}</Tag
    >
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Tag } from "@resorptionbidonvilles/ui";

const props = defineProps({
    tag: Object,
});
const { tag } = toRefs(props);
</script>
