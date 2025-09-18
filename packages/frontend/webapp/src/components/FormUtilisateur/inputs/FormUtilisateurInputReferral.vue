<template>
    <CheckableGroup id="referral" :label="label" class="!mb-2">
        <DsfrRadioButtonSet
            name="referral"
            :options="radioItems"
            small
            v-model="values"
            class="!mb-0"
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup } from "@resorptionbidonvilles/ui";
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

const { value: values } = useField("referral");

const radioItems = computed(() => {
    return items[language.value];
});
</script>

<style scoped>
:deep(fieldset) {
    margin-bottom: 0 !important;
}
</style>
