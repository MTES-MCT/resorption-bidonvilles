<template>
    <p class="mt-5 font-bold">
        Exporter la situation de ces sites à la date du :
    </p>
    <DatepickerInput
        v-model="mDate"
        :maxDate="new Date()"
        v-bind="$attrs"
        :clearable="false"
    />
</template>

<script setup>
import { defineProps, computed, defineEmits } from "vue";
import { DatepickerInput } from "@resorptionbidonvilles/ui";

const props = defineProps({
    date: [Date, String],
});
const emit = defineEmits(["update:date"]);

const mDate = computed({
    get() {
        return props.date;
    },
    set(newValue) {
        emit("update:date", newValue);
    },
});
</script>
