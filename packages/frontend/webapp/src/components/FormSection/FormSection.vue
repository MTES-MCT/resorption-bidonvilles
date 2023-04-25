<template>
    <div
        :class="{
            [variantClasses]: true,
            'p-6': padding,
        }"
    >
        <div class="flex justify-between border-b pb-3 mb-6">
            <h1 v-if="$slots.title" class="text-2xl text-primary">
                <slot name="title" />
            </h1>

            <div v-if="$slots.detail" class="flex flex-col items-end">
                <slot name="detail" />
            </div>
        </div>
        <slot />
    </div>
</template>

<script setup>
import { computed, toRefs } from "vue";

const props = defineProps({
    variant: {
        type: String,
        required: false,
        default: "white", // soit "white", soit "blue", soit "gray"
    },
    padding: {
        type: Boolean,
        required: false,
        default: true,
    },
});
const { variant, padding } = toRefs(props);

const classes = {
    white: "shadow-lg",
    blue: "bg-blue100",
    gray: "bg-G100 border border-G300",
};

const variantClasses = computed(() => {
    if (!classes[variant.value]) {
        return classes.white;
    }

    return classes[variant.value];
});
</script>
