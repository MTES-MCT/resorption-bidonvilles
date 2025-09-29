<template>
    <DsfrRadioButtonSet
        v-model="status"
        id="status"
        name="status"
        small
        :options="items"
        :errorMessage="errors.length > 0 ? errors[0] : ''"
    >
        <template #legend>
            <p class="font-bold">{{ labels.status }}</p>
        </template>
    </DsfrRadioButtonSet>
</template>

<script setup>
import items from "@/utils/closing_reasons";
import labels from "../FormFermetureDeSite.labels";
import { useField } from "vee-validate";

const { value: status, errors } = useField("status", "required");
</script>
