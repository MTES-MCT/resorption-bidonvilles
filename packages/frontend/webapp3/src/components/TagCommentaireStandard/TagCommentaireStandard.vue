<template>
    <Tag variant="withoutBackground" :class="tagClass">
        {{ tag.label }}
    </Tag>
</template>

<script setup>
import { Tag } from "@resorptionbidonvilles/ui";
import specialTags from "./specialTags";
import { defineProps, toRefs, computed } from "vue";

const props = defineProps({
    tag: {
        type: Object,
        required: true,
    },
});
const { tag } = toRefs(props);

const tagClass = computed(() => {
    const specialTag = specialTags.find(({ uid }) => uid === tag.value.uid);
    if (specialTag !== undefined) {
        return specialTag.class;
    }

    return "text-black bg-blue300";
});
</script>
