<template>
    <Button
        variant="primaryText"
        icon="copy"
        iconPosition="left"
        @click="copy"
        href="#"
        :padding="false"
        class="-ml-2 py-1 px-2 rounded hover:!bg-G200"
        ><slot>Copier</slot></Button
    >
</template>

<script setup>
import { defineProps, toRefs, defineEmits } from "vue";
import copyToClipboard from "@/utils/copyToClipboard";
import { Button } from "@resorptionbidonvilles/ui";
const props = defineProps({
    value: String,
});
const { value } = toRefs(props);
const emit = defineEmits(["copied"]);
function copy(e) {
    copyToClipboard(value.value);
    emit("copied");
    e.preventDefault();
}
</script>
