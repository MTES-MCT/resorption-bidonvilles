<template>
    <a :href="href" class="inline-block p-2 hover:bg-blue200">
        <Icon :icon="`fa-brands ${icon}`" class="text-3xl text-primary" />
    </a>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    href: String,
    icon: String,
});

const { href, icon } = toRefs(props);
</script>
