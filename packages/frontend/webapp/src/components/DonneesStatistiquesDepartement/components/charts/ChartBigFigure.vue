<template>
    <article>
        <div
            class="px-2 py-3 flex items-center justify-center space-x-2"
            :class="background"
        >
            <img v-if="img" :src="img" width="40" :alt="alt" />
            <Icon v-else class="text-xl" :icon="icon" />
            <span class="font-bold text-3xl">{{ figure }}</span>
            <span class="font-bold text-lg" :class="color"
                >({{ formatedEvolution }})</span
            >
        </div>
        <label class="text-sm"><slot /></label>
    </article>
</template>

<script setup>
import { computed, toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    icon: {
        type: String,
        required: false,
        default: "",
    },
    img: {
        type: String,
        required: false,
    },
    alt: {
        type: String,
        required: false,
        default: "",
    },
    figure: {
        type: Number,
        required: true,
    },
    evolution: {
        type: Number,
        required: true,
    },
    invert: {
        type: Boolean,
        required: false,
        default: false,
    },
    neutral: {
        type: Boolean,
        required: false,
        default: false,
    },
});
const { icon, img, alt, figure, evolution, invert, neutral } = toRefs(props);

const colors = {
    positive: {
        background: "bg-green100",
        color: "text-green",
    },
    negative: {
        background: "bg-red100",
        color: "text-red",
    },
    neutral: {
        background: "bg-G200",
        color: "text-G700",
    },
};

const background = computed(() => {
    return (
        neutral.value
            ? colors.neutral
            : evolution.value == 0
            ? colors.neutral
            : evolution.value < 0
            ? !invert.value
                ? colors.positive
                : colors.negative
            : !invert.value
            ? colors.negative
            : colors.positive
    ).background;
});
const color = computed(() => {
    return (
        neutral.value
            ? colors.neutral
            : evolution.value == 0
            ? colors.neutral
            : evolution.value < 0
            ? !invert.value
                ? colors.positive
                : colors.negative
            : !invert.value
            ? colors.negative
            : colors.positive
    ).color;
});

const formatedEvolution = computed(() => {
    return `${evolution.value >= 0 ? "+ " : "- "}${Math.abs(
        evolution.value
    )} %`;
});
</script>
