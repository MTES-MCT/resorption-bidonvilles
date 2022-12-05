<template>
    <CheckableGroup label=" " direction="horizontal">
        <Radio
            variant="card"
            label="Oui"
            name="old_vermin_vermin"
            :value="true"
            disabled
        />
        <Radio
            variant="card"
            label="Non"
            name="old_vermin_vermin"
            :value="false"
            disabled
        />
        <Radio
            variant="card"
            label="Inconnu"
            name="old_vermin_vermin"
            :value="null"
            disabled
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
</script>
