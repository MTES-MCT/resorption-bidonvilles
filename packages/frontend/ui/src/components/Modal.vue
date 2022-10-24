<template>
    <div
        :class="[
            'fixed z-40 inset-0 transform transition ease-in-out duration-300',
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        ]"
    >
        <div class="absolute w-full h-full bg-gray-500 opacity-75"></div>
        <div class="flex items-center justify-center min-h-screen">
            <div
                role="dialog"
                ref="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
                class="opacity-100 z-50 shadow-xl"
            >
                <div class="bg-white">
                    <slot name="header">
                        <div class="pt-10 px-10 pb-4">
                            <div
                                class="flex justify-between items-center border-b-1 border-G400"
                            >
                                <div
                                    class="text-display-md font-bold text-primary"
                                >
                                    <slot name="title" />
                                </div>
                                <div>
                                    <Button
                                        v-if="allowClose"
                                        variant="primaryText"
                                        icon="times"
                                        size="lg"
                                        @click="$emit('close')"
                                    />
                                </div>
                            </div>
                        </div>
                    </slot>
                    <div class="px-10 pt-6 pb-10 max-w-2xl">
                        <slot name="body" />
                    </div>

                    <div
                        v-if="$slots.footer"
                        class="px-4 pb-8 sm:px-6 flex justify-end"
                    >
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    defineProps,
    ref,
    toRefs,
    onMounted,
    onBeforeUnmount,
    defineEmits,
    watch
} from "vue";
import Button from "./Button.vue";

const props = defineProps({
    isOpen: {
        type: Boolean,
    },
    allowClose: {
        type: Boolean,
        default: true
    },
    closeWhenClickOutside: {
        type: Boolean,
        default: false,
    },
});

const { isOpen, closeWhenClickOutside, allowClose } = toRefs(props);
const openedAt = ref(null);
const dialog = ref(null);
const emit = defineEmits(["close"]);

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
    }
});

onBeforeUnmount(() => {
    document.removeEventListener("click", checkOutsideClick);
});

function onVisible() {
    openedAt.value = Date.now();

    if (closeWhenClickOutside.value === true) {
        document.addEventListener("click", checkOutsideClick);
    }
}
function onHidden() {
    if (closeWhenClickOutside.value === true) {
        document.removeEventListener("click", checkOutsideClick);
    }
}

function checkOutsideClick(event) {
    // ignore outside clicks if the modal has been opened less than 100ms ago
    if (Date.now() - openedAt.value <= 100) {
        return;
    }

    if (isOpen.value === true && !dialog.value?.contains(event.target)) {
        emit("close");
    }
}
</script>
