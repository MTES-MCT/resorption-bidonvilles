<template>
    <div>
        <div class="py-16">
            <div class="flex justify-between">
                <h2 class="text-display-lg mb-4 whitespace-nowrap">
                    Liste des utilisateurs
                </h2>
                <div>
                    <UserListHeaderSearch
                        :value="filters.search"
                        @input="val => $emit('update:search', val)"
                    />
                    <div class="mt-2">
                        Rechercher par utilisateur, structure, territoire, type
                        d'accès
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-between mb-8">
            <div>
                <div>
                    Filter par
                </div>
                <div>
                    <CustomFilter
                        title="Statut du compte"
                        class="mr-2 mb-2"
                        :value="filters.status"
                        @input="evt => $emit('update:status', evt)"
                        :options="[
                            { value: 'requested', label: 'Demandé' },
                            { value: 'expired', label: 'Expiré' },
                            {
                                value: 'sent',
                                label: 'Envoyé'
                            },
                            {
                                value: 'activated',
                                label: 'Activé'
                            }
                        ]"
                    />
                </div>
            </div>
            <div>
                <Button
                    icon="file-excel"
                    iconPosition="left"
                    variant="primary"
                    class="mr-6 mb-2 md:mb-0"
                    @click="showExport"
                    >Exporter</Button
                >
                <router-link to="/nouvel-utilisateur"
                    ><Button
                        icon="plus"
                        iconPosition="left"
                        variant="secondary"
                        class="whitespace-no-wrap"
                    >
                        Ajouter un utilisateur</Button
                    ></router-link
                >
            </div>
        </div>
    </div>
</template>

<script>
import UserListHeaderSearch from "#app/pages/UserList/UserListHeader/UserListHeaderSearch";

export default {
    props: {
        filters: {
            type: Object
        }
    },
    components: {
        UserListHeaderSearch
    },
    computed: {},
    methods: {
        handleSearchBlur(data) {
            this.$emit("update:location", data.value);
        },
        showExport() {
            window.alert("todo");
        }
    }
};
</script>
