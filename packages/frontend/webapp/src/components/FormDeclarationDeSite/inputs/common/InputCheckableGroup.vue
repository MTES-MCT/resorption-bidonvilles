<template>
    <CheckableGroup :id="fieldName" direction="horizontal">
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            :name="fieldName"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import { toRefs } from "vue";
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";

const props = defineProps({
    fieldName: {
        type: String,
        required: true,
    },
    items: {
        type: Array,
        required: true,
    },
});

const { fieldName, items } = toRefs(props);
</script>
