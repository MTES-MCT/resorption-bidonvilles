<template>
    <AsyncSelect
        name="organization_public"
        id="organization_public"
        :label="label"
        :options="options"
        :loader="refreshOptions"
        mode="grouped"
        ref="select"
        showMandatoryStar
    />
</template>

<script setup>
import { toRefs, watch, ref } from "vue";
import { useFieldValue, useField } from "vee-validate";
import { AsyncSelect } from "@resorptionbidonvilles/ui";
import { getOrganizations } from "@/api/organization_types.api";

const props = defineProps({
    label: String,
});
const { label } = toRefs(props);

const options = ref([]);
const select = ref(null);
const organizationType = useFieldValue("organization_type");
const { handleChange } = useField("organization_public");
async function refreshOptions() {
    const territoriesLabels = {
        region: "Région",
        departement: "Département",
        city: "Commune",
        nation: "National",
    };

    options.value = [];
    const response = await getOrganizations(organizationType.value);
    response.organizations.map((organization) => {
        options.value.push({
            label: territoriesLabels[organization.structureslist.type],
            options: organization.structureslist.organizations.map(
                (territory) => {
                    return {
                        id: territory.id,
                        label:
                            organization.structureslist
                                .organization_type_name === "Sous-préfecture"
                                ? `${territory.territory} - ${territory.name}`
                                : territory.territory,
                    };
                }
            ),
        });
    });
}

watch(organizationType, () => {
    handleChange(undefined, false);
    select.value.reload();
});
</script>
