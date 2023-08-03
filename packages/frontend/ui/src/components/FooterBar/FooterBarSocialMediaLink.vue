<template>
    <a :href="href" class="inline-block p-2 hover:bg-blue200 focus:outline-none focus:ring-2 ring-offset-2 ring-info">
        <Icon :icon="`fa-brands ${icon}`" class="text-3xl text-primary" />
    </a>
</template>

<script setup>
import { toRefs } from "vue";
import Icon from "../Icon.vue";

const props = defineProps({
    href: String,
    icon: String,
});

const { href, icon } = toRefs(props);
</script>
