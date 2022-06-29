<template>
    <PrivateLayout>
        <PrivateContainer class="py-16">
            <div v-if="state === 'loaded' && user">
                <div class="text-display-lg font-bold mb-8">
                    Fiche utilisateur
                </div>
                <div class="flex">
                    <div class="w-1/3">
                        <UserValidateDetails :user="user" class="mb-4" />
                        <router-link
                            class="link"
                            v-if="loggedUser.role_id === 'national_admin'"
                            :to="'/utilisateur/' + user.id"
                            >Modifier les informations de
                            l'utilisateur</router-link
                        >
                        <div class="border-1 border-G100 w-16 my-4"></div>
                        <UserValidateAccessStatus
                            :user="user"
                            :loggedUser="loggedUser"
                        />
                    </div>

                    <div class="ml-24 w-2/3">
                        <UserValidateRequestMessage
                            :user="user"
                            class="mb-4"
                            v-if="user.access_request_message"
                        />
                        <UserValidateAccessSettings
                            :user="user"
                            :permission="permission"
                            :checkedOptions.sync="checkedOptions"
                            :availableOptions="options"
                            class="mb-4"
                        />
                        <div
                            v-if="loggedUser.role_id === 'national_admin'"
                            class="bg-G100 p-4 my-4"
                        >
                            <UserValidateComment
                                :user="user"
                            ></UserValidateComment>
                        </div>
                        <div
                            class="bg-yellow-200 p-4 mb-12"
                            v-if="user.status === 'new'"
                        >
                            Ne jamais envoyer un accès si vous avez un doute sur
                            l’identité de la personne.
                        </div>
                    </div>
                </div>
                <div class="flex justify-end">
                    <Button
                        v-if="
                            loggedUser.role_id === 'national_admin' &&
                                !user.is_admin &&
                                user.role_id !== 'intervener'
                        "
                        class="mr-4"
                        variant="primaryText"
                        @click="setIntervenant"
                        :loading="validation.loading === 'intervenant'"
                        >Définir comme « Intervenant »</Button
                    >
                    <Button
                        v-if="
                            loggedUser.role_id === 'national_admin' &&
                                user.role_id !== 'local_admin'
                        "
                        class="mr-4"
                        variant="primaryText"
                        @click="upgradeLocalAdmin"
                        :loading="validation.loading === 'upgrade'"
                        >Définir comme « Administrateur local »</Button
                    >
                    <Button
                        v-if="
                            loggedUser.role_id === 'national_admin' &&
                                user.role_id === 'local_admin'
                        "
                        class="mr-4"
                        variant="primaryText"
                        @click="downgradeLocalAdmin"
                        :loading="validation.loading === 'downgrade'"
                        >Retirer rôle « Administrateur local »</Button
                    >

                    <div
                        @mouseover="isHoverDisableAccess = true"
                        @mouseleave="isHoverDisableAccess = false"
                    >
                        <Button
                            v-if="isExpired"
                            class="mr-4"
                            variant="primary"
                            @click="remove"
                            :loading="validation.loading === 'remove'"
                            >Supprimer l'accès</Button
                        >
                        <Button
                            v-if="user.status === 'active'"
                            class="mr-4"
                            variant="primary"
                            @click="remove"
                            :loading="validation.loading === 'remove'"
                            >Désactiver l'accès</Button
                        >
                    </div>
                    <div
                        @mouseover="isHoverDenyAccess = true"
                        @mouseleave="isHoverDenyAccess = false"
                    >
                        <Button
                            v-if="
                                user.status === 'new' &&
                                    user.user_accesses.length === 0
                            "
                            class="mr-4"
                            variant="primary"
                            :loading="validation.loading === 'deny'"
                            @click="deny"
                            >Refuser l'accès</Button
                        >
                    </div>
                    <div
                        @mouseover="isHoverSendAccess = true"
                        @mouseleave="isHoverSendAccess = false"
                    >
                        <Button
                            v-if="user.status === 'new'"
                            variant="tertiary"
                            icon="paper-plane"
                            iconPosition="left"
                            :loading="validation.loading === 'validate'"
                            @click="validate"
                            >Envoyer un accès</Button
                        >
                    </div>
                </div>
                <div class="italic mt-4 flex justify-end h-8">
                    <div v-if="isHoverDenyAccess">
                        L'utilisateur recevra automatiquement un mail.
                    </div>
                    <div v-if="isHoverSendAccess">
                        L’utilisateur va recevoir un mail avec un lien
                        d'activation.
                    </div>
                    <div v-if="isHoverDisableAccess">
                        L’utilisateur ne pourra plus se connecter, les données
                        partagées seront conservées.
                    </div>
                </div>

                <div
                    v-if="validation.error"
                    class="text-error flex justify-end"
                >
                    {{ validation.error }}
                </div>
            </div>

            <LoadingPage v-else-if="state === 'loading'" />
            <LoadingError v-else>
                L'utilisateur demandé n'existe pas en base de données.
            </LoadingError>
        </PrivateContainer>
    </PrivateLayout>
