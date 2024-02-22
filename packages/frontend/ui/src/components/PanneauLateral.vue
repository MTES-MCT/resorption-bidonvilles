<template>
    <div>
        <div class="fixed top-0 left-0 bg-black w-full h-full transition ease-in-out duration-500"
            :class="isOpen ? 'opacity-85' : 'opacity-0'" @transitionstart="showShadow" @transitionend="hideShadow"
            ref="shadow"></div>

        <div class="fixed top-0 h-full right-0 z-[2001] bg-white p-6 overflow-y-auto w-128 transform transition ease-in-out duration-500"
            :class="isOpen ? 'translate-x-0' : 'translate-x-full'" ref="container">
            <header v-if="$slots.header" class="mb-3">
                <h2 class="text-primary border-b-2 pb-2">
                    <span class="text-md">
                        <Icon v-if="icon" :icon="icon" class="mr-2" />
                    </span>
                    <span class="text-lg">
                        <slot name="header" />
                    </span>
                </h2>
            </header>

            <slot />
        </div>
    </div>
</template>

<script setup>
import {
    toRefs,
    ref,
    watch,
    onMounted,
    onBeforeUnmount,
} from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    icon: {
        type: String,
        required: false,
    },
});
const { icon } = toRefs(props);
const openedAt = ref(null);
const isOpen = ref(false);
const container = ref(null);
const shadow = ref(null);
const zIndexes = {
    visible: "z-[2000]",
    hidden: "-z-50",
};
const emit = defineEmits(["emit"]);

watch(isOpen, () => {
    if (isOpen.value === true) {
        onVisible();
    } else {
        onHidden();
    }
});

onMounted(() => {
    if (isOpen.value === true) {
        onVisible();
        shadow.value.classList.add(zIndexes.visible);
    } else {
        shadow.value.classList.add(zIndexes.hidden);
    }
});

function showShadow() {
    if (isOpen.value === true) {
        shadow.value.classList.remove(zIndexes.hidden);
        shadow.value.classList.add(zIndexes.visible);
    }
}

function hideShadow() {
    if (isOpen.value === false) {
        shadow.value.classList.add(zIndexes.hidden);
        shadow.value.classList.remove(zIndexes.visible);
    }
}

function close() {
    isOpen.value = false;
}

onBeforeUnmount(() => {
    document.removeEventListener("click", checkOutsideClick);
});

function onVisible() {
    openedAt.value = Date.now();
    document.addEventListener("click", checkOutsideClick);
    document.addEventListener("keyup", checkEscape);
}

function onHidden() {
    document.removeEventListener("click", checkOutsideClick);
    document.removeEventListener("keyup", checkEscape);
    emit("close");
}

function checkOutsideClick(event) {
    // ignore outside clicks if the block has been opened less than 100ms ago
    if (Date.now() - openedAt.value <= 100) {
        return;
    }

    if (isOpen.value === true && !container.value?.contains(event.target)) {
        close();
    }
}

function checkEscape(event) {
    if (isOpen.value === true && event.keyCode === 27) {
        close();
    }
}

defineExpose({
    open() {
        isOpen.value = true;
    },
});
</script>
