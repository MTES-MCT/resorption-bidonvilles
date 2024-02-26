<template>
    <div
        role="img"
        ref="bar"
        class="rounded-sm w-2 mr-1 cursor-pointer"
        :class="hover ? hoverColor : color"
        :style="styleObject"
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
    let message = "";
    if (dateFrom.value) {
        message = `${figure.value} du ${dateFrom.value.slice(
            0,
            2
        )} ${getAudibleMonth(dateFrom.value.slice(-2))} au ${date.value.slice(
            0,
            2
        )} ${getAudibleMonth(date.value.slice(-2))}`;
    } else {
        message = `${figure.value} au ${date.value.slice(
            0,
            2
        )} ${getAudibleMonth(date.value.slice(-2))}`;
    }
    if (color.value === "bg-red") {
        message =
            message.length > 0
                ? message + " (En progression défavorable)"
                : message + "En progression défavorable";
    } else if (color.value === "bg-green500") {
        message =
            message.length > 0
                ? message + " (En progression favorable)"
                : message + "En progression favorable";
    }
    return message;
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
const styleObject = computed(() => {
    if (color.value === "bg-red" || color.value === "bg-green500") {
        return {
            "background-image":
                "linear-gradient(45deg, rgb(255, 255,255) 12.5%, transparent 12.5%, transparent 37.5%, rgb(255, 255,255) 37.5%, rgb(255, 255,255) 62.5%, transparent 62.5%, transparent 87.5%, rgb(255, 255,255) 87.5%)",
            "background-size": "10px 10px",
            "background-position": "0px 0px",
        };
    }
    return {};
});
</script>
