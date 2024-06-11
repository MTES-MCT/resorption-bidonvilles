<template>
    <div class="flex gap-x-5 flex-wrap">
        <TextInput
            id="caravans"
            name="caravans"
            :label="labels.caravans"
            width="w-32"
        />
        <TextInput id="huts" name="huts" :label="labels.huts" width="w-32" />
        <TextInput id="tents" name="tents" :label="labels.tents" width="w-32" />
        <TextInput id="cars" name="cars" :label="labels.cars" width="w-32" />
        <TextInput
            id="mattresses"
            name="mattresses"
            :label="labels.mattresses"
            width="w-32"
        />
    </div>
</template>

<script setup>
import { TextInput } from "@resorptionbidonvilles/ui";
import labels from "@/components/Common/FormEtFicheSite.labels";
</script>
