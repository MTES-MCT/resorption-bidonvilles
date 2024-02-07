<template>
    <AsyncSelect
        name="organization_public"
        id="organization_public"
        :label="label"
        :options="options"
        :loader="refreshOptions"
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
    options.value = [];
    const response = await getOrganizations(organizationType.value);
    options.value = response.organizations.map((organization) => {
        const regex = new RegExp(
            `^${organization.organization_type_name} des?(?: la)? `,
            "i"
        );

        let territoryLabel;
        const nameWithoutType = organization.name.replace(regex, "");
        if (
            organization.name.toLowerCase() ===
            organization.organization_type_name.toLowerCase()
        ) {
            territoryLabel = "France entière";
        } else {
            [, territoryLabel] = nameWithoutType.split(" - ");
        }

        return {
            id: organization.id,
            label: territoryLabel || nameWithoutType,
        };
    });
}

watch(organizationType, () => {
    handleChange(undefined, false);
    select.value.reload();
});
</script>
