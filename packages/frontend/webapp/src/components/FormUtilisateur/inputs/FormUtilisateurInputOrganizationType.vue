<template>
    <AsyncSelect
        name="organization_type"
        id="organization_type"
        :label="label"
        :options="options"
        :loader="contactStore.fetchPublicEstablishmentTypes"
        showMandatoryStar
    />
</template>

<script setup>
import { computed } from "vue";
import { AsyncSelect } from "@resorptionbidonvilles/ui";
import { useContactStore } from "@/stores/contact.store.js";
import { defineProps, toRefs } from "vue";

const props = defineProps({
    label: String,
});
const { label } = toRefs(props);

const contactStore = useContactStore();

const options = computed(() => {
    return contactStore.public_establishment_types.map(
        ({ id, abbreviation, name_singular }) => ({
            id,
            label: abbreviation || name_singular,
        })
    );
});
</script>
