<template>
    <div
        ref="bar"
        class="rounded-sm w-2 mr-1 cursor-pointer"
        :class="hover ? hoverColor : color"
        @mouseover="hover = true"
        @mouseleave="hover = false"
    ></div>
</template>

<script setup>
import { ref, toRefs, onMounted } from "vue";

const props = defineProps({
    height: {
        type: Number,
    },
    color: {
        type: String,
    },
    hoverColor: {
        type: String,
    },
});
const { height, color, hoverColor } = toRefs(props);
const hover = ref(false);
const bar = ref(null);

onMounted(() => {
    // Si un chiffre est égal à 0 on affiche quand même une barre à 2 px de hauteur
    bar.value.style.height = height.value !== 0 ? `${height.value}px` : "2px";
});
</script>
