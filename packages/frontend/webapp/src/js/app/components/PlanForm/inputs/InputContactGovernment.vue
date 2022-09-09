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
        <div class="m-4">
            <ul v-if="managers.length > 0" class="item-list">
                <li
                    v-for="(manager, index) in managers"
                    v-bind:key="manager.id"
                    class="item mt-2"
                >
                    <Button
                        v-if="managers.length > 0"
                        @click="removeManager(index)"
                        class="mr-2"
                        size="sm"
                    >
                        Supprimer
                    </Button>
                    <span class="value">{{ getResultValue(manager) }}</span>
                </li>
            </ul>
            <div v-else>Aucun pilote sélectionné</div>
        </div>
    </div>
</template>

<script>
import { searchUsers } from "#helpers/api/user";

export default {
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

        removeManager(idx) {
            if (this.managers.length < 1) {
                return;
            } else {
                this.managers.splice(idx, 1);
            }
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
        }
    },
    watch: {
        managers() {
            this.$emit("input", this.managers);
        }
    }
};
</script>
<style>
.item-list {
    display: flex;
    flex-direction: column;
    width: 45em;
    list-style-type: none;
    padding-left: 1em;
}

.item {
    display: flex;
    flex-direction: row;
    flex: 1;
    margin-bottom: 0.25em;
}

.item .value {
    display: flex;
    flex: 1;
}
</style>