</template>

<script>
import PrivateLayout from "#app/components/PrivateLayout";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer.vue";
import LoadingPage from "#app/components/PrivateLayout/LoadingPage.vue";
import LoadingError from "#app/components/PrivateLayout/LoadingError.vue";
import UserValidateComment from "./UserValidateComment/UserValidateComment";
import UserValidateDetails from "./UserValidateDetails/UserValidateDetails";
import UserValidateAccessStatus from "./UserValidateAccessStatus/UserValidateAccessStatus";
import UserValidateRequestMessage from "./UserValidateRequestMessage";
import UserValidateAccessSettings from "./UserValidateAccessSettings/UserValidateAccessSettings";
import {
    denyAccess,
    get,
    remove,
    sendActivationLink,
    updateLocalAdmin,
    setRoleRegular
} from "#frontend/common/api/user";

import { notify } from "#helpers/notificationHelper";

export default {
    components: {
        PrivateLayout,
        PrivateContainer,
        UserValidateComment,
        UserValidateAccessStatus,
        UserValidateDetails,
        UserValidateRequestMessage,
        UserValidateAccessSettings,
        LoadingPage,
        LoadingError
    },
    data() {
        return {
            /**
             * @type {User}
             */
            user: null,

            /**
             * The error's user message
             *
             * Obivously, null if there is no error
             *
             * @type {string|null}
             */
            error: null,

            /**
             * The current state of the page
             *
             * One out of: 'loading', 'error', or 'loaded'
             *
             * @type {string|null}
             */
            state: null,

            /**
             * Validation state
             *
             * @type {Object}
             */
            validation: {
                loading: null,
                error: null
            },

            /**
             * List of checked options
             *
             * @type {Object.<String,Boolean>}
             */
            checkedOptions: [],

            isHoverSendAccess: false,
            isHoverDisableAccess: false,
            isHoverDenyAccess: false
        };
    },

    computed: {
        loggedUser() {
            return this.$store.state.config.configuration.user;
        },

        permissions() {
            return this.$store.state.config.configuration
                .permissions_description;
        },

        /**
         * Details about the permissions requested by the user
         *
         * @returns {Object}
         */
        permission() {
            if (!this.user) {
                return null;
            }

            return this.permissions[this.user.role_id];
        },

        /**
         * Get the allowed options for the current user
         *
         * @returns {Array}
         */
        options() {
            if (this.user === null || !this.permission) {
                return [];
            }

            return this.permission.options;
        },

        /**
         * Indicates whether the activation link is now expired
         *
         * @returns {Boolean}
         */
        isExpired() {
            const now = Date.now();

            return (
                this.user !== null &&
                this.user.status !== "active" &&
                this.user.user_accesses.length > 0 &&
                now - this.user.user_accesses[0].expires_at * 1000 > 0
            );
        }
    },

    created() {
        this.load();
    },

    methods: {
        formatDate(...args) {
            return App.formatDate.call(App, ...args);
        },

        /**
         * Tries fetching the data from the API
         *
         * Please note that this cannot be done if the data has already been loaded
         * before.
         */
        async load() {
            // loading data is forbidden if the component is already loading or loaded
            if ([null, "error"].indexOf(this.state) === -1) {
                return;
            }

            this.state = "loading";
            this.error = null;

            try {
                const user = await get(this.$route.params.id);
                this.user = user;
                this.checkedOptions = user.permission_options;
                this.state = "loaded";
            } catch ({ user_message: error }) {
                this.error = error;
                this.state = "error";
            }
        },

        /**
         * Alias to load(), for better readibility in the view
         *
         * @see load()
         */
        retryLoading() {
            this.load();
        },

        /**
         * Allows access to the user
         */
        async validate() {
            if (this.validation.loading) {
                return;
            }

            this.validation.loading = "validate";
            this.validation.error = null;

            try {
                await sendActivationLink(this.$route.params.id, {
                    options: {
                        close_shantytown: this.checkedOptions.includes(
                            "close_shantytown"
                        ),
                        create_and_close_shantytown: this.checkedOptions.includes(
                            "create_and_close_shantytown"
                        ),
                        access_justice: this.checkedOptions.includes(
                            "access_justice"
                        )
                    }
                });
                this.$trackMatomoEvent("Demande d'accès", "Approuver accès");

                notify({
                    group: "notifications",
                    type: "success",
                    title: "Accès envoyé",
                    text: "Un accès a été envoyé à l'utilisateur"
                });

                this.$router.push("/liste-des-utilisateurs");
            } catch ({ user_message: error }) {
                this.validation.error = error;
            }

            this.validation.loading = null;
        },

        /**
         * Denies access to the user
         */
        async deny() {
            if (this.validation.loading) {
                return;
            }

            this.validation.loading = "deny";
            this.validation.error = null;

            try {
                await denyAccess(this.$route.params.id);

                this.$trackMatomoEvent("Demande d'accès", "Refuser accès");
                notify({
                    group: "notifications",
                    type: "success",
                    title: "Accès refusé",
                    text: "L'utilisateur a été supprimé de la base"
                });

                this.$router.push("/liste-des-utilisateurs");
            } catch ({ user_message: error }) {
                this.validation.error = error;
            }

            this.validation.loading = null;
        },

        async upgradeLocalAdmin() {
            if (this.validation.loading) {
                return;
            }

            // eslint-disable-next-line no-alert
            if (
                !window.confirm(
                    "Êtes-vous sûr de vouloir passer cet utilisateur administrateur local ?"
                )
            ) {
                return;
            }

            this.validation.loading = "upgrade";
            this.validation.error = null;

            try {
                await updateLocalAdmin(this.$route.params.id, true);
                window.location.reload();
            } catch ({ user_message: error }) {
                this.validation.error = error;
            }

            this.validation.loading = null;
        },

        async downgradeLocalAdmin() {
            if (this.validation.loading) {
                return;
            }

            // eslint-disable-next-line no-alert
            if (
                !window.confirm(
                    "Êtes-vous sûr de vouloir retirer à cet utilisateur les droits d'administrateur local ?"
                )
            ) {
                return;
            }

            this.validation.loading = "downgrade";
            this.validation.error = null;

            try {
                await updateLocalAdmin(this.$route.params.id, false);
                window.location.reload();
            } catch ({ user_message: error }) {
                this.validation.error = error;
            }

            this.validation.loading = null;
        },

        /**
         *
         */
        async remove() {
            if (this.validation.loading) {
                return;
            }

            // eslint-disable-next-line no-alert
            if (
                !window.confirm(
                    "Êtes-vous sûr de vouloir supprimer cet accès ?"
                )
            ) {
                return;
            }

            this.validation.loading = "remove";
            this.validation.error = null;

            try {
                await remove(this.$route.params.id);

                notify({
                    group: "notifications",
                    type: "success",
                    title: "Accès supprimé",
                    text: "L'utilisateur a été supprimé de la base"
                });

                this.$router.push("/liste-des-utilisateurs");
            } catch ({ user_message: error }) {
                this.validation.error = error;
            }

            this.validation.loading = null;
        },

        async setIntervenant() {
            if (this.validation.loading) {
                return;
            }

            // eslint-disable-next-line no-alert
            if (
                !window.confirm(
                    "Êtes-vous sûr de vouloir accorder le statut d'intervenant à cet utilisateur ?"
                )
            ) {
                return;
            }

            this.validation.loading = "intervenant";
            this.validation.error = null;

            try {
                await setRoleRegular(this.user.id, "intervener");
                window.location.reload();
            } catch ({ user_message: error }) {
                this.validation.error = error;
            }

            this.validation.loading = null;
        }
    }
};
</script>
