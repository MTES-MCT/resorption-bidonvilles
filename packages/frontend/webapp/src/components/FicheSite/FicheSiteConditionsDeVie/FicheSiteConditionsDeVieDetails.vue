<template>
    <section class="border-b-2 border-G200 py-2">
        <p class="flex items-center">
            <Icon class="mr-1 mb-1 font-bold text-G700" :icon="icons[type]" />
            <span class="font-bold">
                {{ wording[type] }}
            </span>
        </p>

        <ul class="list-disc ml-10">
            <li v-for="(item, index) in details" :key="index">
                {{ item.text }}
                <span class="italic">{{
                    item.info ? `- ${item.info}` : ""
                }}</span>
            </li>
        </ul>
    </section>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    type: String,
    details: Array,
});
const { type, details } = toRefs(props);

const icons = {
    positive: "check",
    negative: "exclamation-triangle",
    unknown: "question",
};
const wording = {
    positive: "À entretenir",
    negative: "À améliorer",
    unknown: "Non renseigné",
};
</script>
