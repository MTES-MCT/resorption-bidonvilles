<template>
    <article>
        <Icon :icon="icon" />
        <p class="font-bold"><slot name="title" /></p>
        <p><slot name="description" /></p>
    </article>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    icon: String,
});
const { icon } = toRefs(props);
</script>
