<template>
    <aside
        :class="`text-size-xl w-10 h-10 leading-10 rounded-full text-white text-center ${color}`"
    >
        <Icon :icon="icon"></Icon>
    </aside>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    color: {
        type: String,
        required: true,
    },
    activity: {
        type: Object,
        required: true,
    },
});

const { color, activity } = toRefs(props);

const icon = computed(() => {
    if (activity.value.entity === "shantytown") {
        if (activity.value.action === "update") {
            return "pen";
        }

        return "map-marker-alt";
    }

    if (activity.value.entity === "user") {
        return "user";
    }

    // commentaires
    if (activity.value.comment?.covid) {
        return "exclamation";
    }

    return "comment";
});
</script>
