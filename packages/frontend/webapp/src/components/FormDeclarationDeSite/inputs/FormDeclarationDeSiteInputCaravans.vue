<template>
    <div class="flex space-x-5">
        <TextInput
            id="caravans"
            name="caravans"
            :label="labels.caravans"
            width="w-32"
        />
        <TextInput id="huts" name="huts" :label="labels.huts" width="w-32" />
        <TextInput id="tents" name="tents" :label="labels.tents" width="w-32" />
    </div>
</template>

<script setup>
import { TextInput } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationDeSite.labels";
</script>
