<template>
    <AutocompleteV2
        id="government"
        label="Pilote de l'action"
        info="Tapez les premières lettres du nom ou du prénom de la personne"
        prefixIcon="user"
        :search="autocomplete"
        :loading="searching"
        :getResultValue="getResultValue"
        :showMandatoryStar="true"
        placeholder="Tapez les premières lettres du nom ou du prénom"
        :defaultValue="input"
        v-model="input"
        @submit="$emit('input', $event)"
    ></AutocompleteV2>
</template>

<script>
import { getMembersOfCategory } from "#helpers/api/organization";

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
            const results = await getMembersOfCategory(
                "public_establishment",
                undefined,
                undefined,
                query
            );
            this.searching = false;

            return results.users.slice(0, 10);
        },

        getResultValue(user) {
            if (!user || !user.first_name) {
                return "";
            }

            return `${user.first_name} ${user.last_name.toUpperCase()} - ${user
                .organization.abbreviation || user.organization.name}`;
        }
    }
};
</script>
