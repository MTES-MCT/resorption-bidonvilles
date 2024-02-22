<template>
    <li class="flex items-center">
        <span
            :class="[
                'flex rounded-full text-xs border-2 mr-3 mb-1 h-6 w-6 items-center justify-center',
                colorClass,
            ]"
            style="padding: 0.2em"
            ariaHidden="true"
        >
            <Icon :icon="icon" />
        </span>
        <div aria-hidden="true">
            <slot />
        </div>
        <span class="sr-only">{{ audio }}</span>
    </li>
</template>

<script setup>
import { toRefs, computed } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    status: {
        type: String,
        validator: (value) =>
            ["unknown", "bad", "toImprove", "good"].includes(value),
    },
    audio: {
        type: String,
        default: "",
    },
});

const { audio } = toRefs(props);

const colorClass = computed(() => {
    const colors = {
        good: "text-green500 border-green500",
        toImprove: "text-secondary border-secondary",
        bad: "text-red border-red",
        unknown: "text-red border-red",
    };

    return colors[props.status] || "text-red border-red";
});
const icon = computed(() => {
    const icons = {
        good: "check",
        toImprove: "triangle-exclamation",
        bad: "times",
        unknown: "question",
    };

    return icons[props.status] || "question";
});
</script>
