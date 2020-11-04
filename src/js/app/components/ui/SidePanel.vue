<template>
    <div
        :class="[
            'fixed z-30 top-0 right-0 full-height transform transition ease-in-out duration-500',
            isOpen ? 'translate-x-0' : 'translate-x-full'
        ]"
    >
        <div :class="['min-h-screen w-64 bg-primary text-white py-4 px-4 ']">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        closePanel: {
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
