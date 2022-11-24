<template>
    <ContentWrapper class="flex space-x-8 justify-center items-center">
        <div class="w-96"><slot name="aside" /></div>
        <div class="flex-1"><slot name="body" /></div>
    </ContentWrapper>
</template>

<script setup>
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
</script>
