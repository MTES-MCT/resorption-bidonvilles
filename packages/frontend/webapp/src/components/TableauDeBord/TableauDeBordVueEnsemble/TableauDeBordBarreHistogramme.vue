<template>
    <div
        role="img"
        ref="bar"
        class="rounded-sm w-2 mr-1 cursor-pointer"
        :class="hover ? hoverColor : color"
        :aria-label="ariaLabel"
        tabindex="-1"
        @mouseover="hover = true"
        @mouseleave="hover = false"
    ></div>
</template>

<script setup>
import { computed, defineProps, ref, toRefs, onMounted } from "vue";

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
    figure: Number,
    date: String,
    dateFrom: String,
});
const { height, color, hoverColor, figure, date, dateFrom } = toRefs(props);
const hover = ref(false);
const bar = ref(null);

onMounted(() => {
    // Si un chiffre est égal à 0 on affiche quand même une barre à 2 px de hauteur
    bar.value.style.height =
        height.value !== 0 ? `${height.value}rem` : "0.1rem";
});

const ariaLabel = computed(() => {
    if (dateFrom.value) {
        return `${figure.value} du ${dateFrom.value.slice(
            0,
            2
        )} ${getAudibleMonth(dateFrom.value.slice(-2))} au ${date.value.slice(
            0,
            2
        )} ${getAudibleMonth(date.value.slice(-2))}`;
    } else {
        return `${figure.value} au ${date.value.slice(0, 2)} ${getAudibleMonth(
            date.value.slice(-2)
        )}`;
    }
});

function getAudibleMonth(month) {
    return month
        .replace("01", "janvier")
        .replace("02", "février")
        .replace("03", "mars")
        .replace("04", "avril")
        .replace("05", "mai")
        .replace("06", "juin")
        .replace("07", "juillet")
        .replace("08", "août")
        .replace("09", "septembre")
        .replace("10", "octobre")
        .replace("11", "novembre")
        .replace("12", "décembre");
}
</script>
