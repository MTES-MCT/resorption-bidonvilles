<template>
    <InputShantytowns
        id="location_shantytowns"
        name="location_shantytowns"
        :label="labels.location_shantytowns"
        :columns="['city', 'address', 'fieldType', 'population', 'closedAt']"
        showMandatoryStar
    >
        <template v-slot:info>
            À l'aide du tableau ci-dessous sélectionnez les sites d'intervention
        </template>
    </InputShantytowns>
</template>

<script setup>
import InputShantytowns from "@/components/InputShantytowns/InputShantytowns.vue";
import labels from "../FormDeclarationAction.labels";
</script>
