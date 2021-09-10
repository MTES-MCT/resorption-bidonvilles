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
            <div class="flex items-center">
                <Button
                    v-if="user.role_id === 'national_admin'"
                    @click="exportUsers"
                    :loading="loading"
                    icon="file-excel"
                    iconPosition="left"
                    variant="primaryOutline"
                    class="whitespace-no-wrap mr-4"
                >
                    Exporter</Button
                >
                <Button
                    href="/nouvel-utilisateur"
                    icon="plus"
                    iconPosition="left"
                    variant="secondary"
                    class="whitespace-no-wrap"
                >
                    Ajouter un utilisateur</Button
                >
            </div>
        </div>
    </div>
</template>

<script>
import { get as getConfig } from "#helpers/api/config";
import { listExport } from "#helpers/api/user";
import UserListHeaderSearch from "#app/pages/UserList/UserListHeader/UserListHeaderSearch";
import { notify } from "#helpers/notificationHelper";

export default {
    props: {
        filters: {
            type: Object
        }
    },
    data() {
        const { user } = getConfig();

        return {
            user,
            loading: false
        };
    },
    components: {
        UserListHeaderSearch
    },
    computed: {},
    methods: {
        async exportUsers() {
            this.loading = true;
            try {
                // We don't open it directly as permissions needs to be checked with user's token
                const { csv } = await listExport();

                const hiddenElement = document.createElement("a");
                hiddenElement.href =
                    "data:text/csv;charset=utf-8," + encodeURI(csv);
                hiddenElement.target = "_blank";
                hiddenElement.download = "users.csv";
                hiddenElement.click();
            } catch (err) {
                notify({
                    group: "notifications",
                    type: "error",
                    title: "Une erreur est survenue",
                    text:
                        "Une erreur est survenue durant l'export des utilisateurs"
                });
            }
            this.loading = false;
        },
        handleSearchBlur(data) {
            this.$emit("update:location", data.value);
        }
    }
};
</script>
