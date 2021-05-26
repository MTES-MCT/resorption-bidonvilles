<template>
    <div>
        <Select
            label="Précisez le type de structure"
            :value="organizationType"
            @input="val => $emit('update:organizationType', val)"
            rules="required"
            id="organization_type"
        >
            <SelectOption value="none">- Selectionner un choix -</SelectOption>
            <SelectOption
                v-for="item in orgTypesOptions"
                :key="item.value"
                :value="item.value"
                >{{ item.label }}</SelectOption
            >
        </Select>
        <Select
            label="Territoire de rattachement"
            :value="organizationTerritory"
            @input="val => $emit('update:organizationTerritory', val)"
            rules="required"
            id="organization_public"
        >
            <SelectOption>- Selectionner un choix -</SelectOption>
            <SelectOption
                v-for="item in orgTerritoryOptions"
                :key="item.value"
                :value="item.value"
            >
                {{ item.label }}
            </SelectOption>
        </Select>
        <TextInput
            label="Votre fonction"
            :value="organizationFunction"
            @input="val => $emit('update:organizationFunction', val)"
            rules="required"
            id="position"
        />
    </div>
</template>

<script>
import {
    getByType as getOrganizationsByType,
    types as getOrgTypes
} from "#helpers/api/organization";

export default {
    props: {
        organizationType: {
            required: true
        },
        organizationTerritory: {
            required: true
        },
        organizationFunction: {
            required: true
        }
    },
    data() {
        return {
            orgTypesOptions: [],
            orgTerritoryOptions: []
        };
    },
    async mounted() {
        const { types } = await getOrgTypes("public_establishment");
        this.orgTypesOptions = types
            .filter(({ numberOfOrganizations }) => numberOfOrganizations > 0)
            .filter(
                ({ name_singular: name }) => name !== "Gendarmerie nationale"
            )
            .map(({ id, name_singular: name, abbreviation }) => ({
                value: id,
                label: abbreviation || name
            }));
    },
    watch: {
        async organizationType(newVal) {
            if (newVal === "none") {
                this.orgTerritoryOptions = [];
                return;
            }

            const { organizations } = await getOrganizationsByType(newVal);

            this.orgTerritoryOptions = organizations.map(organization => {
                const level = organization.location_type;
                let label = organization[`${level}_name`];

                if (level === "nation") {
                    label = "France";
                } else if (level === "departement") {
                    label = `${organization[`${level}_code`]} - ${
                        organization[`${level}_name`]
                    }`;
                }

                return {
                    value: organization.id,
                    label
                };
            });
        }
    }
};
</script>
