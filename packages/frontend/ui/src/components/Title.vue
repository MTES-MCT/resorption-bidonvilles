<template>
    <component :is="tag" @mouseenter="onEnter" @mouseleave="onLeave" class="relative">
        <div
            class="absolute h-7 -top-7 pt-1 px-3 text-sm bg-G100 border border-G400 rounded whitespace-nowrap font-normal z-[3001]"
            :class="hovered ? 'block' : 'hidden'"
        >{{ title }}</div>
        <slot />
    </component>
</template>

<script setup>
import { ref, toRefs } from "vue";

const props = defineProps({
    tag: {
        type: String,
        required: false,
        default: 'div',
    },
    title: {
        type: String,
        required: true,
    },
});
const { tag, title } = toRefs(props);
const hovered = ref(false);

function onEnter() {
    hovered.value = true;
}

function onLeave() {
    hovered.value = false;
}
</script>