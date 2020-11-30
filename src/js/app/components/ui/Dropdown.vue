<template>
    <div class="relative">
        <div @click="toggleMenu">
            <slot name="button" />
        </div>
        <div
            :class="[
                'origin-top-left-10 absolute z-10 left-0 mt-2 w-48 rounded-md shadow-lg transform transition ease-in-out duration-200',
                isOpen ? 'opacity-100' : 'opacity-0 hidden'
            ]"
        >
            <slot name="menu" :closeMenu="closeMenu" />
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isOpen: false
        };
    },
    methods: {
        checkOutsideClick(event) {
            if (!this.$el.contains(event.target)) {
                this.closeMenu();
            }
        },
        openMenu() {
            this.isOpen = true;
        },
        closeMenu() {
            this.isOpen = false;
        },
        toggleMenu() {
            this.isOpen = !this.isOpen;
        }
    },
    mounted() {
        // Delay listener, otherwise the check happens before the menu is rendered and close the menu immediately
        setTimeout(() => {
            document.addEventListener("click", this.checkOutsideClick);
        }, 0);
    },
    destroyed() {
        document.removeEventListener("click", this.checkOutsideClick);
    }
};
</script>
