<template>
    <div class="mb-4">
        <AutocompleteV2
            id="government"
            label="Pilote de l'action"
            info="Tapez les premières lettres du nom, du prénom de la personne ou ou du libellé de la structure"
            prefixIcon="user"
            :search="autocomplete"
            :loading="searching"
            :getResultValue="getResultValue"
            :showMandatoryStar="true"
            placeholder="Tapez les premières lettres du nom, du prénom ou du libellé de la structure"
            ref="autocomplete"
            @submit="addManager($event)"
        ></AutocompleteV2>
        <TagList :tags="labeledManagers" :onDelete="removeManager" />
    </div>
</template>

<script>
import { TagList } from "@resorptionbidonvilles/ui";
import { searchUsers } from "#frontend/common/api/user";

export default {
    components: {
        TagList
    },
    props: {
        value: {
            type: Array,
            required: false,
            default: () => []
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    data() {
        return {
            searching: false
        };
    },

    methods: {
        async autocomplete(query) {
            if (!query || query.length < 3) {
                return Promise.resolve([]);
            }

            this.searching = true;
            const users = await searchUsers(query);
            const sortedUsers = this.sortUsers(users);
            this.searching = false;

            return sortedUsers.slice(0, 10);
        },

        getResultValue(user) {
            if (!user || !user.first_name) {
                return "";
            }
            return this.getUserInfo(user);
        },

        addManager(user) {
            if (user) {
                this.managers.push(user);
            }
            this.$refs.autocomplete.empty();
        },

        removeManager(managerId) {
            const idx = this.managers.findIndex(({ id }) => id === managerId);
            if (idx === undefined) {
                return;
            }

            this.managers.splice(idx, 1);
        },

        getUserInfo(user) {
            return `${user.last_name.toUpperCase()} ${user.first_name} - ${user
                .organization.abbreviation || user.organization.name}`;
        },

        sortUsers(users) {
            return users.sort((userA, userB) => {
                return userA.last_name.toUpperCase() >
                    userB.last_name.toUpperCase()
                    ? 1
                    : -1;
            });
        }
    },
    computed: {
        managers: {
            // getter
            get() {
                return this.value;
            },
            // setter
            set(newValue) {
                this.managers = newValue.length > 0 ? newValue : new Array();
            }
        },
        labeledManagers() {
            return this.managers.map(manager => ({
                ...manager,
                label: this.getResultValue(manager)
            }));
        }
    },
    watch: {
        managers() {
            this.$emit("input", this.managers);
        }
    }
};
</script>
