<template>
    <a :href="href" class="inline-block p-2 hover:bg-blue200 focus:outline-none focus:ring-2 ring-offset-2 ring-info">
        <span class="sr-only">{{ socialVerb }} {{ socialOn }}</span>
        <span class="sr-only" lang="en">{{ socialName }}</span>
        <Icon :icon="`fa-brands ${icon}`" class="text-3xl text-primary" />
    </a>
</template>

<script setup>
import Icon from "../Icon.vue";

const props = defineProps({
    href: String,
    icon: String,
    socialVerb: String,
    socialName: String,
    socialOn: String,
});
</script>
