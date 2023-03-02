<template>
    <AsyncSelect
        name="organization_public"
        :label="label"
        :options="options"
        :loader="refreshOptions"
        ref="select"
    />
</template>

<script setup>
import { watch, ref } from "vue";
import { useFieldValue, useField } from "vee-validate";
import { AsyncSelect } from "@resorptionbidonvilles/ui";
import { getOrganizations } from "@/api/organization_types.api";
import { defineProps, toRefs } from "vue";

const props = defineProps({
    label: String,
});
const { label } = toRefs(props);

const options = ref([]);
const select = ref(null);
const organizationType = useFieldValue("organization_type");
const { handleChange } = useField("organization_public");
async function refreshOptions() {
    options.value = [];
    const response = await getOrganizations(organizationType.value);
    options.value = response.organizations.map((organization) => {
        const level = organization.location_type;
        let label = organization[`${level}_name`];

        if (level === "nation") {
            label = "France";
        } else if (organization.organization_type_uid === "rectorat") {
            label = organization.name.split(" - ")[1];
        } else if (organization.organization_type_uid === "sous_pref") {
            label = `${organization[`departement_code`]} - ${
                organization.name.split(" de ")[1]
            }`;
        } else if (level === "departement") {
            label = `${organization[`${level}_code`]} - ${
                organization[`${level}_name`]
            }`;
        }

        return {
            id: organization.id,
            label,
        };
    });
}

watch(organizationType, () => {
    handleChange(undefined, false);
    select.value.reload();
});
</script>
