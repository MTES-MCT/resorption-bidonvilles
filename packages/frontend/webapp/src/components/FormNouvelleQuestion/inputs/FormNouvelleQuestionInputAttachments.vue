<template>
    <InputFiles name="attachments" :multiple="true" ref="input" />
</template>

<script setup>
import { ref } from "vue";
import { InputFiles } from "@resorptionbidonvilles/ui";

const input = ref(null);
defineExpose({
    addFiles: (...args) =>
        input.value?.addFiles ? input.value?.addFiles(...args) : null,
});
</script>
