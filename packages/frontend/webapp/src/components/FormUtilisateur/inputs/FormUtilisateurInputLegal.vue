<template>
    <CheckableGroup id="legal" direction="row">
        <Checkbox
            :value="true"
            :label="label"
            name="legal"
            variant="checkbox"
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Checkbox } from "@resorptionbidonvilles/ui";
import { defineProps, toRefs } from "vue";

const props = defineProps({
    label: String,
});
const { label } = toRefs(props);
</script>
