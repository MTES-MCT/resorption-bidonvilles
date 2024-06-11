<template>
    <TextInput
        name="insalubrity_order_by"
        id="insalubrity_order_by"
        :label="labels.insalubrity_order_by"
        info="Maire, préfet, autre."
    />
</template>

<script setup>
import { TextInput } from "@resorptionbidonvilles/ui";
import labels from "@/components/Common/FormEtFicheSite.labels";
</script>
