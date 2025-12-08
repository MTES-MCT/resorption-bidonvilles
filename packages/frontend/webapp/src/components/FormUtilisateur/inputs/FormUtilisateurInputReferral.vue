<template>
    <DsfrRadioButtonSet
        name="referral"
        id="referral"
        :options="radioItems"
        :errorMessage="errors.length > 0 ? errors[0] : ''"
        small
        v-model="values"
        @blur="handleBlur"
        :valid-message="
            values && errors.length === 0 && `Le champ '${label}' est valide`
        "
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
import items from "@/utils/contact_referrals.js";
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
    return items[language.value] ?? items.fr;
});

const { value: values, errors, handleBlur } = useField("referral", "required");
</script>

<style scoped>
:deep(fieldset) {
    margin-bottom: 0 !important;
}
</style>
