<template>
    <p class="flex space-x-6">
        <DatepickerInput
            name="started_at"
            id="started_at"
            :label="labels.started_at"
            :maxDate="values.ended_at || null"
            showMandatoryStar
        />
        <DatepickerInput
            v-if="mode === 'edit'"
            name="ended_at"
            id="ended_at"
            :label="labels.ended_at"
            info="(optionnel)"
            inlineInfo
            :minDate="values.started_at"
        />
    </p>
</template>

<script setup>
import { useFormValues } from "vee-validate";
import { DatepickerInput } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationAction.labels";
import { toRefs } from "vue";

const props = defineProps({
    mode: {
        type: String,
        required: true,
    },
});
const { mode } = toRefs(props);
const values = useFormValues();
</script>
