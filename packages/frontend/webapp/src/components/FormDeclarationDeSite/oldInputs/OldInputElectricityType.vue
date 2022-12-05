<template>
    <CheckableGroup label=" " direction="horizontal">
        <Radio
            v-for="electricityType in configStore.config.electricity_types"
            :key="electricityType.id"
            :value="electricityType.id"
            variant="card"
            :label="electricityType.label"
            name="old_electricity_type"
            disabled
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import { useConfigStore } from "@/stores/config.store";

const configStore = useConfigStore();
</script>
