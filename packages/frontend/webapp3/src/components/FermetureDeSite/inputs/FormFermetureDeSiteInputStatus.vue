<template>
    <CheckableGroup id="status" :label="labels.status">
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            name="status"
            v-bind="$attrs"
            v-model="status"
        />
    </CheckableGroup>
</template>

<script setup>
import { defineProps, toRefs, ref } from "vue";
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import items from "@/utils/closing_reasons";
import labels from "../FormFermetureDeSite.labels";

const props = defineProps({
    defaultValue: String,
});
const { defaultValue } = toRefs(props);
const status = ref(defaultValue.value);
</script>
