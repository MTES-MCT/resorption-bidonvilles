<template>
  <div>
    <Select
      id="organization_type"
      label="Précisez le type de structure"
      :value="organizationType"
      rules="required"
      @input="val => $emit('update:organizationType', val)"
    >
      <SelectOption value="none">
        - Selectionner un choix -
      </SelectOption>
      <SelectOption
        v-for="item in orgTypesOptions"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </SelectOption>
    </Select>
    <Select
      id="organization_public"
      label="Territoire de rattachement"
      :value="organizationTerritory"
      rules="required"
      @input="val => $emit('update:organizationTerritory', val)"
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
      id="position"
      label="Votre fonction"
      :value="organizationFunction"
      rules="required"
      @input="val => $emit('update:organizationFunction', val)"
    />
  </div>
</template>

<script>
import { getByType as getOrganizationsByType, types as getOrgTypes } from '#helpers/api/organization';

export default {
    props: {
        organizationType: {
            required: true,
        },
        organizationTerritory: {
            required: true,
        },
        organizationFunction: {
            required: true,

        },
    },
    data() {
        return {
            orgTypesOptions: [],
            orgTerritoryOptions: [],
        };
    },
    watch: {
        async organizationType(newVal) {
            if (newVal === 'none') {
                this.orgTerritoryOptions = [];
                return;
            }

            const { organizations } = await getOrganizationsByType(newVal);

            this.orgTerritoryOptions = organizations.map((organization) => {
                const level = organization.location_type;
                let label = organization[`${level}_name`];

                if (level === 'nation') {
                    label = 'France';
                } else if (level === 'departement') {
                    label = `${organization[`${level}_code`]} - ${organization[`${level}_name`]}`;
                }

                return {
                    value: organization.id,
                    label,
                };
            });
        },

    },
    async mounted() {
        const { types } = await getOrgTypes('public_establishment');
        this.orgTypesOptions = types
            .filter(({ numberOfOrganizations }) => numberOfOrganizations > 0)
            .filter(({ name_singular: name }) => name !== 'Gendarmerie nationale')
            .map(({ id, name_singular: name, abbreviation }) => ({
                value: id,
                label: abbreviation || name,
            }));
    },
};
</script>
