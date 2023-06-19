<template>
    <article>
        <div
            class="p-1 flex items-center justify-center space-x-2 w-48"
            :class="background"
        >
            <Icon class="text-xl" :icon="icon" />
            <span class="font-bold text-3xl" :class="color"
                ><template v-if="figure >= 0">+</template>{{ figure }} %</span
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
});
const { icon, figure } = toRefs(props);

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
    return (figure.value < 0 ? colors.positive : colors.negative).background;
});
const color = computed(() => {
    return (figure.value < 0 ? colors.positive : colors.negative).color;
});
</script>
