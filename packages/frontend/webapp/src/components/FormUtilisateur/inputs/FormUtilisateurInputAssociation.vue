<template>
    <AsyncSelect
        name="association"
        id="association"
        :label="label"
        :options="options"
        :loader="contactStore.fetchAssociations"
        mode="grouped"
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
    if (contactStore.associations.length === 0) {
        return [];
    }

    return [
        {
            label: "Autres",
            options: [
                {
                    id: "autre",
                    label: "Je ne trouve pas mon association dans cette liste",
                },
            ],
        },
        {
            label: "Associations référencées",
            options: contactStore.associations.map(
                ({ name, abbreviation }) => ({
                    id: name,
                    label:
                        abbreviation !== null
                            ? `${abbreviation} (${name})`
                            : name,
                })
            ),
        },
    ];
});
</script>
