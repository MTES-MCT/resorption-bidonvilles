<template>
    <div class="bg-green200 py-16">
        <ContentWrapper>Le journal de l'action</ContentWrapper>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);
</script>
