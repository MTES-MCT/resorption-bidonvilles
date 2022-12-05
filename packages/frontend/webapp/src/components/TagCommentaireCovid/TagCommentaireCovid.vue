<template>
    <Tag
        variant="withoutBackground"
        :class="[
            'inline-block',
            tag.type === 'warning' ? 'bg-orange300' : 'bg-red300',
        ]"
        >{{ tag.label }}</Tag
    >
</template>

<script setup>
import { Tag } from "@resorptionbidonvilles/ui";
import { defineProps, toRefs } from "vue";
const props = defineProps({
    tag: {
        type: Object,
        required: true,
    },
});
const { tag } = toRefs(props);
</script>
