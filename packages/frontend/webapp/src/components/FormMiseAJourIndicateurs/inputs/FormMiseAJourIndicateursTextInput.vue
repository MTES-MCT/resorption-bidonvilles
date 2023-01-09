<template>
    <TextInput
        :name="name"
        :label="label"
        width="w-32"
        rules="numeric|min_value:0"
    ></TextInput>
</template>
<script setup>
import { defineProps, toRefs } from "vue";

import { TextInput } from "@resorptionbidonvilles/ui";

const props = defineProps({
    name: String,
    label: String,
});
const { name, label } = toRefs(props);
</script>
