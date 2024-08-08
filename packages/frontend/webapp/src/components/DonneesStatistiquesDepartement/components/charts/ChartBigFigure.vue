<template>
    <article>
        <div
            class="p-2 flex justify-center rounded-md flex-col"
            :class="background"
        >
            <div class="flex flex-col md:flex-row gap-2 items-center">
                <div class="flex flex-row gap-2 items-center">
                    <img v-if="img" :src="img" class="w-9 h-6" :alt="alt" />
                    <Icon v-else class="text-xl" :icon="icon" />
                    <span class="font-bold text-3xl">{{ figure }}</span>
                </div>
                <span class="font-bold text-lg" :class="color"
                    >({{ formatedEvolution }})</span
                >
            </div>
            <label class="text-sm text-center md:text-left"><slot /></label>
        </div>
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
});
const { icon, img, alt, figure, evolution, invert } = toRefs(props);

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
    if (invert.value) {
        return colors.neutral.background;
    }

    return (evolution.value < 0 ? colors.positive : colors.negative).background;
});
const color = computed(() => {
    if (invert.value) {
        return colors.neutral.color;
    }

    return (evolution.value < 0 ? colors.positive : colors.negative).color;
});

const formatedEvolution = computed(() => {
    return `${evolution.value >= 0 ? "+ " : "- "}${Math.abs(
        evolution.value
    )} %`;
});
</script>
