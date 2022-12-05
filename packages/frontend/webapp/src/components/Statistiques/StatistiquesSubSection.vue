<template>
    <article>
        <h3 class="text-md mb-4">
            {{ title }}
        </h3>
        <slot />
    </article>
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
