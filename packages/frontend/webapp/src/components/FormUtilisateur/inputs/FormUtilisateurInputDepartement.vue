<template>
    <AsyncSelect
        name="departement"
        :label="label"
        :options="options"
        :loader="contactStore.fetchDepartements"
    />
</template>

<script setup>
import { computed } from "vue";
import { AsyncSelect } from "@resorptionbidonvilles/ui";
import { useContactStore } from "@/stores/contact.store.js";
import { toRefs } from "vue";

const props = defineProps({
    label: String,
});
const { label } = toRefs(props);

const contactStore = useContactStore();

const options = computed(() => {
    return contactStore.departements.map(({ code, name }) => ({
        id: code,
        label: `${code} - ${name}`,
    }));
});
</script>
