<template>
    <CheckableGroup label=" " direction="horizontal">
        <Radio
            variant="card"
            label="Oui"
            name="old_firePrevention_measures"
            :value="true"
            disabled
        />
        <Radio
            variant="card"
            label="Non"
            name="old_firePrevention_measures"
            :value="false"
            disabled
        />
        <Radio
            variant="card"
            label="Inconnu"
            name="old_firePrevention_measures"
            :value="null"
            disabled
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
</script>
