<template>
    <Tag :variant="tag.uid === 'other' ? 'outline' : 'primary'">{{
        tag.name
    }}</Tag>
</template>

<script setup>
import { toRefs } from "vue";
import { Tag } from "@resorptionbidonvilles/ui";

const props = defineProps({
    tag: Object,
});
const { tag } = toRefs(props);
</script>
