<template>
    <div>
        <div class="py-16">
            <div class="flex justify-between">
                <div>
                    <h2 class="text-display-lg mb-4 whitespace-nowrap">
                        Liste des utilisateurs
                    </h2>
                    <router-link to="/typologie-des-acces" class="link">
                        <Icon icon="file-pdf" />
                        Guide des accès et de l'administrateur</router-link
                    >
                </div>

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
                    v-if="
                        $store.getters['config/hasPermission'](
                            'contact_form_referral.access'
                        )
                    "
                    @click="exportReferrals"
                    :loading="loading"
                    icon="file-excel"
                    iconPosition="left"
                    variant="primaryOutline"
                    class="whitespace-no-wrap mr-4"
                >
                    Exporter "Comment avez-vous connu..."</Button
                >
                <Button
                    v-if="
                        $store.getters['config/hasPermission'](
                            'shantytown_actor.export'
                        )
                    "
                    @click="exportActors"
                    :loading="loading"
                    icon="file-excel"
                    iconPosition="left"
                    variant="primaryOutline"
                    class="whitespace-no-wrap mr-4"
                >
                    Exporter les intervenants</Button
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
import { listExport } from "#helpers/api/user";
import { fetchCSV } from "#helpers/api/contactFormReferral";
import { exportActors } from "#helpers/api/actor";
import UserListHeaderSearch from "#app/pages/UserList/UserListHeader/UserListHeaderSearch";
import { notify } from "#helpers/notificationHelper";

export default {
    props: {
        filters: {
            type: Object
        }
    },
    data() {
        return {
            loading: false
        };
    },
    components: {
        UserListHeaderSearch
    },
    computed: {
        user() {
            return this.$store.state.config.configuration.user;
        }
    },
    methods: {
        async exportUsers() {
            if (this.loading) {
                return;
            }

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
        async exportReferrals() {
            if (this.loading) {
                return;
            }

            this.loading = true;

            try {
                // We don't open it directly as permissions needs to be checked with user's token
                const { csv } = await fetchCSV();

                const hiddenElement = document.createElement("a");
                hiddenElement.href =
                    "data:text/csv;charset=utf-8," + encodeURI(csv);
                hiddenElement.target = "_blank";
                hiddenElement.download = "referrals.csv";
                hiddenElement.click();
            } catch (err) {
                notify({
                    group: "notifications",
                    type: "error",
                    title: "Une erreur est survenue",
                    text: "Une erreur est survenue durant l'export des données"
                });
            }
            this.loading = false;
        },
        async exportActors() {
            if (this.loading) {
                return;
            }

            this.loading = true;

            try {
                // We don't open it directly as permissions needs to be checked with user's token
                const { csv } = await exportActors();

                const hiddenElement = document.createElement("a");
                hiddenElement.href =
                    "data:text/csv;charset=utf-8," + encodeURI(csv);
                hiddenElement.target = "_blank";
                hiddenElement.download = "intervenants.csv";
                hiddenElement.click();
            } catch (err) {
                notify({
                    group: "notifications",
                    type: "error",
                    title: "Une erreur est survenue",
                    text:
                        "Une erreur est survenue durant l'export des intervenants"
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
