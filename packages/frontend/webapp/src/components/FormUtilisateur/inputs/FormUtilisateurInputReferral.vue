<template>
    <CheckableGroup id="referral" :label="label">
        <Radio
            v-for="item in items[language]"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            name="referral"
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import items from "@/utils/contact_referrals.js";
import { defineProps, toRefs } from "vue";

const props = defineProps({
    label: String,
    language: {
        type: String,
        default: "fr",
    },
});
const { label, language } = toRefs(props);
</script>
