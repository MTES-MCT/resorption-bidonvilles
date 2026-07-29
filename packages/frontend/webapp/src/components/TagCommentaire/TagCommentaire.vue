<template>
    <DsfrTag small :class="tagClass" :label="tag.label" />
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import specialTags from "@/utils/special_tags";

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
