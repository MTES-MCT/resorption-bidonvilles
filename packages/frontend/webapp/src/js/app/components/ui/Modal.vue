<template>
    <div
        :class="[
            'fixed z-40 inset-0 transform transition ease-in-out duration-300',
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        ]"
    >
        <div class="absolute w-full h-full bg-gray-500 opacity-75"></div>
        <div
            :class="[
                'flex items-center justify-center min-h-screen ',
                containerClasses
            ]"
        >
            <div
                role="dialog"
                ref="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
                class="opacity-100 z-50 shadow-xl overflow-hidden "
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
                                <Button
                                    variant="primaryText"
                                    icon="times"
                                    size="lg"
                                    @click="closeModal"
                                />
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
        },
        containerClasses: {
            type: Array
        }
    },
    methods: {
        checkOutsideClick(event) {
            if (this.isOpen && !this.$refs.dialog.contains(event.target)) {
                this.closeModal();
                this.$emit("closeModal");
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
