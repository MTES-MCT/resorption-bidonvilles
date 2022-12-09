<template>
    <DatepickerInput
        id="closed_at"
        width="w-64"
        name="closed_at"
        :label="labels.closed_at"
        :maxDate="new Date()"
        :clearable="false"
        v-bind="$attrs"
    />
</template>

<script setup>
import labels from "../FormFermetureDeSite.labels";
import { DatepickerInput } from "@resorptionbidonvilles/ui";
</script>
