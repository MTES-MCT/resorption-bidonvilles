<template>
    <div class="border-b-1">
        <header
            class="hover:bg-G200 w-full flex justify-between px-4 py-2 cursor-pointer"
            v-bind:class="{ 'font-bold mb-2': open }"
            @click="toggle()"
        >
            <slot name="title"></slot>
            <div>
                <span v-if="open">-</span>
                <span v-else>+</span>
            </div>
        </header>
        <transition name="fade">
            <p class="pl-4 pb-4" v-if="open"><slot name="content" /></p>
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

<script>
export default {
    data() {
        return {
            open: false
        };
    },

    methods: {
        toggle() {
            this.open = !this.open;
        }
    }
};
</script>
