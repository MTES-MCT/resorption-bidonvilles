<template>
    <div class="bg-yellow-200 flex flex-col px-5 py-8 items-center">
        <Checkbox
            class="px-5"
            :value="true"
            :name="name"
            variant="checkbox"
            :label="label"
            labelClass="gap-5"
        >
        </Checkbox>
        <slot />
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Checkbox } from "@resorptionbidonvilles/ui";

const props = defineProps({
    label: String,
    name: String,
});
const { label, name } = toRefs(props);
</script>
