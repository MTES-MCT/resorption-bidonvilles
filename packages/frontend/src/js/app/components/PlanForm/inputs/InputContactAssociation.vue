<template>
    <AutocompleteV2
        id="association"
        label="Opérateur ou service en charge de l'intervention"
        info="Tapez les premières lettres du nom de l'association"
        prefixIcon="user"
        :search="autocomplete"
        :loading="searching"
        :getResultValue="getResultValue"
        :showMandatoryStar="true"
        placeholder="Tapez les premières lettres du nom de l'association"
        :defaultValue="input"
        v-model="input"
        @submit="$emit('input', $event)"
    ></AutocompleteV2>
</template>

<script>
import { getByCategory } from "#helpers/api/organization";

export default {
    props: {
        value: {
            type: Object,
            required: false
        }
    },

    data() {
        return {
            searching: false,
            input: this.value
        };
    },

    methods: {
        async autocomplete(query) {
            if (!query || query.length < 3) {
                return Promise.resolve([]);
            }

            this.searching = true;
            const results = await getByCategory("association", query);
            this.searching = false;

            return results.organizations.slice(0, 20);
        },

        getResultValue(organization) {
            let name = `${organization.abbreviation || organization.name}`;

            // location is under a property "location" when the assocation is gotten from GET /plans/:id
            const { location } = organization;
            const locationName = location[`${location.type}`].name;
            if (!organization.name.includes(locationName)) {
                name = `${name} — ${locationName}`;
            }

            return name;
        }
    }
};
</script>
