<template>
    <Button
        icon="pencil"
        iconPosition="left"
        type="button"
        variant="primary"
        :href="`/communaute/modifier-une-question/${question.id}`"
        class="flex-shrink-0"
        >Mettre à jour</Button
    >
</template>

<script setup>
import { toRefs } from "vue";
import { Button } from "@resorptionbidonvilles/ui";

const props = defineProps({
    question: {
        type: Object,
        required: true,
    },
});

const { question } = toRefs(props);
</script>
