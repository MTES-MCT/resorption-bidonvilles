<template>
    <section class="shadow-lg p-6">
        <h1 class="text-3xl text-primary">{{ title }}</h1>
        <slot />
    </section>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
    title: String,
});
const { title } = toRefs(props);
</script>
