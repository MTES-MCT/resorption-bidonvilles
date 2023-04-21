<template>
    <div>
        <span :class="color">
            <Icon :icon="icon" class="mr-2" />
            <span> {{ text }}</span>
        </span>
        <span> le {{ formatDate(date, "d M y") }} </span>
        <slot />
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import formatDate from "@common/utils/formatDate.js";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    icon: {
        type: String,
    },
    color: {
        type: String,
    },
    date: {
        type: Number,
    },
    text: {
        type: String,
    },
});
const { icon, color, date, text } = toRefs(props);
</script>
