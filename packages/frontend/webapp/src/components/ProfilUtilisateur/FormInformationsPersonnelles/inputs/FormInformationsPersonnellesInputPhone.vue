<template>
    <TextInput
        name="phone"
        :label="labels.phone"
        :value="value"
        info="Affiché dans l'annuaire, il facilite la mise en relation entre acteurs"
    />
</template>

<script setup>
// utils
import { defineProps, toRefs } from "vue";
import labels from "../FormInformationsPersonnelles.labels";

// components
import { TextInput } from "@resorptionbidonvilles/ui";

const props = defineProps({
    default: {
        type: String,
        required: false,
        default: "",
    },
});

const { default: value } = toRefs(props);
</script>
