<template>
    <section>
        <header class="md:flex items-start mb-5">
            <h2 class="pt-2 text-xl font-bold">
                {{ title }}
            </h2>
            <div
                role="tablist"
                aria-label="Types de sites"
                class="pt-2 flex flex-1 justify-between items-start"
            >
                <slot name="header_left" />
                <slot name="header_right" />
            </div>
        </header>

        <slot />
    </section>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
});

const { title } = toRefs(props);
</script>
