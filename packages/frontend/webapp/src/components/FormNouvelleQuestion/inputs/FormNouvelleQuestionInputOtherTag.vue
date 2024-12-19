<template>
    <TextInput name="other_tag" id="other_tag" :value="tag" maxlength="35" />
</template>
<script setup>
import { TextInput } from "@resorptionbidonvilles/ui";
import { toRefs } from "vue";

const props = defineProps({
    tag: {
        type: String,
        required: false,
        default: "",
    },
});

const { tag } = toRefs(props);
</script>
