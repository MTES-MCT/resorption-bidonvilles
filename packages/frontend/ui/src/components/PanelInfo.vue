<template>
    <div>
        <header class="cursor-pointer flex space-x-2 items-center" @click="toggle">
            <p
                class="rounded-full inline-flex items-center justify-center bg-yellow-400 w-6 h-6 text-center text-xs align-middle leading-6">
                <Icon :icon="icon" />
            </p>
            <p class="font-bold">
                <slot name="title" />
            </p>
            <Icon :icon="togglerIcon" />
        </header>
        <transition name="toggle" mode="out-in">
            <div class="bg-yellow-200 p-6 mt-2" v-if="isOpen">
                <slot name="content" />
            </div>
        </transition>
    </div>
</template>

<style scoped>
.toggle-enter-active,
.toggle-leave-active {
    transition: all 0.3s;
    max-height: 500px;
}

.toggle-enter,
.toggle-leave-to {
    opacity: 0;
    max-height: 0px;
}
</style>

<script setup>
import { toRefs, ref, computed } from "vue";
import Icon from "./Icon.vue";

const props = defineProps({
    icon: {
        type: String,
        required: false,
        default: "info-circle"
    },
    defaultStatus: {
        type: String,
        required: false,
        default: "closed" // soit "open", soit "closed"
    }
});
const { icon, defaultStatus } = toRefs(props);

const isOpen = ref(defaultStatus.value === "open");
const togglerIcon = computed(() => {
    if (isOpen.value === false) {
        return "chevron-down";
    }

    return "chevron-up";
});

function toggle() {
    isOpen.value = !isOpen.value;
}
</script>
