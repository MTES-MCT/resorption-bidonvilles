<template>
    <article>
        <div
            class="px-2 py-3 flex items-center justify-center space-x-2"
            :class="background"
        >
            <Icon class="text-xl" :icon="icon" />
            <span class="font-bold text-3xl">{{ figure }}</span>
            <span class="font-bold text-lg" :class="color"
                >(<template v-if="evolution >= 0">+</template
                >{{ evolution }} %)</span
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
        required: true,
    },
    figure: {
        type: Number,
        required: true,
    },
    evolution: {
        type: Number,
        required: true,
    },
});
const { icon, figure, evolution } = toRefs(props);

const colors = {
    positive: {
        background: "bg-green100",
        color: "text-green",
    },
    negative: {
        background: "bg-red100",
        color: "text-red",
    },
};

const background = computed(() => {
    return (evolution.value < 0 ? colors.positive : colors.negative).background;
});
const color = computed(() => {
    return (evolution.value < 0 ? colors.positive : colors.negative).color;
});
</script>
