<template>
    <span
        class="text-secondary"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave">
        <Icon
            icon="triangle-exclamation"
            class="mr-1" />
        <span
            v-if="showMessage"><slot /></span
        >
    </span>
</template>

<script setup>
import { ref, defineProps, toRefs } from "vue";
import Icon from "./Icon.vue";

const props = defineProps({
    autohide: {
        type: Boolean,
        required: false,
        default: true
    }
});
const { autohide } = toRefs(props);
const showMessage = ref(autohide.value !== true);

function onMouseEnter() {
    if (autohide.value === true) {
        showMessage.value = true;
    }
}

function onMouseLeave() {
    if (autohide.value === true) {
        showMessage.value = false;
    }
}
</script>