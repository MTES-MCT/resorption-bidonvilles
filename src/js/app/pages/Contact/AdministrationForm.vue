<template>
    <div>
        <Select
            label="Nom de la structure"
            :value="administrationName"
            @input="val => $emit('update:administrationName', val)"
            rules="required"
            id="organization_administration"
        >
            <SelectOption value="none">- Selectionner un choix -</SelectOption>
            <SelectOption
                v-for="item in administrationNameOptions"
                :key="item.value"
                :value="item.value"
                >{{ item.label }}</SelectOption
            >
        </Select>
        <TextInput
            label="Votre fonction"
            :value="administrationFunction"
            @input="val => $emit('update:administrationFunction', val)"
            rules="required"
            id="position"
        />
    </div>
</template>

<script>
import { getByCategory as getOrganizationsByCategory } from "#helpers/api/organization";

export default {
    props: {
        administrationName: {
            required: true
        },
        administrationFunction: {
            required: true
        }
    },
    data() {
        return {
            administrationNameOptions: []
        };
    },
    async mounted() {
        const { organizations } = await getOrganizationsByCategory(
            "administration"
        );
        this.administrationNameOptions = organizations.map(({ id, name }) => ({
            value: id,
            label: name
        }));
    }
};
</script>
