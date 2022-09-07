<template>
    <div class="mb-4">
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
            ref="autocomplete"
            @submit="addManager($event)"
        ></AutocompleteV2>
        <ul v-if="managers.length > 0">
            <li v-for="manager in managers" :key="manager.id">
                {{ manager.first_name }} {{ manager.last_name }} -
                {{
                    manager.organization.abbreviation ||
                        manager.organization.name
                }}
            </li>
        </ul>
        <div v-else>Aucun manager sélectionné</div>
    </div>
</template>

<script>
import { searchUsers } from "#helpers/api/user";

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
            input: this.value,
            managers: []
        };
    },

    methods: {
        async autocomplete(query) {
            if (!query || query.length < 3) {
                return Promise.resolve([]);
            }

            this.searching = true;
            const users = await searchUsers(query);
            users.sort((userA, userB) => {
                return userA.last_name.toUpperCase() >
                    userB.last_name.toUpperCase()
                    ? 1
                    : -1;
            });
            this.searching = false;

            return users.slice(0, 10);
        },

        getResultValue(user) {
            if (!user || !user.first_name) {
                return "";
            }

            return `${user.last_name.toUpperCase()} ${user.first_name} - ${user
                .organization.abbreviation || user.organization.name}`;
        },

        addManager(user) {
            if (user) {
                this.managers.push(user);
            }
            this.$refs.autocomplete.empty();
        }
    }
};
</script>
