<template>
    <TextArea id="access_request_message" :label="label" :rows="8" />
</template>

<script setup>
import { TextArea } from "@resorptionbidonvilles/ui";
import { defineProps, toRefs } from "vue";

const props = defineProps({
    label: String,
});
const { label } = toRefs(props);
</script>
