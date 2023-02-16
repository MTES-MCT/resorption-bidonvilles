<template>
    <InputAddress
        id="location_eti"
        name="location_eti"
        :label="labels.location_eti"
        showMandatoryStar
    />
    <section class="h-96 bg-G500" v-if="locationETI">
        <InputCoordinates
            id="location_eti_coordinates"
            name="location_eti_coordinates"
        />
    </section>
</template>

<script setup>
import { watch } from "vue";
import { useFormValues, useFieldValue } from "vee-validate";
import InputAddress from "@/components/InputAddress/InputAddress.vue";
import InputCoordinates from "@/components/InputCoordinates/InputCoordinates.vue";
import labels from "../FormDeclarationAction.labels";

const values = useFormValues();
const locationETI = useFieldValue("location_eti");
watch(locationETI, () => {
    if (!locationETI.value?.data?.coordinates) {
        return;
    }

    values.value.location_eti_coordinates = locationETI.value.data.coordinates;
});
</script>
