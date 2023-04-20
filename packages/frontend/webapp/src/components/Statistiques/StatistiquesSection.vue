<template>
    <section>
        <h2 class="text-lg font-bold">
            {{ title }}
        </h2>
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
