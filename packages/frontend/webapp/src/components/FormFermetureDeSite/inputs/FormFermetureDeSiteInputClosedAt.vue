<template>
    <div class="w-64" id="closed_at">
        <DatepickerInput
            name="closed_at"
            :label="labels.closed_at"
            :maxDate="new Date()"
            :clearable="false"
            v-bind="$attrs"
        />
    </div>
</template>

<script setup>
import labels from "../FormFermetureDeSite.labels";
import { DatepickerInput } from "@resorptionbidonvilles/ui";
</script>
