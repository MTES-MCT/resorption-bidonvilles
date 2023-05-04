<template>
    <section class="flex space-x-3 items-end">
        <DatepickerInput label="Du" withoutMargin />
        <DatepickerInput label="Au" withoutMargin />
        <Button class="h-9">Valider</Button>
    </section>
</template>

<script setup>
import { Button, DatepickerInput } from "@resorptionbidonvilles/ui";
</script>
