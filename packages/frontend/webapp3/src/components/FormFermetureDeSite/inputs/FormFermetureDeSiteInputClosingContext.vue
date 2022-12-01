<template>
    <TextArea
        id="closing_context"
        name="closing_context"
        label="Préciser le contexte de la fermeture et les faits à signaler"
        info="Exemples : incendie, violences, départ spontané des habitants..."
        :rows="5"
        v-model="closing_context"
    />
</template>

<script setup>
import { defineProps, toRefs, ref } from "vue";
import { TextArea } from "@resorptionbidonvilles/ui";

const props = defineProps({
    defaultValue: String,
});
const { defaultValue } = toRefs(props);
const closing_context = ref(defaultValue.value);
</script>
