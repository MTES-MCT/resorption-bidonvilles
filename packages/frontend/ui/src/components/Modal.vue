<template>
    <div :class="[
        'fixed z-[1005] inset-0 transform transition ease-in-out duration-300',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
    ]">
        <div class="absolute w-full h-full bg-gray-500 opacity-75"></div>
        <div class="flex items-center justify-center h-full">
            <div role="dialog" ref="dialog" aria-modal="true" aria-labelledby="modal-headline"
                class="opacity-100 z-50 shadow-xl max-h-[95vh] overflow-auto">
                <div class="bg-white" ref="trapRef" role="dialog">
                    <slot name="header">
                        <div class="pt-10 px-10 pb-4">
                            <div class="flex justify-between items-center border-b-1 border-G400">
                                <h1 :class="`text-display-md font-bold text-primary ${titleClass}`" >
                                    <slot name="title" />
                                </h1>
                                <div>
                                    <Button v-if="allowClose" variant="primaryText" icon="times" size="lg" type="button"
                                        @click="$emit('close')" />
                                </div>
                            </div>

                            <div v-if="$slots.subtitle" class="mt-2">
                                <slot name="subtitle" />
                            </div>
                        </div>
                    </slot>
                    <div class="px-10 pb-4 xs:pb-10 max-w-3xl">
                        <slot name="body" />
                    </div>

                    <div v-if="$slots.footer" class="px-4 pb-8 sm:px-6 flex justify-start sm:justify-end">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import useFocusTrap from "../composables/useFocusTrap";
import {
    defineProps,
    ref,
    toRefs,
    onMounted,
    onBeforeUnmount,
    defineEmits,
    defineExpose,
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
    titleClass: {
        type: String,
        required: false,
    },
});

const { isOpen, closeWhenClickOutside, allowClose } = toRefs(props);
const openedAt = ref(null);
const dialog = ref(null);
const emit = defineEmits(["close"]);
const { trapRef } = useFocusTrap();

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
    document.addEventListener("keyup", checkEscape);
}
function onHidden() {
    if (closeWhenClickOutside.value === true) {
        document.removeEventListener("click", checkOutsideClick);
    }
    document.removeEventListener("keyup", checkEscape);
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

function checkEscape(event) {
    if (isOpen.value === true && event.keyCode === 27) {
        emit("close");
    }
}

defineExpose({
    close() {
        emit("close");
    },
});
</script>
