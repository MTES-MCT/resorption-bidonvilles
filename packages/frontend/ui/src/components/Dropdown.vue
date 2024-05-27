<template>
    <div ref="dropdownRef" class="relative inline-block dropdown">
        <div ref="toggleButtonRef" @click="toggleMenu">
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
import { ref, toRefs, watchEffect, watch } from "vue";

const props = defineProps({
    right: {
        type: Boolean,
        default: false
    },
    closeWhenSorted: {
        type: Boolean,
        default: false
    }
});

const { right, closeWhenSorted } = toRefs(props);
const isOpen = ref(false);
const dropdownRef = ref(null);
const toggleButtonRef = ref(null);

const checkOutsideClick = (event) => {
    const isChildElement = dropdownRef.value?.contains(event.target);
    const isToggleButton = toggleButtonRef.value?.contains(event.target); // Nouveau
    if (isOpen.value && (!isChildElement || (isChildElement && closeWhenSorted.value)) && !isToggleButton) {
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

// watch(closeWhenSorted, (newValue) => {
//     if (newValue && newValue === true) {
//         closeMenu();
//     }
// });
</script>
