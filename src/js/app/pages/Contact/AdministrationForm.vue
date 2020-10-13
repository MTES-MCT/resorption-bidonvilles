<template>
  <div>
    <Select
      id="organization_administration"
      label="Nom de la structure"
      :value="administrationName"
      rules="required"
      @input="val => $emit('update:administrationName', val)"
    >
      <SelectOption value="none">
        - Selectionner un choix -
      </SelectOption>
      <SelectOption
        v-for="item in administrationNameOptions"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </SelectOption>
    </Select>
    <TextInput
      id="position"
      label="Votre fonction"
      :value="administrationFunction"
      rules="required"
      @input="val => $emit('update:administrationFunction', val)"
    />
  </div>
</template>

<script>
import {
    getByCategory as getOrganizationsByCategory,
} from '#helpers/api/organization';

export default {
    props: {
        administrationName: {
            required: true,
        },
        administrationFunction: {
            required: true,

        },
    },
    data() {
        return {
            administrationNameOptions: [],
        };
    },
    async mounted() {
        const { organizations } = await getOrganizationsByCategory('administration');
        this.administrationNameOptions = organizations
            .map(({ id, name }) => ({
                value: id,
                label: name,
            }));
    },
};
</script>
