<template>
    <div class="bg-orange200 py-16">
        <ContentWrapper>Le journal du site</ContentWrapper>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
