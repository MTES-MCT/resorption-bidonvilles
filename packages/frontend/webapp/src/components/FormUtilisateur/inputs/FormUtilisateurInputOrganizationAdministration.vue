<template>
    <AsyncSelect
        name="organization_administration"
        id="organization_administration"
        :label="label"
        :options="options"
        :loader="contactStore.fetchAdministrations"
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
    const unsortedList = contactStore.administrations.map(({ id, name }) => ({
        id,
        label: name,
    }));

    return unsortedList.sort((a, b) => a.label.localeCompare(b.label));
});
</script>
