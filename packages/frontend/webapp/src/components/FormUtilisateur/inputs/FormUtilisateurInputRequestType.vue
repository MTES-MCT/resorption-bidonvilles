<template>
    <DsfrRadioButtonSet
        name="request_type"
        id="request_type"
        :options="radioItems"
        :errorMessage="errors.length > 0 ? errors[0] : ''"
        small
        v-model="values"
        @blur="handleBlur"
        class="!mb-0"
    >
        <template #legend>
            <span class="font-bold not-italic" aria-hidden="true">{{
                label
            }}</span>
        </template>
    </DsfrRadioButtonSet>
</template>

<script setup>
import items from "@/utils/access_request_types.js";
import { defineProps, toRefs, computed } from "vue";
import { useField } from "vee-validate";

const props = defineProps({
    label: String,
    language: {
        type: String,
        default: "fr",
    },
});

const { label, language } = toRefs(props);

const radioItems = computed(() => {
    return items[language.value];
});
const {
    value: values,
    errors,
    handleBlur,
} = useField("request_type", "required");
</script>
