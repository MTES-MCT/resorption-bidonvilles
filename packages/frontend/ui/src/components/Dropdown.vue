<template>
    <div ref="dropdownRef" class="relative inline-block dropdown">
        <div @click="toggleMenu">
            <slot name="button" :isOpen="isOpen" />
        </div>
        <div
            :class="[
                'absolute z-10 mt-2 rounded-md shadow-md transform transition ease-in-out duration-200 border-G300 border',
                right ? 'origin-top-right-10 right-0' : 'origin-top-left-10 left-0',
                isOpen ? 'opacity-100' : 'opacity-0 hidden'
            ]"
        >
            <slot name="menu" :closeMenu="closeMenu" />
        </div>
    </div>
</template>

<script setup>
import { ref, toRefs, watchEffect } from "vue";

const props = defineProps({
    right: {
        type: Boolean,
        default: false
    }
});

const { right } = toRefs(props);
const isOpen = ref(false);
const dropdownRef = ref(null);

const checkOutsideClick = (event) => {
    if (isOpen.value && !dropdownRef.value?.contains(event.target)) {
        closeMenu();
    }
};

const closeMenu = () => {
    isOpen.value = false;
};

const toggleMenu = () => {
    isOpen.value = !isOpen.value;
};

watchEffect(() => {
    if (isOpen.value) {
        document.addEventListener("click", checkOutsideClick);
    } else {
        document.removeEventListener("click", checkOutsideClick);
    }
});
</script>
