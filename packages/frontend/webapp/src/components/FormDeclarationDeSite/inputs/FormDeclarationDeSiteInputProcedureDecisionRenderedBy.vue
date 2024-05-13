<template>
    <TextInput
        name="administrative_order_decision_rendered_by"
        id="administrative_order_decision_rendered_by"
        :label="labels.administrative_order_decision_rendered_by"
        info="Maire, préfet, autre."
    />
</template>

<script setup>
import { TextInput } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationDeSite.labels";
</script>
