<template>
    <div
        class="flex border opacity-0 opacity-transition"
        :class="`${theme.borderColor} ${isHidden ? 'hidden' : ''}`"
        ref="container"
    >
        <div class="p-3 text-center text-white text-lg" :class="theme.bgColor">
            <Icon :icon="theme.icon" />
        </div>
        <div class="flex-1 p-3 bg-white relative">
            <button
                type="button"
                class="text-primary text-xs hover:bg-G200 px-3 py-2 absolute top-1 right-1"
                @click="close"
            >
                <Icon icon="times" />
            </button>
            <h1 class="text-md font-bold"><slot name="title" /></h1>
            <p class="text-sm" role="status"><slot name="description" /></p>
        </div>
    </div>
</template>

<style scoped>
.opacity-transition {
    transition: opacity 0.7s 0s linear;
}
</style>

<script setup>
import {
    onMounted,
    onBeforeUnmount,
    defineProps,
    defineEmits,
    computed,
    ref,
    toRefs,
} from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const themes = {
    error: {
        borderColor: "border-red",
        bgColor: "bg-red",
        icon: "circle-xmark",
    },
    info: {
        borderColor: "border-info",
        bgColor: "bg-info",
        icon: "circle-info",
    },
    success: {
        borderColor: "border-success",
        bgColor: "bg-success",
        icon: "circle-check",
    },
};
const props = defineProps({
    variant: {
        type: String,
        required: false,
        default: "info",
    },
});
const emit = defineEmits(["close"]);

const { variant } = toRefs(props);
const container = ref(null);
const isHidden = ref(false);
let closingTimeout = null;

const theme = computed(() => {
    return themes[variant.value] || themes.info;
});

onMounted(() => {
    setTimeout(() => (container.value.style.opacity = "1"), 100);
    closingTimeout = setTimeout(close, 5000);
});

onBeforeUnmount(() => {
    clearTimeout(closingTimeout);
});

function close() {
    isHidden.value = true;
    clearTimeout(closingTimeout);
    emit("close");
}
</script>
