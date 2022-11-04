<template>
    <ContentWrapper>
        <p>{{ town.id }}</p>
    </ContentWrapper>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
