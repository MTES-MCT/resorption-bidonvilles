<template>
    <section>
        <header class="md:flex items-start mb-5">
            <h1 class="text-xl font-bold">
                {{ title }}
            </h1>
            <nav class="pt-2 flex flex-1 justify-between items-start">
                <slot name="header_left" />
                <slot name="header_right" />
            </nav>
        </header>

        <slot />
    </section>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
});

const { title } = toRefs(props);
</script>
