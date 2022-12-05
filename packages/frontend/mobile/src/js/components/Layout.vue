<template>
    <div class="h-full flex flex-col">
        <section class="flex-1 flex flex-col">
            <header><slot name="header"></slot></header>
            <div class="relative flex-1 py-6">
                <div
                    class="overflow-y-scroll absolute top-0 bottom-0 left-0 right-0"
                >
                    <slot name="scroll"></slot>
                </div>
            </div>
        </section>
        <footer>
            <slot name="footer" />
            <Navbar v-if="navbar" />
        </footer>
    </div>
</template>

<script>
import Navbar from "./Navbar/Navbar.vue";

export default {
    props: {
        logo: {
            type: Boolean,
            required: false,
            default: true,
        },
        navbar: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
    components: {
        Navbar,
    },
};
</script>
