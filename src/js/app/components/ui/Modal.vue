<template>
    <div
        :class="[
            'fixed z-40 inset-0 transform transition ease-in-out duration-300',
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        ]"
    >
        <div class="absolute w-full h-full bg-gray-500 opacity-75"></div>
        <div class="flex items-center justify-center min-h-screen">
            <div
                role="dialog"
                ref="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
                class="opacity-100 z-50 max-w-xl shadow-xl overflow-hidden rounded-lg"
            >
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="flex justify-between">
                        <div class="text-display-md">
                            <slot name="header" />
                        </div>
                        <Button
                            variant="text"
                            icon="times"
                            @click="closeModal"
                        />
                    </div>
                    <div class="mt-4"><slot name="body" /></div>
                </div>
                <div
                    v-if="$slots.footer"
                    class="bg-gray-200 px-4 py-3 sm:px-6 flex justify-end"
                >
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        closeModal: {
            type: Function
        },
        isOpen: {
            type: Boolean
        },
        closeClickOutside: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        checkOutsideClick(event) {
            if (
                this.isOpen &&
                this.closeModal &&
                !this.$refs.dialog.contains(event.target)
            ) {
                this.closeModal();
            }
        }
    },
    mounted() {
        if (this.closeClickOutside) {
            document.addEventListener("click", this.checkOutsideClick);
        }
    },
    destroyed() {
        if (this.closeClickOutside) {
            document.removeEventListener("click", this.checkOutsideClick);
        }
    }
};
</script>
