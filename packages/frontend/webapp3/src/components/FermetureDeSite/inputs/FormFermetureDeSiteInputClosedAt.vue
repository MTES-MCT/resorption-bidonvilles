<template>
    <div class="w-64" id="closed_at">
        <DatepickerInput
            name="closed_at"
            :label="labels.closed_at"
            :maxDate="new Date()"
            :clearable="false"
            v-bind="$attrs"
            v-model="closed_at"
        />
    </div>
</template>

<script setup>
import { defineProps, toRefs, ref } from "vue";
import labels from "../FormFermetureDeSite.labels";
import { DatepickerInput } from "@resorptionbidonvilles/ui";

const props = defineProps({
    defaultValue: [Date, String, Number],
});
const { defaultValue } = toRefs(props);
const closed_at = ref(defaultValue.value);
</script>
