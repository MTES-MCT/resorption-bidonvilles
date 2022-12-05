<template>
    <InputLocation
        name="territorial_collectivity"
        :label="label"
        placeholder="Nom de la commune, epci, département, ou région"
    />
</template>

<script setup>
import InputLocation from "@/components/InputLocation/InputLocation.vue";
import { defineProps, toRefs } from "vue";

const props = defineProps({
    label: String,
});
const { label } = toRefs(props);
</script>
