<template>
    <div class="border-b-1">
        <button class="hover:bg-G200 w-full flex justify-between px-4 py-2 cursor-pointer"
            v-bind:class="{ 'font-bold mb-2': open }" @click="toggle()" :aria-expanded="open" :aria-controls="id">
            <slot name="title"></slot>
            <div aria-hidden="true">
                <span v-if="open">-</span>
                <span v-else>+</span>
            </div>
        </button>
        <transition name="fade">
            <p class="pl-4 pb-4" v-if="open" :id="id">
                <slot name="content" />
            </p>
        </transition>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
});

let open = ref(false);

function toggle() {
    open.value = !open.value;
}
</script>
