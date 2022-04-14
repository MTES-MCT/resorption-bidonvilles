<template>
    <div>
        <div
            v-if="isOpen"
            @click="clickBackdrop"
            class="fixed inset-0 bg-gray-500 opacity-75 z-backdrop"
            ref="backdrop"
        ></div>
        <div
            :class="[
                'fixed z-sidePanel top-0 bottom-0 right-0 overflow-y-auto full-height transform transition ease-in-out duration-500',
                isOpen ? 'translate-x-0' : 'translate-x-full'
            ]"
        >
            <div :class="['min-h-screen w-128 bg-white']">
                <slot />
            </div>
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
        clickBackdrop() {
            if (this.isOpen && this.closeClickOutside) {
                this.closePanel();
            }
        }
    }
};
</script>

<!-- leaftlet has a 999 index -->
<style>
.z-backdrop {
    z-index: 1000;
}

.z-sidePanel {
    z-index: 1001;
}
</style>
