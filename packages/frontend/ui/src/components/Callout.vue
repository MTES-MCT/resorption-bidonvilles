<template>
    <div class="flex gap-4 bg-G200 border-l-4 border-blue400 px-4 py-6">
        <Icon icon="circle-info" />
        <div class="pt-6">
            <h3 class="font-bold text-xl"><slot name="title" /></h3>
            <slot />
        </div>
    </div>
</template>

<script setup>
import Icon from './Icon.vue';
</script>