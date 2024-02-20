<template>
    <p class="mt-5 font-bold">
        Exporter la situation de ces sites à la date du :
    </p>
    <DatepickerInput :maxDate="new Date()" :clearable="false" name="date" />
</template>

<script setup>
import { DatepickerInput } from "@resorptionbidonvilles/ui";
</script>
