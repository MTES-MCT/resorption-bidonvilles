<template>
    <CheckableGroup id="email_subscriptions" :label="label">
        <Checkbox
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            variant="checkbox"
            name="email_subscriptions"
        />
    </CheckableGroup>
</template>

<script setup>
import { computed } from "vue";
import { CheckableGroup, Checkbox } from "@resorptionbidonvilles/ui";
import labels from "../FormAbonnements.labels";
import subscriptions from "@/utils/email_subscriptions";

const { email_subscriptions: label } = labels;
const items = computed(() => {
    return Object.keys(subscriptions).map((key) => ({
        value: key,
        label: subscriptions[key],
    }));
});
</script>
